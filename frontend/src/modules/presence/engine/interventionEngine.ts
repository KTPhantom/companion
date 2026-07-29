import type { Intervention, InterventionKey, PresenceState } from "../types";

/**
 * Support tapers as the habit establishes.
 *
 * Lally (2010) found the largest automaticity gains come from early
 * repetitions, plateauing near ~2 months — so the companion leans in hardest
 * during weeks 1-6 and steps back afterwards rather than nagging someone
 * whose habit already holds (docs/research-foundation.md #2).
 */
export type SupportLevel = "high" | "moderate" | "light" | "minimal";

export const supportLevelForStreak = (streak: number): SupportLevel => {
  if (streak < 7) return "high";
  if (streak < 21) return "moderate";
  if (streak < 42) return "light";
  return "minimal";
};

/** Minimum quiet time between interventions, widening as support tapers. */
const COOLDOWN_MS: Record<SupportLevel, number> = {
  high: 3 * 60_000,
  moderate: 6 * 60_000,
  light: 12 * 60_000,
  minimal: 25 * 60_000,
};

/** Tab switches within one block before the companion mentions it. */
const DRIFT_SWITCH_THRESHOLD: Record<SupportLevel, number> = {
  high: 3,
  moderate: 4,
  light: 6,
  minimal: 8,
};

/**
 * Copy rules: acknowledge, then offer one small next action. Never count
 * someone's failures back at them, never imply guilt. The literature warns
 * that a judgmental presence backfires (docs/research-foundation.md #7, gap 4).
 */
const MESSAGES: Record<InterventionKey, string> = {
  welcome_back: "Welcome back. Pick up where you left off — no catching up needed.",
  drift_check:
    "A few switches this block. Closing the extra tabs usually makes the next stretch easier.",
  idle_check: "Still with it? No rush — I'll be here when you start again.",
  fatigue_break:
    "That's several interruptions. A short break often resets focus better than pushing through.",
  deep_flow: "Long clean stretch. This is the state worth protecting.",
};

export type InterventionInput = {
  state: PresenceState;
  previousState: PresenceState;
  streak: number;
  /** Tab switches during the current focus block. */
  switchCount: number;
  /** Interruptions (pauses) recorded for the current block. */
  interruptions: number;
  /** Uninterrupted focused time in the current block, ms. */
  focusedStreakMs: number;
  /** When the last intervention fired, epoch ms. Null if none yet. */
  lastInterventionAt: number | null;
  now: number;
};

const DEEP_FLOW_MS = 20 * 60_000;

/**
 * Decides whether the companion should say something right now.
 *
 * Returns null far more often than not — that is the point. Presence means
 * being available, not commenting on everything.
 */
export const decideIntervention = (
  input: InterventionInput
): Intervention | null => {
  const {
    state,
    previousState,
    streak,
    switchCount,
    interruptions,
    focusedStreakMs,
    lastInterventionAt,
    now,
  } = input;

  const support = supportLevelForStreak(streak);

  if (lastInterventionAt !== null && now - lastInterventionAt < COOLDOWN_MS[support]) {
    return null;
  }

  // Never interrupt a break or an idle screen.
  if (state === "resting") return null;

  const cameBack =
    (previousState === "away" || previousState === "drifting") &&
    (state === "focused" || state === "settling");

  if (cameBack) {
    return { key: "welcome_back", message: MESSAGES.welcome_back };
  }

  // Repeated interruptions read as fatigue, which the research says to meet
  // with rest rather than pressure (#10).
  if (interruptions >= 3 && (state === "drifting" || state === "away")) {
    return { key: "fatigue_break", message: MESSAGES.fatigue_break };
  }

  if (state === "drifting" && switchCount >= DRIFT_SWITCH_THRESHOLD[support]) {
    return { key: "drift_check", message: MESSAGES.drift_check };
  }

  if (state === "away") {
    return { key: "idle_check", message: MESSAGES.idle_check };
  }

  // Positive reinforcement stays rare, and stops once the habit is holding.
  if (
    state === "focused" &&
    focusedStreakMs >= DEEP_FLOW_MS &&
    switchCount === 0 &&
    support !== "minimal"
  ) {
    return { key: "deep_flow", message: MESSAGES.deep_flow };
  }

  return null;
};
