"use client";

import { formatTimestampRange } from "@/lib/utils/time";

type MisconceptionFeedbackProps = {
  misconception: string;
  explanation: string;
  startSec: number;
  endSec: number;
  followUpQuestion?: string;
  onWatch?: (startSec: number) => void;
};

export function MisconceptionFeedback({
  misconception,
  explanation,
  startSec,
  endSec,
  followUpQuestion,
  onWatch,
}: MisconceptionFeedbackProps) {
  return (
    <section className="rounded-2xl border border-[#efd5a8] bg-[var(--warning-soft)] p-5">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--warning)]">You may be mixing up</p>
      <h2 className="mt-2 text-xl font-bold tracking-tight">{misconception}</h2>
      <p className="mt-3 text-sm leading-6 text-[#6e512e]">{explanation}</p>
      <button
        className="mt-4 cursor-pointer rounded-full bg-[#9b5a15] px-4 py-2 text-sm font-bold text-white hover:bg-[#7e4810]"
        onClick={() => onWatch?.(startSec)}
        type="button"
      >
        Watch this part · {formatTimestampRange(startSec, endSec)}
      </button>
      {followUpQuestion ? (
        <div className="mt-4 border-t border-[#e9c98f] pt-4">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--warning)]">Try again</p>
          <p className="mt-1 text-sm font-semibold">{followUpQuestion}</p>
        </div>
      ) : null}
    </section>
  );
}
