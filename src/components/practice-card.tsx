"use client";

import { useState } from "react";

import type { PracticeSession } from "@/lib/types";
import { notifyOrchestrationUpdated } from "@/lib/utils/orchestration-events";

type PracticeCardProps = {
  questionId: string;
  misconception: string;
};

export function PracticeCard({ questionId, misconception }: PracticeCardProps) {
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/practice/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, misconception }),
      });
      const body = (await response.json()) as { data?: PracticeSession; error?: string };
      if (!response.ok || !body.data) throw new Error(body.error ?? "Unable to create practice.");
      setSession(body.data);
      setCode(body.data.task.starterCode ?? "");
      notifyOrchestrationUpdated();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to create practice.");
    } finally {
      setIsLoading(false);
    }
  }

  async function run() {
    if (!session?.sandboxId || !code.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/practice/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sandboxId: session.sandboxId, code }),
      });
      const body = (await response.json()) as { data?: { exitCode: number; output: string }; error?: string };
      if (!response.ok || !body.data) throw new Error(body.error ?? "Unable to run practice.");
      setSession({ ...session, ...body.data });
      notifyOrchestrationUpdated();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to run practice.");
    } finally {
      setIsLoading(false);
    }
  }

  if (!session) {
    return (
      <div className="mt-4 border-t border-[#e9c98f] pt-4">
        <button className="cursor-pointer rounded-full border border-[#9b5a15] px-4 py-2 text-sm font-bold text-[#7e4810] disabled:opacity-50" disabled={isLoading} onClick={generate} type="button">
          {isLoading ? "Preparing practice..." : "Practice this"}
        </button>
        {error ? <p className="mt-2 text-sm text-red-700" role="alert">{error}</p> : null}
      </div>
    );
  }

  return (
    <section className="mt-4 border-t border-[#e9c98f] pt-4" aria-label="Practice exercise">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-bold">{session.task.title}</h3>
        <span className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-bold text-[#6e512e]">
          {session.sandboxStatus === "ready" ? `${session.sandboxProvider} ready` : "Text-only fallback"}
        </span>
      </div>
      <p className="mt-2 text-sm leading-6 text-[#6e512e]">{session.task.instructions}</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-[#6e512e]">
        {session.task.successCriteria.map((criterion) => <li key={criterion}>{criterion}</li>)}
      </ul>
      <textarea aria-label="Practice code" className="mt-3 min-h-36 w-full rounded-xl border border-[#d8b77e] bg-[#fffaf0] p-3 font-mono text-xs" onChange={(event) => setCode(event.target.value)} value={code} />
      {session.sandboxStatus === "ready" ? (
        <button className="mt-3 cursor-pointer rounded-full bg-[#18231d] px-4 py-2 text-sm font-bold text-white disabled:opacity-50" disabled={isLoading || !code.trim()} onClick={run} type="button">
          {isLoading ? "Running..." : "Run in sandbox"}
        </button>
      ) : (
        <p className="mt-2 text-xs text-[#7e4810]">Sandbox unavailable. The exercise and starter code remain editable. {session.fallbackReason}</p>
      )}
      {session.output ? <pre className="mt-3 overflow-x-auto rounded-xl bg-[#18231d] p-3 text-xs text-[#eaf3ed]" aria-label="Sandbox output">{session.output}</pre> : null}
      {error ? <p className="mt-2 text-sm text-red-700" role="alert">{error}</p> : null}
    </section>
  );
}
