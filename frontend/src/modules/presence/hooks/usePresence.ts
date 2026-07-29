import { useEffect, useMemo, useRef, useState } from "react";

import { useFocusStore } from "../../focus/store/focusStore";
import { AttentionTracker } from "../engine/attentionTracker";
import { derivePresenceState, presenceMessage } from "../engine/presenceEngine";
import { decideIntervention } from "../engine/interventionEngine";
import {
  recordPresenceEvent,
  flushPresenceEvents,
  flushPresenceEventsOnUnload,
} from "../services/presenceService";
import type { Intervention, PresenceState } from "../types";

const TICK_MS = 5_000;
const INTERVENTION_VISIBLE_MS = 12_000;

/** A returned-to-focus within this window counts the intervention as followed. */
const FOLLOW_WINDOW_MS = 90_000;

export const usePresence = (streak: number = 0) => {
  const { isRunning, sessionType, totalTime, timeLeft, interruptions, subject } =
    useFocusStore();

  const [state, setState] = useState<PresenceState>("resting");
  const [intervention, setIntervention] = useState<Intervention | null>(null);

  const trackerRef = useRef<AttentionTracker | null>(null);
  const previousStateRef = useRef<PresenceState>("resting");
  const lastInterventionAtRef = useRef<number | null>(null);
  const pendingFollowRef = useRef<{ key: string; at: number } | null>(null);
  const focusedSinceRef = useRef<number | null>(null);

  // Latest values without re-creating the tracker on every tick.
  const liveRef = useRef({ isRunning, sessionType, totalTime, timeLeft, interruptions, streak, subject });
  liveRef.current = { isRunning, sessionType, totalTime, timeLeft, interruptions, streak, subject };

  const tracker = useMemo(
    () =>
      new AttentionTracker({
        onEvent: (event) =>
          recordPresenceEvent({ ...event, subject: liveRef.current.subject }),
      }),
    []
  );

  useEffect(() => {
    trackerRef.current = tracker;
    tracker.start();

    const onUnload = () => flushPresenceEventsOnUnload();
    window.addEventListener("pagehide", onUnload);

    return () => {
      tracker.stop();
      window.removeEventListener("pagehide", onUnload);
      void flushPresenceEvents();
    };
  }, [tracker]);

  // A new focus block resets per-session counters.
  useEffect(() => {
    if (isRunning && sessionType === "focus") {
      tracker.resetSession();
      focusedSinceRef.current = Date.now();
      recordPresenceEvent({ event_type: "focus_start", subject });
    }
    // Only when a block actually begins.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, sessionType]);

  useEffect(() => {
    const evaluate = () => {
      const live = liveRef.current;
      const attention = tracker.snapshot();
      const elapsedMs = (live.totalTime - live.timeLeft) * 1000;

      const next = derivePresenceState({
        isRunning: live.isRunning,
        sessionType: live.sessionType,
        elapsedMs,
        attention,
      });

      const previous = previousStateRef.current;
      const now = Date.now();

      // Uninterrupted focused time, for the rare deep-flow acknowledgement.
      if (next === "focused") {
        focusedSinceRef.current ??= now;
      } else {
        focusedSinceRef.current = null;
      }

      // Efficacy measurement: did a nudge actually bring them back? The
      // body-doubling evidence is self-reported, so we measure our own.
      const pending = pendingFollowRef.current;
      if (pending && next === "focused" && previous !== "focused") {
        if (now - pending.at <= FOLLOW_WINDOW_MS) {
          recordPresenceEvent({
            event_type: "intervention_followed",
            intervention_key: pending.key,
            duration_seconds: Math.round((now - pending.at) / 1000),
          });
        }
        pendingFollowRef.current = null;
      }

      const decision = decideIntervention({
        state: next,
        previousState: previous,
        streak: live.streak,
        switchCount: attention.switchCount,
        interruptions: live.interruptions,
        focusedStreakMs: focusedSinceRef.current
          ? now - focusedSinceRef.current
          : 0,
        lastInterventionAt: lastInterventionAtRef.current,
        now,
      });

      if (decision) {
        lastInterventionAtRef.current = now;
        pendingFollowRef.current = { key: decision.key, at: now };
        setIntervention(decision);
        recordPresenceEvent({
          event_type: "intervention_shown",
          intervention_key: decision.key,
          subject: live.subject,
        });
        setTimeout(() => setIntervention(null), INTERVENTION_VISIBLE_MS);
      }

      previousStateRef.current = next;
      setState(next);
    };

    evaluate();
    const interval = setInterval(evaluate, TICK_MS);
    return () => clearInterval(interval);
  }, [tracker]);

  return {
    state,
    message: presenceMessage(state),
    intervention,
  };
};
