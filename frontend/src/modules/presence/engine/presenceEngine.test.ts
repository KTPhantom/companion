import { describe, expect, it } from "vitest";

import { derivePresenceState, presenceMessage, AWAY_THRESHOLD_MS } from "./presenceEngine";
import { IDLE_THRESHOLD_MS } from "./attentionTracker";
import type { AttentionSnapshot } from "../types";

const attention = (overrides: Partial<AttentionSnapshot> = {}): AttentionSnapshot => ({
  visible: true,
  idleMs: 0,
  msSinceReturn: null,
  switchCount: 0,
  ...overrides
});

const input = (overrides: Record<string, unknown> = {}) => ({
  isRunning: true,
  sessionType: "focus" as const,
  elapsedMs: 5 * 60_000,
  attention: attention(),
  ...overrides
});

describe("derivePresenceState", () => {
  it("rests when no session is running", () => {
    expect(derivePresenceState(input({ isRunning: false }))).toBe("resting");
  });

  it("rests during a break so the companion stays quiet", () => {
    expect(derivePresenceState(input({ sessionType: "break" }))).toBe("resting");
  });

  it("settles at the start of a block", () => {
    expect(derivePresenceState(input({ elapsedMs: 10_000 }))).toBe("settling");
  });

  it("is focused when present and active", () => {
    expect(derivePresenceState(input())).toBe("focused");
  });

  it("drifts when the tab is hidden briefly", () => {
    expect(
      derivePresenceState(input({ attention: attention({ visible: false }) }))
    ).toBe("drifting");
  });

  it("drifts when idle past the idle threshold", () => {
    expect(
      derivePresenceState(input({ attention: attention({ idleMs: IDLE_THRESHOLD_MS + 1 }) }))
    ).toBe("drifting");
  });

  it("is away when idle a long time", () => {
    expect(
      derivePresenceState(input({ attention: attention({ idleMs: AWAY_THRESHOLD_MS + 1 }) }))
    ).toBe("away");
  });

  it("is away when hidden and idle a long time", () => {
    expect(
      derivePresenceState(
        input({ attention: attention({ visible: false, idleMs: AWAY_THRESHOLD_MS + 1 }) })
      )
    ).toBe("away");
  });
});

describe("presenceMessage", () => {
  it("has a line for every state", () => {
    const states = ["resting", "settling", "focused", "drifting", "away"] as const;
    states.forEach((s) => expect(presenceMessage(s).length).toBeGreaterThan(0));
  });

  it("never counts absence back at the user", () => {
    // Research gap 4: a judgmental presence backfires.
    const states = ["resting", "settling", "focused", "drifting", "away"] as const;
    states.forEach((s) => {
      expect(presenceMessage(s)).not.toMatch(/away for|you left|distracted|wasted|failed/i);
    });
  });
});
