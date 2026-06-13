import { render, screen } from "@testing-library/react";

import { ChapterList } from "@/components/chapter-list";
import { LoadingState } from "@/components/loading-state";
import { MisconceptionFeedback } from "@/components/misconception-feedback";
import { TimestampEvidenceCard } from "@/components/timestamp-evidence-card";
import { TutorPanel } from "@/components/tutor-panel";
import { VideoPlayer } from "@/components/video-player";
import { QuizPanel } from "@/components/quiz-panel";

describe("Phase 1 UI components", () => {
  it("renders the video player placeholder", () => {
    render(<VideoPlayer durationSeconds={768} title="AI Workshop" />);
    expect(screen.getByRole("button", { name: /play ai workshop/i })).toBeInTheDocument();
    expect(screen.getByText("12:48")).toBeInTheDocument();
  });

  it("renders chapter titles and timestamps", () => {
    render(<ChapterList chapters={[{ id: "chapter-1", title: "Context caching", startSec: 194 }]} />);
    expect(screen.getByText("Context caching")).toBeInTheDocument();
    expect(screen.getByText("03:14")).toBeInTheDocument();
  });

  it("formats timestamp evidence as a range", () => {
    render(<TimestampEvidenceCard endSec={242} reason="Definition" startSec={194} />);
    expect(screen.getByRole("button", { name: "03:14–04:02" })).toBeInTheDocument();
  });

  it("renders misconception feedback and its replay range", () => {
    render(<MisconceptionFeedback endSec={242} explanation="Caching reuses context." misconception="Caching vs routing" startSec={194} />);
    expect(screen.getByText("Caching vs routing")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /watch 03:14–04:02/i })).toBeInTheDocument();
  });

  it("renders tutor and chapter empty states", () => {
    render(<><TutorPanel videoId="demo-video" /><QuizPanel videoId="demo-video" /><ChapterList chapters={[]} /></>);
    expect(screen.getByText("Ask about this lesson")).toBeInTheDocument();
    expect(screen.getByText("Ready for a knowledge check?")).toBeInTheDocument();
    expect(screen.getByText("No chapters yet")).toBeInTheDocument();
  });

  it("renders a named loading state", () => {
    render(<LoadingState label="Preparing tutor" />);
    expect(screen.getByRole("status", { name: "Preparing tutor" })).toBeInTheDocument();
  });
});
