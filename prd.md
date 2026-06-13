# StudyReplay PRD

## 1. Product Summary

**StudyReplay** turns lecture videos, tutorials, workshops, and technical recordings into an interactive learning system that can identify what the learner misunderstood and guide them back to the exact timestamp where the concept was originally explained.

The core product is not a generic video summarizer. The core product is a **timestamp-aware AI tutor**.

When a learner answers incorrectly, asks a confused question, or mixes up two ideas, StudyReplay should:
1. Detect the likely misconception.
2. Retrieve the most relevant video segment.
3. Explain the concept clearly.
4. Show the exact timestamp range to revisit.
5. Generate a targeted follow-up question or exercise.
6. Optionally launch an executable practice environment for coding/math lessons.

The hackathon goal is to demonstrate a production-grade AI application with strong sponsor-tool orchestration, low-latency interactions, and a polished modern UI.

---

## 2. Hackathon Positioning

### One-line pitch

**StudyReplay turns any lecture video into a tutor that knows exactly what you misunderstood and takes you back to the precise moment you missed.**

### Demo story

A learner uploads a technical workshop video. StudyReplay indexes the video, creates chapters, and generates a quiz. The learner answers a question incorrectly. Instead of just saying "wrong," StudyReplay identifies the misconception, shows the timestamp where the concept was taught, explains the correction, and gives a targeted retry question. For coding lessons, it can open a safe sandbox exercise.

### What makes it impressive

- Timestamp-aware learning, not generic summarization.
- Misconception detection tied to video evidence.
- Fast, interactive tutoring loop.
- Clear sponsor-tool orchestration.
- Modern UI with strong demo flow.
- Practical outcome: less rewatching, faster learning, better retention.

---

## 3. Primary Goals

### Product goals

1. Allow a user to upload or register a lecture/tutorial video.
2. Index the video into searchable timestamped learning units.
3. Generate chapters, key concepts, and quiz questions.
4. Let users answer quiz questions.
5. Detect wrong answers and map the error to the relevant timestamp.
6. Return a concise explanation and exact video segment to rewatch.
7. Generate targeted follow-up practice.
8. Keep user interactions fast and fluid.
9. Show clear tool orchestration in the demo.

### Hackathon goals

1. Use at least 3 sponsor tools meaningfully.
2. Make VideoDB central to timestamp-aware video memory.
3. Use Kimi as the main reasoning and tutoring engine.
4. Use Daytona for safe executable practice/code exercises.
5. Use TokenRouter for model routing, caching, and cost-aware orchestration where possible.
6. Optionally use Nosana for heavier video/audio/embedding/vision tasks.
7. Present a production-style architecture rather than a simple API mashup.

---

## 4. Non-goals

StudyReplay should not try to solve everything in the first hackathon build.

Out of scope for MVP:

- Full LMS replacement.
- Multi-user classroom management.
- Payments or subscriptions.
- Full mobile app.
- Perfect speech diarization.
- Long-term spaced repetition system.
- Live video streaming unless time allows.
- Advanced analytics dashboard beyond demo needs.
- Fully automated grading for complex essays.
- Large-scale production deployment.

---

## 5. Target Users

### Primary user

A student, bootcamp learner, hackathon participant, or self-learner watching technical content.

They have lectures, tutorials, workshops, or coding videos and want faster understanding without rewatching everything.

### Secondary users

- Teaching assistants.
- Online course creators.
- Internal training teams.
- Developer education teams.
- Coding bootcamps.
- University clubs and hackathon organizers.

---

## 6. Core User Problems

### Problem 1: Rewatching is inefficient

Learners often know they are confused but do not know where the explanation was given.

### Problem 2: Summaries are too passive

A summary helps review content but does not reveal whether the learner understood it.

### Problem 3: Quizzes are disconnected from source material

If a learner gets something wrong, most tools explain the answer but do not point back to the original teaching moment.

### Problem 4: Technical learning needs practice

For code/math/data lessons, learners need to apply the concept, not just read an explanation.

### Problem 5: AI tutors often hallucinate context

StudyReplay should ground its answers in timestamped video evidence.

---

