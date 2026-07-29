import { AnimatePresence, motion } from "framer-motion";
import { usePresence } from "../hooks/usePresence";
import type { PresenceState } from "../types";

const DOT: Record<PresenceState, string> = {
  resting: "bg-gray-500",
  settling: "bg-indigo-400",
  focused: "bg-emerald-400",
  drifting: "bg-amber-400",
  away: "bg-gray-400",
};

export const PresenceBar = ({ streak = 0 }: { streak?: number }) => {
  const { state, message, intervention } = usePresence(streak);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3 pointer-events-none">
      {/* Interventions are transient and never stack on the ambient line. */}
      <AnimatePresence>
        {intervention && (
          <motion.div
            key={intervention.key}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-sm px-5 py-3.5 rounded-2xl bg-[#121427]/95 backdrop-blur-xl border border-indigo-500/20 text-[13px] text-gray-200 leading-relaxed shadow-2xl shadow-indigo-500/10"
          >
            {intervention.message}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layout
        className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/[0.07] backdrop-blur-xl border border-white/10 text-white text-[13px] shadow-2xl shadow-black/20"
      >
        <span className="relative flex h-2 w-2">
          {state === "focused" && (
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
          )}
          <span className={`relative inline-flex h-2 w-2 rounded-full ${DOT[state]}`} />
        </span>
        <span className="text-gray-200">{message}</span>
      </motion.div>
    </div>
  );
};
