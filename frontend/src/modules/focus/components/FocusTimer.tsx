import { useFocusStore } from "../store/focusStore";
import { useFocusTimer } from "../hooks/useFocusTimer";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";

export default function FocusTimer() {
  useFocusTimer();

  const {
    timeLeft,
    isRunning,
    sessionType,
    interruptions,
    startTimer,
    pauseTimer,
    resetTimer
  } = useFocusStore();

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div>
      <h2 className="text-[72px] font-bold text-white leading-none mb-6 tracking-tighter">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </h2>

      <div className="flex gap-3 mb-8">
        <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-md border border-white/5 px-3 py-1.5 rounded-full text-[12px] text-gray-300">
          {sessionType === "focus" ? (
            <><span className="text-indigo-400">🎯</span> Focus Block</>
          ) : (
            <><span className="text-green-400">🍃</span> Break — recover</>
          )}
        </div>
        <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-md border border-white/5 px-3 py-1.5 rounded-full text-[12px] text-gray-300">
          <span className="text-purple-400">🔁</span> 25/5 Cycle
        </div>
        {interruptions > 0 && sessionType === "focus" && (
          <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-md border border-white/5 px-3 py-1.5 rounded-full text-[12px] text-amber-300">
            ⚡ {interruptions} interruption{interruptions > 1 ? "s" : ""}
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-8">
        {!isRunning ? (
          <motion.button
            onClick={startTimer}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white text-black px-6 py-3.5 rounded-xl font-bold text-[14px] flex items-center gap-2 hover:bg-gray-100 transition"
          >
            <Play size={16} fill="currentColor" /> Start Focus
          </motion.button>
        ) : (
          <motion.button
            onClick={pauseTimer}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-yellow-500 text-black px-6 py-3.5 rounded-xl font-bold text-[14px] flex items-center gap-2 hover:bg-yellow-400 transition"
          >
            <Pause size={16} fill="currentColor" /> Pause
          </motion.button>
        )}

        <motion.button
          onClick={resetTimer}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white/10 backdrop-blur-md border border-white/10 text-white px-6 py-3.5 rounded-xl font-bold text-[14px] hover:bg-white/20 transition flex items-center gap-2"
        >
          <RotateCcw size={16} /> Reset
        </motion.button>
      </div>
    </div>
  );
}