## 7. Core Value Proposition

StudyReplay creates a feedback loop:

**Watch → Test → Misunderstand → Retrieve timestamp → Explain → Practice → Retry**

This makes learning active, evidence-grounded, and personalized.

---

## 8. Sponsor Tool Orchestration

### 8.1 VideoDB

**Role:** Video memory and timestamp retrieval layer.

Responsibilities:
- Store uploaded/registered videos.
- Generate or store transcript.
- Segment video into searchable timestamped chunks.
- Retrieve relevant moments when the user asks questions or answers incorrectly.
- Support clipping or deep links to exact timestamp ranges.
- Provide evidence for tutor responses.

Used for:
- Chapter generation.
- Concept search.
- Misconception-to-timestamp mapping.
- "Explain from timestamp" mode.
- "Where was this taught?" mode.

### 8.2 Kimi AI

**Role:** Main reasoning, tutoring, and orchestration brain.

Responsibilities:
- Generate chapters and concept maps.
- Generate quiz questions.
- Grade learner answers.
- Detect misconceptions.
- Decide which video segments are relevant.
- Produce explanations.
- Generate follow-up practice.
- Coordinate tool calls through the backend.

Used for:
- Tutor responses.
- Wrong-answer analysis.
- Question generation.
- Concept explanation.
- Agentic planning.

### 8.3 Daytona

**Role:** Safe execution environment for technical practice.

Responsibilities:
- Create isolated sandboxes.
- Run generated code exercises.
- Execute notebooks/scripts/tests.
- Let users practice concepts from coding/data/math lectures.
- Return execution output safely.

Used for:
- Coding lesson practice.
- Auto-generated exercises.
- "Try it now" tasks.
- Demo of agent-safe execution.

### 8.4 TokenRouter

**Role:** Cost-aware and latency-aware model routing.

Responsibilities:
- Route simple tasks to cheap/fast models.
- Route hard reasoning to Kimi.
- Cache repeated quiz/explanation requests.
- Provide fallback routing if one model is slow.
- Expose orchestration value in demo.

Used for:
- Summarization.
- Flashcard generation.
- Simple extraction.
- Caching repeated timestamp explanations.
- Optional fallback models.

### 8.5 Nosana

**Role:** Optional heavy compute layer.

Responsibilities:
- Run heavier transcription, embedding, vision, or local model tasks.
- Process long videos or batch jobs.
- Run specialized models if needed.

Used for:
- Optional video preprocessing.
- Optional embedding generation.
- Optional local model inference.
- Optional batch processing.

### 8.6 Orchestration principle

Each sponsor tool should have a clear job:

```text
VideoDB = video memory
Kimi = reasoning and tutoring
Daytona = safe execution
TokenRouter = routing/caching/latency optimization
Nosana = heavy compute
```

The project should avoid forced integrations. The demo should explain why each tool is necessary.

---

## 9. Main User Flows

## 9.1 Upload and index video

### User story

As a learner, I want to upload a lecture video so that StudyReplay can turn it into a searchable learning system.

### Flow

1. User lands on dashboard.
2. User uploads video or provides video URL/file reference.
3. Backend sends video to VideoDB or registers the video.
4. System extracts transcript and timestamped segments.
5. Kimi generates:
   - title
   - chapter map
   - key concepts
   - possible quiz topics
6. UI shows video detail page.

### Success criteria

- Video appears in dashboard.
- Chapters are displayed with timestamps.
- User can click chapter timestamps.
- Search over transcript/concepts works.
- Indexing status is visible.

---

## 9.2 Ask a question about the video

### User story

As a learner, I want to ask questions about the video and receive grounded answers with timestamps.

### Flow

1. User opens video detail page.
2. User asks: "What is context caching?"
3. Backend searches VideoDB for relevant segments.
4. Kimi answers using retrieved context.
5. UI displays:
   - direct answer
   - supporting timestamp range
   - "Watch segment" button
   - confidence/evidence indicator

### Success criteria

- Answer includes timestamp evidence.
- User can jump to the timestamp.
- Response is concise and fast.
- If no evidence is found, the system says so.

---

## 9.3 Generate quiz

