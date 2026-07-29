export type PresenceEventType =
  | "focus_start"
  | "focus_complete"
  | "focus_abandon"
  | "tab_hidden"
  | "tab_visible"
  | "idle_start"
  | "idle_end"
  | "intervention_shown"
  | "intervention_followed";

export type PresenceEvent = {
  event_type: PresenceEventType;
  occurred_at?: string;
  subject?: string;
  duration_seconds?: number;
  intervention_key?: string;
};

/** What the companion currently believes about the user's attention. */
export type PresenceState =
  | "resting" // no session running
  | "settling" // session just started
  | "focused" // present and working
  | "drifting" // brief switch away or short idle
  | "away"; // gone long enough to have lost the thread

export type AttentionSnapshot = {
  /** Tab is the active, visible one. */
  visible: boolean;
  /** Time since the last real interaction, in ms. */
  idleMs: number;
  /** Time since they came back from the last absence, in ms. */
  msSinceReturn: number | null;
  /** Times they left the tab during the current focus block. */
  switchCount: number;
};

export type InterventionKey =
  | "welcome_back"
  | "drift_check"
  | "idle_check"
  | "fatigue_break"
  | "deep_flow";

export type Intervention = {
  key: InterventionKey;
  message: string;
};
