import { create } from "zustand";

interface FocusState {
  totalTime: number;
  timeLeft: number;
  isRunning: boolean;
  sessionType: "focus" | "break";
  subject: string;
  // Pauses during a focus block = interruptions. They feed the real focus
  // score (docs/research-foundation.md #10, #12).
  interruptions: number;
  setSubject: (subject: string) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  startBreak: () => void;
  startFocus: () => void;
  tick: () => void;
}

const FOCUS_DURATION = 25 * 60; // 25-minute deep-work block
const BREAK_DURATION = 5 * 60; // 5-minute recovery break (Wendsche meta-analysis)

export const useFocusStore = create<FocusState>((set) => ({
  totalTime: FOCUS_DURATION,
  timeLeft: FOCUS_DURATION,
  isRunning: false,
  sessionType: "focus",
  subject: "Deep Work",
  interruptions: 0,

  setSubject: (subject) => set({ subject }),

  startTimer: () => set({ isRunning: true }),

  pauseTimer: () =>
    set((state) => ({
      isRunning: false,
      // Pausing mid-focus is an interruption; pausing a break is not.
      interruptions:
        state.sessionType === "focus" && state.isRunning
          ? state.interruptions + 1
          : state.interruptions
    })),

  resetTimer: () =>
    set({
      isRunning: false,
      sessionType: "focus",
      totalTime: FOCUS_DURATION,
      timeLeft: FOCUS_DURATION,
      interruptions: 0
    }),

  // Break auto-starts when a focus block completes.
  startBreak: () =>
    set({
      sessionType: "break",
      totalTime: BREAK_DURATION,
      timeLeft: BREAK_DURATION,
      isRunning: true,
      interruptions: 0
    }),

  // After the break, arm the next focus block but wait for the user to start.
  startFocus: () =>
    set({
      sessionType: "focus",
      totalTime: FOCUS_DURATION,
      timeLeft: FOCUS_DURATION,
      isRunning: false,
      interruptions: 0
    }),

  tick: () =>
    set((state) => ({
      timeLeft: state.timeLeft > 0 ? state.timeLeft - 1 : 0
    }))
}));