### User story

As a learner, I want StudyReplay to test me on the video so I can check my understanding.

### Flow

1. User clicks "Test me."
2. Backend asks Kimi to generate quiz questions based on chapters/concepts.
3. TokenRouter may route simpler generation tasks.
4. UI shows one question at a time.
5. Questions are linked to source concepts and timestamps.

### Question types

MVP:
- Short answer.
- Multiple choice.
- True/false.
- Concept comparison.

Optional:
- Code exercise.
- Fill-in-the-blank.
- Explain in your own words.

### Success criteria

- Quiz questions are relevant to the video.
- Each question stores source timestamp references.
- User can submit answers.
- User receives immediate feedback.

---

## 9.4 Wrong answer and misconception detection

### User story

As a learner, when I get something wrong, I want the system to explain what I misunderstood and show where the video taught it.

### Flow

1. User submits an answer.
2. Backend sends:
   - quiz question
   - expected answer
   - user answer
   - relevant video chunks
   - source timestamps
   to Kimi.
3. Kimi classifies answer:
   - correct
   - partially correct
   - incorrect
   - unclear
4. If incorrect or partially correct, Kimi identifies:
   - misconception
   - missing concept
   - confused concept pair
   - source timestamp range
5. UI shows:
   - "You may be mixing up X and Y"
   - short correction
   - timestamp segment to rewatch
   - retry question

### Success criteria

- Wrong-answer feedback references timestamp.
- Misconception is specific, not generic.
- Explanation is short and useful.
- User can rewatch exact segment.
- A follow-up question is generated.

---

## 9.5 Explain from timestamp

### User story

As a learner, I want to click a video moment and ask the AI to explain what is happening there.

### Flow

1. User clicks a timestamp or pauses the video.
2. User asks: "Explain this part."
3. Backend retrieves nearby transcript chunks.
4. Kimi explains that specific segment.
5. UI shows explanation and related concepts.

### Success criteria

- Explanation is grounded in nearby timestamp context.
- User can ask follow-up questions.
- Segment boundaries are shown clearly.

---

## 9.6 Practice in Daytona sandbox

### User story

As a learner watching a coding/data/math lesson, I want to practice the concept safely in a live environment.

### Flow

1. User gets a coding-related quiz or explanation.
2. UI shows "Practice this in sandbox."
3. Backend asks Kimi to generate a small exercise.
4. Daytona creates a sandbox.
5. System writes starter files or notebook.
6. User runs code or tests.
7. Kimi reviews result and gives feedback.

### Success criteria

- Sandbox launches successfully.
- Starter exercise is relevant to the video concept.
- User can run code.
- Output is returned to UI.
- Sandbox failures are handled gracefully.

---

## 10. MVP Scope

### Must-have

1. Modern landing/dashboard UI.
2. Upload/register video.
3. Video detail page.
4. VideoDB-backed transcript/chapter indexing.
5. Timestamped chapter map.
6. Ask question with timestamped answer.
7. Generate quiz.
8. Submit answer.
9. Wrong-answer misconception detection.
10. Timestamp recommendation for rewatch.
11. Follow-up practice question.
12. Basic orchestration logs.
13. Clear loading states and error states.
14. Basic tests for every phase.

### Should-have

1. TokenRouter-based routing abstraction.
2. Daytona sandbox exercise for at least one coding lesson.
3. Caching for repeated answers.
4. Demo mode with preloaded sample video.
5. Visual "evidence trail" showing retrieved timestamps.
6. Low-latency streaming responses.

### Nice-to-have

1. Nosana processing worker.
2. Flashcards.
3. Progress tracking.
4. Clip generation.
5. Multi-video course library.
6. Voice input.
7. Export study notes.
8. Spaced repetition.
9. Teacher mode.

---

## 11. UI / UX Requirements

### Design direction

The UI should feel modern, calm, professional, and suitable for serious learning.

Preferred style:
- Clean SaaS/productivity app aesthetic.
- Soft gradients or subtle glass panels only if tasteful.
- Clear visual hierarchy.
- Fast interactions.
- Minimal clutter.
- Timestamp chips and evidence cards.
- Smooth loading skeletons.
- Dark mode optional but not required.

