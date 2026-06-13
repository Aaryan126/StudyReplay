# StudyReplay Build Plan

## Build Philosophy

StudyReplay should be built in phases. Each phase should produce a working, testable increment. Do not overbuild early. The timestamp-aware wrong-answer loop is the core feature and should be protected from scope creep.

The coding agent must:
1. Read all markdown planning files before coding.
2. Complete one phase at a time.
3. Add tests for each phase.
4. Run tests before moving on.
5. Update `implementation.md` after each session.
6. Keep sponsor integrations behind adapters.
7. Use mock adapters when API credentials are missing.

---

## Phase 0: Repo Setup and Project Skeleton

### Goal

Create a clean, modern, testable full-stack project foundation.

### Deliverables

- Next.js TypeScript app.
- Tailwind CSS configured.
- Basic component system.
- App routes created.
- API route structure created.
- Environment variable template.
- Basic test setup.
- Lint/typecheck scripts.
- Initial `implementation.md` update.

### Suggested routes

- `/`
- `/videos`
- `/videos/[id]`
- `/demo`

### Suggested folders

```text
/src
  /app
  /components
  /lib
    /adapters
    /ai
    /db
    /types
    /utils
  /server
    /services
    /routes
  /tests
```

### Tests

- App renders landing page.
- Video workspace route renders.
- Typecheck passes.
- Lint passes.
- Basic unit test runs.

### Acceptance criteria

- Developer can run the app locally.
- UI shell is visible.
- Tests pass.

---

## Phase 1: UI Shell and Demo Workspace

### Goal

Build the core visual experience before real integrations.

### Deliverables

- Modern landing page.
- Demo video workspace layout.
- Video player placeholder.
- Chapter map component.
- Tutor panel component.
- Quiz panel component.
- Evidence/timestamp card component.
- Orchestration log component.
- Loading and empty states.

### Key UI components

- `VideoPlayer`
- `ChapterList`
- `TutorPanel`
- `QuizPanel`
- `TimestampEvidenceCard`
- `MisconceptionFeedback`
- `ToolCallTimeline`
- `StatusBadge`

### Tests

- Landing page renders product pitch.
- Workspace renders video area, chapters, tutor panel.
- Timestamp card formats seconds into `mm:ss`.
- Misconception feedback renders timestamp range.
- Empty/loading states render.

### Acceptance criteria

- The app looks polished enough for a hackathon demo.
- User can navigate to a demo workspace.
- UI makes timestamp awareness visually obvious.

---

## Phase 2: Data Model and Local Demo Data

### Goal

Create local data models and demo data so the product works without external APIs first.

### Deliverables

- Type definitions for Video, Chapter, TranscriptSegment, QuizQuestion, LearnerAnswer, ToolCallLog.
- Local in-memory or file-backed demo store.
- Preloaded sample video metadata.
- Preloaded transcript segments.
- Preloaded chapters.
- Preloaded quiz questions.
- Mock wrong-answer feedback.

### Tests

- Demo video loads.
- Chapters load for demo video.
- Transcript segments can be searched locally.
- Quiz questions load.
- Tool logs can be created and listed.

### Acceptance criteria

- The full UI can be populated with realistic demo data.
- No sponsor APIs are required yet.
- The app can simulate the main demo flow.

---

## Phase 3: Timestamp Retrieval Service

### Goal

Build the retrieval layer that maps questions/concepts to relevant timestamped transcript segments.

### Deliverables

- `TranscriptSearchService`.
- Keyword search baseline.
- Optional embedding-ready interface.
- Segment ranking.
- Return top-k timestamped chunks.
- Evidence formatting helper.
- Tests with known query-to-segment expectations.

### Retrieval output format

```ts
type RetrievedSegment = {
  segmentId: string
  startSec: number
  endSec: number
  text: string
  score: number
  reason?: string
}
```

### Tests

- Query "context caching" returns the correct segment.
- Query "model routing" returns the correct segment.
- Top-k results are sorted by score.
- Unknown query returns low-confidence or empty result.
- Timestamp formatting is correct.

### Acceptance criteria

- The app can answer "where was this taught?" using local transcript data.
- Retrieval is reliable enough for demo fallback.

---

## Phase 4: AI Adapter Layer

### Goal

Create clean adapters for Kimi and TokenRouter while supporting mock mode.

### Deliverables

- `AIProvider` interface.
- `KimiAdapter`.
- `TokenRouterAdapter`.
- `MockAIAdapter`.
- Config switch using environment variables.
- Structured JSON parsing and validation.
- Retry and timeout handling.
- Tool call logging.

### Required AI operations

- `generateChapters`
- `answerQuestion`
- `generateQuiz`
- `gradeAnswer`
- `generatePractice`
- `summarizeConcept`

### Tests

- Mock adapter returns valid structured output.
- JSON schema validation rejects malformed output.
- Timeout handling works.
- Tool logs are created.
- Provider switch uses env config.

### Acceptance criteria

- App can run fully in mock mode.
- App can be switched to real Kimi/TokenRouter when credentials exist.
- No UI code directly calls sponsor APIs.

---

## Phase 5: Ask-Video Flow

### Goal

Implement grounded question answering with timestamp evidence.

### Deliverables

- `/api/videos/:id/ask` or equivalent route.
- Retrieval from transcript service.
- AI answer generation using retrieved segments.
- Evidence cards in UI.
- Optional streaming response.
- Latency logging.

### Tests

- Ask route accepts a question.
- Ask route retrieves relevant segments.
- Ask route returns answer with timestamp evidence.
- UI displays answer and timestamp.
- Empty evidence returns honest uncertainty message.

