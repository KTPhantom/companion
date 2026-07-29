import { describe, expect, it, afterEach, vi } from "vitest";

import {
  calculateStreak,
  calculateFocusScore,
  getTopSubject
} from "./analytics";

import { getMostProductiveHour, getFocusIntensity } from "./patternAnalytics";

// Local-midnight anchored so day arithmetic matches the functions under test.
const daysAgo = (n: number) => {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

const session = (overrides: Record<string, unknown> = {}) => ({
  id: Math.random(),
  subject: "Deep Work",
  duration: 25,
  focus_score: 100,
  completed: true,
  started_at: daysAgo(0),
  ...overrides
});

afterEach(() => {
  vi.useRealTimers();
});

describe("calculateStreak", () => {
  it("is zero with no sessions", () => {
    expect(calculateStreak([])).toBe(0);
  });

  it("counts consecutive days", () => {
    const sessions = [0, 1, 2].map((n) => session({ started_at: daysAgo(n) }));
    expect(calculateStreak(sessions)).toBe(3);
  });

  it("stops at the first missed day", () => {
    const sessions = [0, 1, 3, 4].map((n) => session({ started_at: daysAgo(n) }));
    expect(calculateStreak(sessions)).toBe(2);
  });

  it("does not count a run that ended days ago", () => {
    const sessions = [7, 8, 9].map((n) => session({ started_at: daysAgo(n) }));
    expect(calculateStreak(sessions)).toBe(0);
  });

  it("keeps yesterday's streak alive before today's session", () => {
    const sessions = [1, 2].map((n) => session({ started_at: daysAgo(n) }));
    expect(calculateStreak(sessions)).toBe(2);
  });

  it("counts multiple sessions on one day once", () => {
    const sessions = [session(), session(), session()];
    expect(calculateStreak(sessions)).toBe(1);
  });
});

describe("calculateFocusScore", () => {
  it("is zero with no sessions", () => {
    expect(calculateFocusScore([])).toBe(0);
  });

  it("averages measured focus scores", () => {
    const sessions = [
      session({ focus_score: 100 }),
      session({ focus_score: 70 })
    ];
    expect(calculateFocusScore(sessions)).toBe(85);
  });

  it("ignores unmeasured (zero) scores from before instrumentation", () => {
    const sessions = [session({ focus_score: 0 }), session({ focus_score: 80 })];
    expect(calculateFocusScore(sessions)).toBe(80);
  });

  it("falls back to completion rate when nothing is measured", () => {
    const sessions = [
      session({ focus_score: 0, completed: true }),
      session({ focus_score: 0, completed: false })
    ];
    expect(calculateFocusScore(sessions)).toBe(50);
  });
});

describe("getTopSubject", () => {
  it("reports the most frequent subject", () => {
    const sessions = [
      session({ subject: "Math" }),
      session({ subject: "Math" }),
      session({ subject: "Physics" })
    ];
    expect(getTopSubject(sessions)).toBe("Math");
  });

  it("handles the empty case", () => {
    expect(getTopSubject([])).toBe("No Data");
  });
});

describe("getMostProductiveHour", () => {
  it("returns null with no sessions", () => {
    expect(getMostProductiveHour([])).toBeNull();
  });

  it("picks the hour with the most sessions, in local time", () => {
    const at = (hour: number) => {
      const d = new Date();
      d.setHours(hour, 0, 0, 0);
      return d.toISOString();
    };
    const sessions = [
      session({ started_at: at(9) }),
      session({ started_at: at(9) }),
      session({ started_at: at(22) })
    ];
    expect(getMostProductiveHour(sessions)).toBe(9);
  });
});

describe("getFocusIntensity", () => {
  it("labels deep work", () => {
    expect(getFocusIntensity(180, 2)).toBe("Deep Work");
  });

  it("handles no sessions", () => {
    expect(getFocusIntensity(0, 0)).toBe("No Data");
  });
});
