import { describe, expect, it } from "vitest";

import {
  decideIntervention,
  supportLevelForStreak
} from "./interventionEngine";
import type { InterventionInput } from "./interventionEngine";

const NOW = 1_800_000_000_000;

const input = (overrides: Partial<InterventionInput> = {}): InterventionInput => ({
  state: "focused",
  previousState: "focused",
  streak: 0,
  switchCount: 0,
  interruptions: 0,
  focusedStreakMs: 0,
  lastInterventionAt: null,
  now: NOW,
  ...overrides
});

describe("supportLevelForStreak", () => {
  it("leans in hardest during the first week", () => {
    expect(supportLevelForStreak(0)).toBe("high");
    expect(supportLevelForStreak(6)).toBe("high");
  });

  it("tapers as the habit establishes", () => {
    expect(supportLevelForStreak(7)).toBe("moderate");
    expect(supportLevelForStreak(21)).toBe("light");
  });

  it("backs off once the habit is formed (~2 months)", () => {
    expect(supportLevelForStreak(60)).toBe("minimal");
  });
});

describe("decideIntervention", () => {
  it("stays silent when nothing is happening", () => {
    expect(decideIntervention(input())).toBeNull();
  });

  it("never speaks while resting", () => {
    expect(decideIntervention(input({ state: "resting", previousState: "away" }))).toBeNull();
  });

  it("welcomes the user back after an absence", () => {
    const result = decideIntervention(
      input({ state: "focused", previousState: "away" })
    );
    expect(result?.key).toBe("welcome_back");
  });

  it("checks in when the user has gone away", () => {
    expect(decideIntervention(input({ state: "away", previousState: "focused" }))?.key)
      .toBe("idle_check");
  });

  it("suggests a break when interruptions pile up", () => {
    const result = decideIntervention(
      input({ state: "drifting", previousState: "focused", interruptions: 3 })
    );
    expect(result?.key).toBe("fatigue_break");
  });

  it("mentions drift only after repeated tab switches", () => {
    const base = { state: "drifting" as const, previousState: "focused" as const };
    expect(decideIntervention(input({ ...base, switchCount: 2 }))).toBeNull();
    expect(decideIntervention(input({ ...base, switchCount: 3 }))?.key).toBe("drift_check");
  });

  it("tolerates more switching once the habit is established", () => {
    const base = { state: "drifting" as const, previousState: "focused" as const, switchCount: 3 };
    expect(decideIntervention(input({ ...base, streak: 0 }))?.key).toBe("drift_check");
    expect(decideIntervention(input({ ...base, streak: 60 }))).toBeNull();
  });

  it("respects the cooldown", () => {
    const base = { state: "away" as const, previousState: "focused" as const };
    expect(
      decideIntervention(input({ ...base, lastInterventionAt: NOW - 30_000 }))
    ).toBeNull();
    expect(
      decideIntervention(input({ ...base, lastInterventionAt: NOW - 5 * 60_000 }))
    ).not.toBeNull();
  });

  it("widens the cooldown as support tapers", () => {
    const base = {
      state: "away" as const,
      previousState: "focused" as const,
      lastInterventionAt: NOW - 8 * 60_000
    };
    // 8 minutes is enough quiet for a new user, not for an established one.
    expect(decideIntervention(input({ ...base, streak: 0 }))).not.toBeNull();
    expect(decideIntervention(input({ ...base, streak: 30 }))).toBeNull();
  });

  it("acknowledges a long clean stretch, but not once the habit holds", () => {
    const base = {
      state: "focused" as const,
      previousState: "focused" as const,
      focusedStreakMs: 25 * 60_000
    };
    expect(decideIntervention(input({ ...base, streak: 3 }))?.key).toBe("deep_flow");
    expect(decideIntervention(input({ ...base, streak: 90 }))).toBeNull();
  });

  it("does not praise flow that was actually interrupted", () => {
    const result = decideIntervention(
      input({ state: "focused", focusedStreakMs: 25 * 60_000, switchCount: 4 })
    );
    expect(result?.key).not.toBe("deep_flow");
  });

  it("never phrases an intervention judgmentally", () => {
    const cases: InterventionInput[] = [
      input({ state: "focused", previousState: "away" }),
      input({ state: "away", previousState: "focused" }),
      input({ state: "drifting", previousState: "focused", interruptions: 3 }),
      input({ state: "drifting", previousState: "focused", switchCount: 5 }),
      input({ state: "focused", focusedStreakMs: 25 * 60_000 })
    ];

    cases.forEach((c) => {
      const message = decideIntervention(c)?.message;
      if (!message) return;
      expect(message).not.toMatch(/you failed|wasted|should have|lazy|again\?|stop being/i);
    });
  });
});
