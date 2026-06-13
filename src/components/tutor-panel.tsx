"use client";

import { useState } from "react";

import { EmptyState } from "@/components/empty-state";
import { Panel } from "@/components/panel";
import { TimestampEvidenceCard } from "@/components/timestamp-evidence-card";
import type { AnswerQuestionResult } from "@/lib/ai/contracts";
import { notifyOrchestrationUpdated } from "@/lib/utils/orchestration-events";

type TutorResponse = AnswerQuestionResult & {
  provider: string;
  latencyMs: number;
  cached?: boolean;
};

type TutorPanelProps = {
  videoId: string;
  initialAnswer?: string;
  initialEvidence?: { startSec: number; endSec: number; reason: string; transcript?: string };
  onSelectTimestamp?: (startSec: number) => void;
};

export function TutorPanel({
  videoId,
  initialAnswer,
  initialEvidence,
  onSelectTimestamp,
}: TutorPanelProps) {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<TutorResponse | null>(
    initialAnswer
      ? {
          answer: initialAnswer,
          evidence: initialEvidence ? [initialEvidence] : [],
          confidence: "high",
          followUpSuggestions: [],
          provider: "Local",
          latencyMs: 0,
          cached: false,
        }
      : null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitQuestion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedQuestion = question.trim();
    if (!normalizedQuestion || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const request = await fetch(`/api/videos/${videoId}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: normalizedQuestion }),
      });
      const body = (await request.json()) as { data?: TutorResponse; error?: string };
      if (!request.ok || !body.data) {
        throw new Error(body.error ?? "Unable to answer that question.");
      }
      setResponse(body.data);
      notifyOrchestrationUpdated();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to answer that question.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Panel description="Grounded in the lecture transcript" title="Ask StudyReplay">
      {response ? (
        <div aria-live="polite">
          <div className="rounded-xl bg-[var(--surface-subtle)] p-4 text-sm leading-7 text-[#3d4941]">
            {response.answer}
          </div>
          {response.evidence.map((evidence, index) => (
            <div className="mt-4" key={`${evidence.startSec}-${evidence.endSec}-${index}`}>
              <TimestampEvidenceCard {...evidence} onSelect={onSelectTimestamp} />
            </div>
          ))}
          <p className="mt-3 text-xs text-[var(--muted)]">
            {response.cached ? "Cache" : response.provider} · {response.confidence} confidence · {response.latencyMs} ms{response.cached ? " · cached" : ""}
          </p>
        </div>
      ) : (
        <EmptyState title="Ask about this lesson" description="Your answer and timestamp evidence will appear here." />
      )}
      <form className="mt-4 flex gap-2" onSubmit={submitQuestion}>
        <input
          aria-label="Ask a question"
          className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#98a29b] focus:border-[#8cb8a0]"
          disabled={isLoading}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="What is context caching?"
          value={question}
        />
        <button
          className="cursor-pointer rounded-xl bg-[var(--accent)] px-4 text-sm font-bold text-white hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-55"
          disabled={isLoading || question.trim().length === 0}
          type="submit"
        >
          {isLoading ? "Finding..." : "Ask"}
        </button>
      </form>
      {error ? <p className="mt-3 text-sm font-medium text-red-700" role="alert">{error}</p> : null}
    </Panel>
  );
}