### Acceptance criteria

- User can ask a question about the demo video.
- Answer includes timestamp evidence.
- User can click timestamp to seek video position.

---

## Phase 6: Quiz Generation Flow

### Goal

Generate and display quiz questions grounded in video chapters and timestamps.

### Deliverables

- Quiz generation API route.
- Quiz UI flow.
- Store generated questions.
- Attach each question to source timestamp.
- Support short-answer and multiple-choice questions.

### Tests

- Quiz generation returns valid questions.
- Each question includes source timestamp.
- UI displays one question at a time.
- User can submit an answer.
- Quiz state persists during session.

### Acceptance criteria

- User can click "Test me."
- Quiz appears quickly.
- Questions are clearly linked to video concepts.

---

## Phase 7: Wrong-Answer Misconception Detection

### Goal

Build the most important product loop: wrong answer → misconception → exact timestamp → retry.

### Deliverables

- Answer grading API route.
- Misconception detection prompt.
- Structured feedback schema.
- Recommended timestamp range.
- Follow-up question generation.
- Misconception feedback UI.
- "Watch this part" button.

### Tests

- Known wrong answer produces expected misconception.
- Feedback includes recommended timestamp.
- Feedback includes follow-up question.
- Correct answer does not show misconception warning.
- Partial answer shows nuanced feedback.
- UI displays feedback clearly.

### Acceptance criteria

- The demo wrong-answer flow works end-to-end.
- The system identifies a specific confusion, not just "incorrect."
- Timestamp recommendation is clearly shown and clickable.

---

## Phase 8: VideoDB Integration

### Goal

Replace or supplement local transcript retrieval with real VideoDB-backed video memory.

### Deliverables

- `VideoDBAdapter`.
- Video upload/register function.
- Transcript/chunk retrieval.
- Chapter/timestamp import if available.
- Search function.
- Fallback to local transcript if VideoDB fails.
- Tool call logging.

### Tests

- Adapter can run in mock mode.
- VideoDB search response maps to internal `RetrievedSegment`.
- Failures fall back gracefully.
- Logs show VideoDB operations.

### Acceptance criteria

- VideoDB is meaningfully used for timestamped retrieval.
- Demo can show VideoDB in orchestration log.
- Local fallback remains available.

---

## Phase 9: Daytona Practice Sandbox

### Goal

Add executable practice for technical/coding concepts.

### Deliverables

- `DaytonaAdapter`.
- Generate practice task from misconception.
- Create sandbox.
- Write starter files or notebook.
- Run simple code/tests.
- Display output in UI.
- Fallback to text-only exercise.

### Tests

- Mock sandbox can be created.
- Practice task is generated.
- Run command returns output.
- UI displays sandbox status.
- Sandbox failure shows fallback message.

### Acceptance criteria

- At least one coding-related concept can launch a practice exercise.
- Daytona appears as a meaningful execution layer, not a decorative integration.

---

## Phase 10: TokenRouter Optimization and Caching

### Goal

Show low-latency/cost-aware orchestration.

### Deliverables

- Routing rules for simple vs complex tasks.
- Cache repeated quiz and explanation outputs.
- Latency metrics.
- UI orchestration panel showing routing decisions.
- Fallback model handling if supported.

### Suggested routing

```text
Simple extraction/formatting -> cheap/fast model through TokenRouter
Hard misconception reasoning -> Kimi
Repeated timestamp explanation -> cache
Practice generation -> Kimi
```

### Tests

- Cache hit returns faster path.
- Routing rule chooses expected provider.
- Logs show provider choice.
- Fallback path works in mock mode.

### Acceptance criteria

- Demo can explain how the app stays fast.
- Orchestration log shows TokenRouter/caching decisions.

---

## Phase 11: Nosana Optional Worker

### Goal

Add optional heavy compute story if time allows.

### Deliverables

- `NosanaAdapter`.
- Mock worker job system.
- Optional transcript/embedding/vision processing job.
- Job status UI.
- Logs showing Nosana processing.

### Tests

- Mock job can be submitted.
- Job status updates.
- Failure is handled.
- UI does not block on job.

### Acceptance criteria

- Nosana is used only if it improves demo story.
- App still works without Nosana.

---

## Phase 12: Demo Hardening and Polish

### Goal

Make the project reliable, fast, and impressive.

### Deliverables

- Preloaded demo video.
- Preloaded transcript/chapter/quiz fallback.
- Polished UI.
- Demo script.
- Error handling.
- Loading skeletons.
- Latency display.
- README updates.
- Final `implementation.md` update.

### Tests

- Full demo flow works from fresh install.
- Wrong-answer flow works.
- Timestamp seek works.
- Tool logs display sponsor usage.
- App handles missing API keys gracefully.
- Build passes.

### Acceptance criteria

- Demo can be completed under 3 minutes.
- The value proposition is obvious.
- Sponsor orchestration is visible.
- The product feels polished.

---

## Phase Priority

If time is short, prioritize:

1. Phase 0
2. Phase 1
3. Phase 2
4. Phase 3
5. Phase 4
6. Phase 5
7. Phase 6
8. Phase 7
9. Phase 8
10. Phase 9
11. Phase 10
12. Phase 12

Nosana can remain optional unless there is time.

---

## MVP Completion Definition

MVP is ready when the following demo works:

1. Open StudyReplay.
2. Load demo video.
3. Show chapters with timestamps.
4. Ask a question.
5. Receive timestamped answer.
6. Click "Test me."
7. Submit a deliberately wrong answer.
8. See misconception diagnosis.
9. See exact timestamp to rewatch.
10. Generate follow-up practice.
11. Show sponsor orchestration log.
