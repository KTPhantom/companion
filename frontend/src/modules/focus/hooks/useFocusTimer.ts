import { useEffect } from "react";

import {
  useFocusStore
} from "../store/focusStore";

import {
  createSession
} from "../services/focusService";

export const useFocusTimer = () => {

  const {

    isRunning,
    timeLeft,
    tick,
    resetTimer,
    subject

  } = useFocusStore();

  useEffect(() => {

    if (!isRunning) return;

    const interval = setInterval(async () => {

      if (timeLeft <= 1) {

        clearInterval(interval);

        try {

          const token =
            localStorage.getItem("token");

          if (token) {

            await createSession(
              token,
              subject,
              50
            );
          }

        } catch (error) {

          console.error(
            "Session save failed",
            error
          );
        }

        resetTimer();

        return;
      }

      tick();

    }, 1000);

    return () => clearInterval(interval);

  }, [
    isRunning,
    timeLeft,
    tick,
    resetTimer,
    subject
  ]);
};