### Key screens

1. Landing / project home.
2. Video upload/indexing page.
3. Video learning workspace.
4. Quiz/tutor panel.
5. Misconception feedback view.
6. Practice sandbox view.
7. Orchestration/debug panel for demo.

### Main workspace layout

Recommended layout:

```text
-------------------------------------------------
Top bar: StudyReplay | Video title | status
-------------------------------------------------
Left: Video player + chapter map
Right: Tutor panel / quiz / feedback
Bottom or side: Evidence trail + orchestration log
-------------------------------------------------
```

### Timestamp UX

Timestamps are the core product. They must be visually prominent.

Use:
- Timestamp chips: `03:14 - 04:02`
- "Watch this part" buttons.
- Highlighted source segment cards.
- Small transcript preview around the timestamp.
- Evidence confidence label if useful.

### Misconception feedback UX

When a learner gets something wrong, show:

```text
You may be mixing up:
Context caching vs model routing

Why:
Your answer says caching chooses the best model, but caching actually reuses prior computation/context to reduce cost and latency.

Watch:
03:14 - 04:02

Try again:
In one sentence, what does context caching optimize?
```

### Performance UX

Every long-running step needs a clear state:
- Uploading
- Indexing
- Generating chapters
- Preparing quiz
- Checking answer
- Finding timestamp
- Creating sandbox

Avoid blank screens.

---

## 12. Latency and Performance Requirements

### Target interaction speeds

For hackathon demo:
- Page navigation: under 300 ms after load.
- Ask question response start: under 2 seconds if streaming.
- Quiz feedback response start: under 2 seconds if streaming.
- Video search retrieval: ideally under 1 second.
- Cached response: under 500 ms.
- Sandbox creation: show progress immediately; complete as fast as feasible.

### Techniques

1. Pre-index the demo video before presentation.
2. Cache chapter maps and quiz questions.
3. Use streaming for tutor answers.
4. Use TokenRouter or internal routing for cheap/simple tasks.
5. Pre-generate a fallback quiz for demo reliability.
6. Store timestamp chunks in local DB after VideoDB indexing.
7. Use async jobs for video processing.
8. Do not block UI while indexing.
9. Use optimistic UI for quiz transitions.
10. Log latency for each sponsor/tool call.

### Demo reliability rule

The demo should have a preloaded sample video and cached outputs in case external APIs are slow.

---

## 13. Data Model

The exact implementation can vary, but the app should maintain these core entities.

### Video

```ts
type Video = {
  id: string
  title: string
  sourceType: "upload" | "url" | "demo"
  sourceUrl?: string
  videoDbId?: string
  status: "uploaded" | "indexing" | "ready" | "failed"
  durationSeconds?: number
  createdAt: string
  updatedAt: string
}
```

### TranscriptSegment

```ts
type TranscriptSegment = {
  id: string
  videoId: string
  startSec: number
  endSec: number
  text: string
  concepts: string[]
  embeddingId?: string
}
```

### Chapter

```ts
type Chapter = {
  id: string
  videoId: string
  title: string
  summary: string
  startSec: number
  endSec: number
  keyConcepts: string[]
}
```

### QuizQuestion

```ts
type QuizQuestion = {
  id: string
  videoId: string
  chapterId?: string
  question: string
  type: "short_answer" | "multiple_choice" | "true_false" | "code"
  options?: string[]
  expectedAnswer: string
  sourceStartSec: number
  sourceEndSec: number
  difficulty: "easy" | "medium" | "hard"
}
```

### LearnerAnswer

```ts
type LearnerAnswer = {
  id: string
  questionId: string
  answer: string
  status: "correct" | "partial" | "incorrect" | "unclear"
  misconception?: string
  explanation?: string
  recommendedStartSec?: number
  recommendedEndSec?: number
  followUpQuestion?: string
  createdAt: string
}
```

### ToolCallLog

```ts
type ToolCallLog = {
  id: string
  tool: "VideoDB" | "Kimi" | "Daytona" | "TokenRouter" | "Nosana" | "Local"
  operation: string
  status: "pending" | "success" | "failed"
  latencyMs?: number
  inputSummary?: string
  outputSummary?: string
  createdAt: string
}
```

