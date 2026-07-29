import type { AttentionSnapshot, PresenceState } from "../types";
import { IDLE_THRESHOLD_MS } from "./attentionTracker";

/** Away from the tab or idle past this point means the thread is likely lost. */
export const AWAY_THRESHOLD_MS = 3 * 60_000;

/** The opening stretch of a block, before focus has settled. */
const SETTLING_MS = 60_000;

export type PresenceInput = {
  isRunning: boolean;
  sessionType: "focus" | "break";
  elapsedMs: number;
  attention: AttentionSnapshot;
};

/**
 * Derives the companion's belief about the user's attention.
 *
 * Pure by design: no timers, no DOM, no network — so the rules that decide
 * when the companion speaks can be tested exhaustively.
 */
export const derivePresenceState = (input: PresenceInput): PresenceState => {
  const { isRunning, sessionType, elapsedMs, attention } = input;

  if (!isRunning || sessionType === "break") return "resting";

  if (!attention.visible) {
    return attention.idleMs >= AWAY_THRESHOLD_MS ? "away" : "drifting";
  }

  if (attention.idleMs >= AWAY_THRESHOLD_MS) return "away";
  if (attention.idleMs >= IDLE_THRESHOLD_MS) return "drifting";

  if (elapsedMs < SETTLING_MS) return "settling";

  return "focused";
};

const MESSAGES: Record<PresenceState, string> = {
  resting: "Ready when you are.",
  settling: "Settling in. I'm here.",
  focused: "With you.",
  drifting: "Still here whenever you're ready.",
  away: "I'll keep your place.",
};

/**
 * The ambient presence line.
 *
 * Body-doubling research (docs/research-foundation.md #7) is explicit that a
 * judgmental presence backfires, so these never mention how long someone was
 * gone or imply they failed — the companion just stays present.
 */
export const presenceMessage = (state: PresenceState): string => MESSAGES[state];
