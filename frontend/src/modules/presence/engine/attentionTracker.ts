import type { AttentionSnapshot, PresenceEvent } from "../types";

const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "wheel",
  "touchstart",
] as const;

/** No interaction for this long means they have probably stepped away. */
export const IDLE_THRESHOLD_MS = 60_000;

/** How long a return counts as "just got back". */
const RECENT_RETURN_MS = 30_000;

type TrackerOptions = {
  onEvent: (event: PresenceEvent) => void;
  onChange?: () => void;
  now?: () => number;
};

/**
 * Captures the raw attention signals: tab visibility and user idleness.
 *
 * Deliberately dumb — it reports what happened and never decides what it
 * means. Interpretation lives in presenceEngine, which stays pure and
 * testable as a result.
 */
export class AttentionTracker {
  private onEvent: TrackerOptions["onEvent"];
  private onChange: () => void;
  private now: () => number;

  private lastActivityAt: number;
  private hiddenAt: number | null = null;
  private idleSince: number | null = null;
  private returnedAt: number | null = null;
  private switchCount = 0;
  private idleCheck: ReturnType<typeof setInterval> | null = null;
  private started = false;

  constructor(options: TrackerOptions) {
    this.onEvent = options.onEvent;
    this.onChange = options.onChange ?? (() => {});
    this.now = options.now ?? (() => Date.now());
    this.lastActivityAt = this.now();
  }

  start() {
    if (this.started || typeof document === "undefined") return;
    this.started = true;

    document.addEventListener("visibilitychange", this.handleVisibilityChange);
    ACTIVITY_EVENTS.forEach((name) =>
      window.addEventListener(name, this.handleActivity, { passive: true })
    );
    this.idleCheck = setInterval(this.checkIdle, 5_000);
  }

  stop() {
    if (!this.started) return;
    this.started = false;

    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    ACTIVITY_EVENTS.forEach((name) =>
      window.removeEventListener(name, this.handleActivity)
    );
    if (this.idleCheck) {
      clearInterval(this.idleCheck);
      this.idleCheck = null;
    }
  }

  /** Called when a new focus block begins, so counts are per-session. */
  resetSession() {
    this.switchCount = 0;
    this.returnedAt = null;
    this.idleSince = null;
    this.lastActivityAt = this.now();
    this.onChange();
  }

  snapshot(): AttentionSnapshot {
    const now = this.now();
    return {
      visible: typeof document === "undefined" || !document.hidden,
      idleMs: now - this.lastActivityAt,
      msSinceReturn:
        this.returnedAt !== null && now - this.returnedAt <= RECENT_RETURN_MS
          ? now - this.returnedAt
          : null,
      switchCount: this.switchCount,
    };
  }

  private handleVisibilityChange = () => {
    const now = this.now();

    if (document.hidden) {
      this.hiddenAt = now;
      this.switchCount += 1;
      this.onEvent({ event_type: "tab_hidden" });
    } else {
      const awayMs = this.hiddenAt ? now - this.hiddenAt : 0;
      this.hiddenAt = null;
      this.returnedAt = now;
      // Coming back counts as activity; otherwise they look idle on return.
      this.lastActivityAt = now;
      this.onEvent({
        event_type: "tab_visible",
        duration_seconds: Math.round(awayMs / 1000),
      });
    }
    this.onChange();
  };

  private handleActivity = () => {
    const now = this.now();

    if (this.idleSince !== null) {
      const idleMs = now - this.idleSince;
      this.idleSince = null;
      this.returnedAt = now;
      this.onEvent({
        event_type: "idle_end",
        duration_seconds: Math.round(idleMs / 1000),
      });
      this.onChange();
    }
    this.lastActivityAt = now;
  };

  private checkIdle = () => {
    const now = this.now();
    const idleFor = now - this.lastActivityAt;

    if (idleFor >= IDLE_THRESHOLD_MS && this.idleSince === null) {
      this.idleSince = now - idleFor;
      this.onEvent({ event_type: "idle_start" });
      this.onChange();
    }
  };
}