---

## 14. API Requirements

Exact route names can vary. Suggested API contract:

### Video routes

- `POST /api/videos`
  - Upload/register video.
- `GET /api/videos`
  - List videos.
- `GET /api/videos/:id`
  - Get video detail.
- `POST /api/videos/:id/index`
  - Start indexing.
- `GET /api/videos/:id/chapters`
  - Get chapters.
- `GET /api/videos/:id/transcript`
  - Get transcript segments.

### Tutor routes

- `POST /api/videos/:id/ask`
  - Ask a question about the video.
- `POST /api/videos/:id/explain-timestamp`
  - Explain a selected timestamp range.

### Quiz routes

- `POST /api/videos/:id/quiz/generate`
  - Generate quiz.
- `GET /api/videos/:id/quiz`
  - Get quiz questions.
- `POST /api/quiz/:questionId/answer`
  - Submit learner answer and receive feedback.

### Sandbox routes

- `POST /api/practice/generate`
  - Generate practice task.
- `POST /api/practice/sandbox`
  - Create Daytona sandbox.
- `POST /api/practice/sandbox/:id/run`
  - Run code or tests.

### Observability routes

- `GET /api/logs`
  - Get tool call logs.
- `GET /api/health`
  - Health check for backend and integrations.

---

## 15. AI Prompting Requirements

### General rule

All AI responses must be grounded in retrieved video context when answering video-specific questions.

### Ask-video prompt should include

- User question.
- Retrieved transcript segments.
- Segment timestamps.
- Instruction to cite timestamp ranges.
- Instruction to admit uncertainty if evidence is weak.

### Quiz generation prompt should include

- Video title.
- Chapter list.
- Key concepts.
- Transcript excerpts.
- Desired number and difficulty of questions.
- Requirement to attach each question to source timestamp.

### Answer grading prompt should include

- Question.
- Expected answer.
- User answer.
- Source transcript segment.
- Rubric.
- Required output JSON:
  - status
  - misconception
  - explanation
  - recommended timestamp
  - follow-up question

### Practice generation prompt should include

- Concept being tested.
- Learner misconception.
- Source transcript.
- Desired exercise type.
- Constraints for safe execution.

---

## 16. Required AI Output Schemas

### Ask response

```json
{
  "answer": "string",
  "evidence": [
    {
      "startSec": 194,
      "endSec": 242,
      "reason": "This segment defines context caching."
    }
  ],
  "confidence": "high | medium | low",
  "followUpSuggestions": ["string"]
}
```

### Quiz question

```json
{
  "question": "string",
  "type": "short_answer",
  "options": [],
  "expectedAnswer": "string",
  "sourceStartSec": 194,
  "sourceEndSec": 242,
  "difficulty": "medium",
  "concepts": ["context caching"]
}
```

### Answer feedback

```json
{
  "status": "correct | partial | incorrect | unclear",
  "misconception": "string | null",
  "explanation": "string",
  "recommendedStartSec": 194,
  "recommendedEndSec": 242,
  "timestampReason": "string",
  "followUpQuestion": "string"
}
```

---

## 17. Testing Requirements

Testing should be phase-based and mandatory. Each phase must have:
1. Unit tests.
2. Integration tests where applicable.
3. Manual acceptance checklist.
4. Demo regression checklist.

No phase is considered complete until tests pass and `implementation.md` is updated.

Detailed phase testing is defined in `testing.md`.

---

## 18. Implementation Process Requirements

The coding agent must work in phases.

Rules:
1. Read `prd.md`, `plan.md`, `architecture.md`, `testing.md`, and `implementation.md` before starting.
2. Implement only the current phase.
3. Keep changes small and reviewable.
4. Add or update tests in the same phase.
5. Run tests before marking phase complete.
6. Update `implementation.md` after each coding session.
7. Record:
   - what was built
   - files changed
   - tests run
   - current issues
   - next step
8. Do not skip directly to later phases.
9. Keep sponsor integrations behind clear adapter interfaces.
10. Use mock adapters first if real API credentials are not available.

