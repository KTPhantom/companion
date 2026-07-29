import { useEffect } from "react";

import { useFocusStore } from "../store/focusStore";
import { createSession } from "../services/focusService";

export const useFocusTimer = () => {
  const {
    isRunning,
    timeLeft,
    totalTime,
    sessionType,
    interruptions,
    tick,
    startBreak,
    startFocus,
    subject
  } = useFocusStore();

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(async () => {
      if (timeLeft <= 1) {
        clearInterval(interval);

        if (sessionType === "focus") {
          try {
            // Record what actually happened: real duration and a focus
            // score derived from interruptions (each pause costs 15 points).
            const minutes = Math.max(1, Math.round(totalTime / 60));
            const focusScore = Math.max(20, 100 - interruptions * 15);
            await createSession(subject, minutes, focusScore);
          } catch (error) {
            console.error("Session save failed", error);
          }
          startBreak();
        } else {
          startFocus();
        }
        return;
      }

      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [
    isRunning,
    timeLeft,
    totalTime,
    sessionType,
    interruptions,
    tick,
    startBreak,
    startFocus,
    subject
  ]);
};
