import { useEffect, useRef, useState } from "react";
import { Check, Edit3 } from "lucide-react";

import { useFocusStore } from "../store/focusStore";

const PRESETS = ["Deep Work", "Study", "Reading", "Writing", "Coding", "Revision"];

/**
 * Lets the user name what they're working on.
 *
 * Until this existed every session recorded as "Deep Work", which made
 * `top_subject` a constant and stripped the meaning out of the companion's
 * "your strongest area" insight.
 */
export default function SubjectPicker() {
  const { subject, setSubject, isRunning } = useFocusStore();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(subject);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickAway = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickAway);
    return () => document.removeEventListener("mousedown", onClickAway);
  }, [open]);

  const commit = (value: string) => {
    const cleaned = value.trim().slice(0, 60);
    if (cleaned) setSubject(cleaned);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative inline-flex items-center gap-3">
      <span className="text-gray-300 text-[14px]">{subject}</span>

      <button
        type="button"
        onClick={() => {
          setDraft(subject);
          setOpen((v) => !v);
        }}
        // Changing subject mid-block would misattribute the session.
        disabled={isRunning}
        title={isRunning ? "Finish or reset the block to change subject" : "Change subject"}
        className="bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed p-1.5 rounded-full transition text-gray-400"
      >
        <Edit3 size={12} />
      </button>

      {open && (
        <div className="absolute top-9 left-0 z-30 w-60 bg-[#121427] border border-white/10 rounded-2xl p-2 shadow-2xl">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => commit(preset)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] text-gray-300 hover:bg-white/5 transition"
            >
              {preset}
              {preset === subject && <Check size={14} className="text-indigo-400" />}
            </button>
          ))}

          <div className="mt-2 pt-2 border-t border-white/5">
            <input
              value={draft}
              autoFocus
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commit(draft);
                if (e.key === "Escape") setOpen(false);
              }}
              placeholder="Or type your own…"
              maxLength={60}
              className="w-full bg-[#0c0d1a] border border-white/10 rounded-xl px-3 py-2 text-[13px] text-white placeholder-gray-500 outline-none focus:border-indigo-500/50"
            />
          </div>
        </div>
      )}
    </div>
  );
}