---

## 19. Recommended Tech Stack

The coding agent may adjust if needed, but recommended stack:

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui or similar component system
- React video player
- Streaming UI for tutor responses

### Backend

- Next.js API routes or separate Node/FastAPI backend
- TypeScript preferred for full-stack consistency
- SQLite/Postgres for app state
- Local JSON fallback for hackathon speed
- Adapter pattern for sponsor tools

### Integrations

- VideoDB adapter
- Kimi adapter
- Daytona adapter
- TokenRouter adapter
- Nosana adapter, optional
- Mock adapters for local development

### Testing

- Vitest/Jest for unit tests
- Playwright for UI flows if time allows
- Integration tests for API routes
- Mock sponsor API responses

---

## 20. Demo Requirements

### Demo should show

1. Upload or load a demo video.
2. Chapters generated with timestamps.
3. Ask a question and receive timestamped answer.
4. Generate quiz.
5. Submit wrong answer.
6. Misconception detected.
7. Exact timestamp recommended.
8. Follow-up question generated.
9. Optional Daytona practice sandbox.
10. Orchestration log showing sponsor tools used.

### Suggested demo script

1. "This is not a video summarizer. It is a tutor that understands where you got confused."
2. Load a technical workshop video.
3. Show chapter map.
4. Click "Test me."
5. Answer incorrectly on purpose.
6. Show feedback:
   - "You mixed up context caching and model routing."
   - "Watch 03:14–04:02."
7. Click timestamp and show the segment.
8. Generate targeted practice.
9. Open Daytona sandbox.
10. Show orchestration panel:
   - VideoDB retrieved timestamped context.
   - Kimi diagnosed the misconception.
   - TokenRouter routed/cached tasks.
   - Daytona created a practice environment.
   - Nosana optionally handled processing.

---

## 21. Success Metrics

### Product metrics

- Time from question to answer.
- Time from answer submission to feedback.
- Percentage of feedback responses with valid timestamps.
- Quiz relevance score from manual review.
- Number of successful timestamp jumps.
- Number of completed practice attempts.

### Hackathon demo metrics

- Uses at least 3 sponsor tools meaningfully.
- Demo completes without manual recovery.
- Wrong-answer flow works end-to-end.
- Timestamp is clearly visible.
- UI looks polished.
- Architecture story is easy to explain.

---

## 22. Risks and Mitigations

### Risk: Video processing is slow

Mitigation:
- Use preloaded demo video.
- Cache transcript/chapter data.
- Show indexing progress.
- Use mock data fallback.

### Risk: Timestamp retrieval is inaccurate

Mitigation:
- Store chunk-level timestamps.
- Retrieve multiple candidate segments.
- Ask Kimi to choose the best segment.
- Show confidence level.

### Risk: AI gives generic feedback

Mitigation:
- Force structured JSON output.
- Include expected answer and source transcript.
- Require misconception field.
- Add tests with known wrong answers.

### Risk: Sponsor APIs are unstable

Mitigation:
- Build adapter interfaces.
- Add mock adapters.
- Log failures gracefully.
- Maintain demo fallback data.

### Risk: Daytona sandbox takes time to launch

Mitigation:
- Make sandbox feature optional in main flow.
- Pre-create demo sandbox if possible.
- Show progress and fallback exercise text.

### Risk: UI becomes secondary and messy

Mitigation:
- Keep layout simple.
- Prioritize timestamp cards and feedback.
- Use consistent component system.
- Avoid overbuilding.

---

## 23. Final MVP Acceptance Criteria

The MVP is complete when:

1. A demo video can be loaded.
2. Chapters with timestamps are visible.
3. User can ask a question and receive a timestamped answer.
4. Quiz can be generated.
5. User can submit a wrong answer.
6. System identifies a specific misconception.
7. System recommends an exact timestamp range.
8. User can click to watch that segment.
9. Follow-up question is generated.
10. At least 3 sponsor tools are integrated or adapter-backed.
11. Tool orchestration logs are visible.
12. Tests for completed phases pass.
13. `implementation.md` is updated.
