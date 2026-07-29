import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import {
  ENERGY_OPTIONS,
  FOCUS_OPTIONS,
  submitCheckIn,
} from "../services/checkinService";

type Props = {
  open: boolean;
  onClose: () => void;
};

/**
 * Asks how the block actually felt.
 *
 * Always skippable and never blocking: a wellbeing prompt that nags becomes
 * one more source of pressure, which is the opposite of the point. Answering
 * is two taps; ignoring it costs nothing.
 */
export default function SessionCheckIn({ open, onClose }: Props) {
  const [energy, setEnergy] = useState<string | null>(null);
  const [focusQuality, setFocusQuality] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setEnergy(null);
    setFocusQuality(null);
    setNote("");
  };

  const dismiss = () => {
    reset();
    onClose();
  };

  const save = async () => {
    if (!energy || !focusQuality) return;
    setSaving(true);
    try {
      await submitCheckIn({
        energy,
        focus_quality: focusQuality,
        note: note.trim() || undefined,
      });
    } catch (error) {
      // A lost check-in is not worth interrupting them over.
      console.error("Check-in not saved", error);
    } finally {
      setSaving(false);
      dismiss();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={dismiss}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#0c0d1a] border border-white/10 rounded-[28px] p-7 shadow-2xl relative"
          >
            <button
              onClick={dismiss}
              className="absolute top-5 right-5 text-gray-500 hover:text-white transition"
              aria-label="Skip check-in"
            >
              <X size={18} />
            </button>

            <h2 className="text-[19px] font-bold text-white mb-1.5">
              Block complete. How did that feel?
            </h2>
            <p className="text-[13px] text-gray-400 mb-6 leading-relaxed">
              Only you know this — I can see the timer, not how you're doing.
            </p>

            <p className="text-[12px] font-semibold text-gray-300 mb-2.5">Energy</p>
            <div className="flex gap-2 mb-6">
              {ENERGY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setEnergy(option.value)}
                  title={option.label}
                  className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border text-[10px] transition ${
                    energy === option.value
                      ? "bg-indigo-600/20 border-indigo-500/50 text-indigo-200"
                      : "bg-white/[0.03] border-white/5 text-gray-400 hover:bg-white/5"
                  }`}
                >
                  <span className="text-lg">{option.emoji}</span>
                  {option.label}
                </button>
              ))}
            </div>

            <p className="text-[12px] font-semibold text-gray-300 mb-2.5">Focus quality</p>
            <div className="flex gap-2 mb-6">
              {FOCUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFocusQuality(option.value)}
                  title={option.label}
                  className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border text-[10px] transition ${
                    focusQuality === option.value
                      ? "bg-indigo-600/20 border-indigo-500/50 text-indigo-200"
                      : "bg-white/[0.03] border-white/5 text-gray-400 hover:bg-white/5"
                  }`}
                >
                  <span className="text-lg">{option.emoji}</span>
                  {option.label}
                </button>
              ))}
            </div>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={500}
              rows={2}
              placeholder="Anything worth remembering? (optional)"
              className="w-full bg-[#121427] border border-white/5 rounded-2xl px-4 py-3 text-[13px] text-white placeholder-gray-500 outline-none focus:border-indigo-500/40 resize-none mb-5"
            />

            <div className="flex gap-3">
              <button
                onClick={dismiss}
                className="px-5 py-3 rounded-xl text-[13px] font-medium text-gray-400 hover:text-white hover:bg-white/5 transition"
              >
                Skip
              </button>
              <button
                onClick={save}
                disabled={!energy || !focusQuality || saving}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/5 disabled:text-gray-600 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl text-[13px] font-semibold transition"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
