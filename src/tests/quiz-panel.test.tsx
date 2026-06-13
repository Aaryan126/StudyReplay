import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { QuizPanel } from "@/components/quiz-panel";
import type { PublicQuizQuestion } from "@/lib/types";

const questions: PublicQuizQuestion[] = [
  {
    id: "q1",
    videoId: "video",
    question: "What does context caching reuse?",
    type: "short_answer",
    sourceStartSec: 194,
    sourceEndSec: 242,
    difficulty: "easy",
  },
  {
    id: "q2",
    videoId: "video",
    question: "What does routing choose?",
    type: "multiple_choice",
    options: ["A model", "A timestamp"],
    sourceStartSec: 242,
    sourceEndSec: 356,
    difficulty: "medium",
  },
];

describe("QuizPanel", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("generates a quiz, shows one question, and disables empty submission", async () => {
    vi.stubGlobal("fetch", vi.fn(async () =>
      new Response(JSON.stringify({ data: questions }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    ));
    render(<QuizPanel videoId="video" />);

    fireEvent.click(screen.getByRole("button", { name: /test me/i }));
    expect(await screen.findByText("What does context caching reuse?")).toBeInTheDocument();
    expect(screen.queryByText("What does routing choose?")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /check my answer/i })).toBeDisabled();
  });

  it("submits an answer, moves questions, and restores session state", async () => {
    window.sessionStorage.setItem(
      "studyreplay-quiz-video",
      JSON.stringify({ questions, currentIndex: 0, answers: {}, submitted: [], feedback: {} }),
    );
    vi.stubGlobal("fetch", vi.fn(async () =>
      new Response(JSON.stringify({
        data: {
          id: "answer-1",
          questionId: "q1",
          answer: "Previously processed context",
          status: "partial",
          misconception: "One side is missing",
          explanation: "The answer needs both concepts.",
          recommendedStartSec: 194,
          recommendedEndSec: 242,
          followUpQuestion: "What does routing select?",
          createdAt: new Date().toISOString(),
        },
      }), { status: 200, headers: { "Content-Type": "application/json" } }),
    ));
    const { unmount } = render(<QuizPanel videoId="video" />);

    const answer = await screen.findByRole("textbox", { name: /quiz answer/i });
    fireEvent.change(answer, { target: { value: "Previously processed context" } });
    fireEvent.click(screen.getByRole("button", { name: /check my answer/i }));
    expect(await screen.findByText(/one side is missing/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /next question/i }));
    expect(screen.getByText("What does routing choose?")).toBeInTheDocument();

    unmount();
    render(<QuizPanel videoId="video" />);
    await waitFor(() => expect(screen.getByText("What does routing choose?")).toBeInTheDocument());
  });

  it("shows misconception feedback and sends its timestamp to the player", async () => {
    const onSelectTimestamp = vi.fn();
    window.sessionStorage.setItem(
      "studyreplay-quiz-video",
      JSON.stringify({ questions, currentIndex: 0, answers: {}, submitted: [], feedback: {} }),
    );
    vi.stubGlobal("fetch", vi.fn(async () =>
      new Response(JSON.stringify({
        data: {
          id: "answer-2",
          questionId: "q1",
          answer: "It chooses a model",
          status: "incorrect",
          misconception: "Context caching vs model routing",
          explanation: "Choosing a model is routing.",
          recommendedStartSec: 194,
          recommendedEndSec: 242,
          followUpQuestion: "What does caching reuse?",
          createdAt: new Date().toISOString(),
        },
      }), { status: 200, headers: { "Content-Type": "application/json" } }),
    ));

    render(<QuizPanel onSelectTimestamp={onSelectTimestamp} videoId="video" />);
    fireEvent.change(await screen.findByRole("textbox", { name: /quiz answer/i }), {
      target: { value: "It chooses a model" },
    });
    fireEvent.click(screen.getByRole("button", { name: /check my answer/i }));
    expect(await screen.findByText("Context caching vs model routing")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /watch this part/i }));
    expect(onSelectTimestamp).toHaveBeenCalledWith(194);
  });
});
