import { create } from "zustand";

interface FocusState {

  totalTime: number;

  timeLeft: number;

  isRunning: boolean;

  sessionType: "focus" | "break";

  subject: string;

  setSubject: (subject: string) => void;

  startTimer: () => void;

  pauseTimer: () => void;

  resetTimer: () => void;

  tick: () => void;
}

const FOCUS_DURATION = 10 ;

export const useFocusStore =
  create<FocusState>((set) => ({

    totalTime: 10,

    timeLeft: FOCUS_DURATION,

    isRunning: false,

    sessionType: "focus",

    startTimer: () =>
      set({ isRunning: true }),

    pauseTimer: () =>
      set({ isRunning: false }),

    resetTimer: () =>
      set({

        isRunning: false,

        timeLeft: FOCUS_DURATION
      }),
    subject: "Deep Work",

setSubject: (subject) =>
  set({ subject }),

    tick: () =>
      set((state) => ({

        timeLeft:
          state.timeLeft > 0
            ? state.timeLeft - 1
            : 0
      }))
  }));