"use client";

import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/empty-state";
import { Panel } from "@/components/panel";
import { MisconceptionFeedback } from "@/components/misconception-feedback";
import { PracticeCard } from "@/components/practice-card";
import type { LearnerAnswer, PublicQuizQuestion } from "@/lib/types";
import { formatTimestampRange } from "@/lib/utils/time";
import { notifyOrchestrationUpdated } from "@/lib/utils/orchestration-events";

type QuizSession = {
  questions: PublicQuizQuestion[];
  currentIndex: number;
  answers: Record<string, string>;
  submitted: string[];
  feedback: Record<string, LearnerAnswer>;
};

type QuizPanelProps = {
  videoId: string;
  onSelectTimestamp?: (startSec: number) => void;
};

function loadQuizSession(storageKey: string): QuizSession | null {
  if (typeof window === "undefined") return null;

  const saved = window.sessionStorage.getItem(storageKey);
  if (!saved) return null;

  try {
    const parsed = JSON.parse(saved) as QuizSession;
    return Array.isArray(parsed.questions) && parsed.questions.length > 0
      ? { ...parsed, feedback: parsed.feedback ?? {} }
      : null;
  } catch {
    window.sessionStorage.removeItem(storageKey);
    return null;
  }
}

export function QuizPanel({ videoId, onSelectTimestamp }: QuizPanelProps) {
  const storageKey = `studyreplay-quiz-${videoId}`;
  const [session, setSession] = useState<QuizSession | null>(() =>
    loadQuizSession(storageKey),
  );
  const [answer, setAnswer] = useState(() => {
    const saved = loadQuizSession(storageKey);
    return saved?.answers[saved.questions[saved.currentIndex]?.id ?? ""] ?? "";
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      window.sessionStorage.setItem(storageKey, JSON.stringify(session));
    }
  }, [session, storageKey]);

  const currentQuestion = session?.questions[session.currentIndex];
  const currentFeedback = currentQuestion
    ? session?.feedback?.[currentQuestion.id]
    : undefined;
  const isSubmitted = useMemo(
    () => Boolean(currentQuestion && currentFeedback),
    [currentFeedback, currentQuestion],
  );

  async function generateQuiz() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/videos/${videoId}/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: 3 }),
      });
      const body = (await response.json()) as { data?: PublicQuizQuestion[]; error?: string };
      if (!response.ok || !body.data?.length) {
        throw new Error(body.error ?? "Unable to generate quiz.");
      }
      setSession({ questions: body.data, currentIndex: 0, answers: {}, submitted: [], feedback: {} });
      setAnswer("");
      notifyOrchestrationUpdated();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to generate quiz.");
    } finally {
      setIsLoading(false);
    }
  }

  async function submitAnswer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || !currentQuestion || !answer.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/quiz/${currentQuestion.id}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: answer.trim() }),
      });
      const body = (await response.json()) as { data?: LearnerAnswer; error?: string };
      if (!response.ok || !body.data) {
        throw new Error(body.error ?? "Unable to grade answer.");
      }
      setSession({
        ...session,
        answers: { ...session.answers, [currentQuestion.id]: answer.trim() },
        submitted: session.submitted.includes(currentQuestion.id)
          ? session.submitted
          : [...session.submitted, currentQuestion.id],
        feedback: { ...(session.feedback ?? {}), [currentQuestion.id]: body.data },
      });
      notifyOrchestrationUpdated();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to grade answer.");
    } finally {
      setIsLoading(false);
    }
  }

  function moveQuestion(direction: 1 | -1) {
    if (!session) return;
    const nextIndex = Math.min(
      session.questions.length - 1,
      Math.max(0, session.currentIndex + direction),
    );
    const nextQuestion = session.questions[nextIndex];
    setSession({ ...session, currentIndex: nextIndex });
    setAnswer(session.answers[nextQuestion?.id ?? ""] ?? "");
  }

  return (
    <Panel
      action={session ? <span className="rounded-full bg-[#eef2ef] px-2.5 py-1 text-xs font-bold text-[var(--muted)]">{session.currentIndex + 1} of {session.questions.length}</span> : null}
      description="Check understanding, not memory"
      title="Knowledge check"
    >
      {currentQuestion ? (
        <form onSubmit={submitAnswer}>
          <p className="text-base font-semibold leading-7">{currentQuestion.question}</p>
          <p className="mt-2 text-xs font-bold text-[var(--accent)]">
            Source: {formatTimestampRange(currentQuestion.sourceStartSec, currentQuestion.sourceEndSec)} · {currentQuestion.difficulty}
          </p>

          {currentQuestion.type === "multiple_choice" ? (
            <fieldset className="mt-4 space-y-2">
              <legend className="sr-only">Answer options</legend>
              {currentQuestion.options?.map((option) => (
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--border)] p-3 text-sm hover:bg-[var(--surface-subtle)]" key={option}>
                  <input checked={answer === option} name={`answer-${currentQuestion.id}`} onChange={() => setAnswer(option)} type="radio" />
                  <span>{option}</span>
                </label>
              ))}
            </fieldset>
          ) : (
            <textarea
              aria-label="Quiz answer"
              className="mt-4 min-h-24 w-full resize-none rounded-xl border border-[var(--border)] p-3 text-sm outline-none placeholder:text-[#98a29b] focus:border-[#8cb8a0]"
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="Explain in your own words..."
              value={answer}
            />
          )}

          <button
            className="mt-3 w-full cursor-pointer rounded-xl bg-[#18231d] px-4 py-3 text-sm font-bold text-white hover:bg-[#26372e] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={!answer.trim() || isLoading}
            type="submit"
          >
            {isLoading ? "Checking..." : isSubmitted ? "Check again" : "Check my answer"}
          </button>
          {currentFeedback?.status === "correct" ? (
            <section className="mt-4 rounded-xl border border-[#c6dfd0] bg-[var(--accent-soft)] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--accent)]">Correct</p>
              <p className="mt-2 text-sm leading-6 text-[#315440]">{currentFeedback.explanation}</p>
            </section>
          ) : currentFeedback?.misconception &&
            currentFeedback.recommendedStartSec !== undefined &&
            currentFeedback.recommendedEndSec !== undefined ? (
            <div className="mt-4">
              <MisconceptionFeedback
                endSec={currentFeedback.recommendedEndSec}
                explanation={currentFeedback.explanation ?? "Review this concept and try again."}
                followUpQuestion={currentFeedback.followUpQuestion}
                misconception={currentFeedback.misconception}
                onWatch={onSelectTimestamp}
                startSec={currentFeedback.recommendedStartSec}
              >
                <PracticeCard
                  misconception={currentFeedback.misconception}
                  questionId={currentQuestion.id}
                />
              </MisconceptionFeedback>
            </div>
          ) : null}

          <div className="mt-4 flex justify-between gap-3">
            <button className="cursor-pointer text-sm font-semibold text-[var(--muted)] disabled:opacity-30" disabled={session.currentIndex === 0} onClick={() => moveQuestion(-1)} type="button">Previous</button>
            <button className="cursor-pointer text-sm font-semibold text-[var(--accent)] disabled:opacity-30" disabled={session.currentIndex === session.questions.length - 1} onClick={() => moveQuestion(1)} type="button">Next question</button>
          </div>
        </form>
      ) : (
        <div>
          <EmptyState title="Ready for a knowledge check?" description="Generate focused questions grounded in this video." />
          <button className="mt-4 w-full cursor-pointer rounded-xl bg-[#18231d] px-4 py-3 text-sm font-bold text-white hover:bg-[#26372e] disabled:opacity-55" disabled={isLoading} onClick={generateQuiz} type="button">
            {isLoading ? "Preparing quiz..." : "Test me"}
          </button>
        </div>
      )}
      {error ? <p className="mt-3 text-sm font-medium text-red-700" role="alert">{error}</p> : null}
    </Panel>
  );
}
