# StudyReplay Architecture

## 1. Architecture Goal

StudyReplay should be built as a production-style AI application where every tool has a clear responsibility.

The system should prioritize:

1. Timestamp accuracy.
2. Low-latency learner interactions.
3. Reliable demo flow.
4. Clean sponsor-tool orchestration.
5. Adapter-based integrations.
6. Easy fallback to mock/local mode.

---

## 2. High-Level Architecture

```text
User Interface
  |
  |-- Video Workspace
  |-- Tutor Panel
  |-- Quiz Panel
  |-- Evidence Timeline
  |-- Orchestration Log
  |
Application API Layer
  |
  |-- Video Service
  |-- Transcript Search Service
  |-- Tutor Service
  |-- Quiz Service
  |-- Practice Service
  |-- Tool Log Service
  |
Integration Adapter Layer
  |
  |-- VideoDB Adapter
  |-- Kimi Adapter
  |-- TokenRouter Adapter
  |-- Daytona Adapter
  |-- Nosana Adapter
  |-- Mock Adapters
  |
External Tools
  |
  |-- VideoDB
  |-- Kimi AI
  |-- TokenRouter
  |-- Daytona
  |-- Nosana
```

---

## 3. Core Data Flow

## 3.1 Video indexing flow

```text
Upload/Register Video
  ↓
Video Service
  ↓
VideoDB Adapter
  ↓
VideoDB stores/processes video
  ↓
Transcript segments returned/imported
  ↓
Chapter generation via Kimi
  ↓
Local DB stores Video, Chapters, TranscriptSegments
  ↓
UI shows ready workspace
```

For demo reliability, local preloaded transcript data should be available.

---

## 3.2 Ask-video flow

```text
User asks question
  ↓
API receives question
  ↓
Transcript Search Service retrieves timestamped segments
  ↓
Tutor Service sends question + retrieved context to Kimi/TokenRouter
  ↓
AI returns grounded answer + evidence timestamps
  ↓
Tool logs are recorded
  ↓
UI streams/displays answer and timestamp cards
```

---

## 3.3 Wrong-answer flow

```text
User submits quiz answer
  ↓
Quiz Service loads question + expected answer + source transcript
  ↓
Transcript Search Service retrieves additional relevant context if needed
  ↓
Tutor Service asks Kimi to grade answer
  ↓
Kimi returns status + misconception + timestamp + follow-up question
  ↓
UI shows misconception feedback
  ↓
User clicks timestamp to rewatch
```

This is the core product loop.

---

## 3.4 Practice sandbox flow

```text
User clicks "Practice this"
  ↓
Practice Service asks Kimi to generate exercise
  ↓
Daytona Adapter creates sandbox
  ↓
Starter files/notebook are written
  ↓
User runs code/tests
  ↓
Output is shown in UI
  ↓
Kimi can review output and give feedback
```

---

## 4. Adapter Pattern

All sponsor tools should be accessed through adapter interfaces.

### Benefits

- Easy mock mode.
- Easy testing.
- Cleaner error handling.
- No sponsor-specific code in UI.
- Better demo fallback.

### Example interfaces

```ts
interface VideoMemoryProvider {
  registerVideo(input: RegisterVideoInput): Promise<VideoRegistrationResult>
  getTranscript(videoId: string): Promise<TranscriptSegment[]>
  search(videoId: string, query: string, topK: number): Promise<RetrievedSegment[]>
}

interface AIProvider {
  answerQuestion(input: AnswerQuestionInput): Promise<AnswerQuestionResult>
  generateQuiz(input: GenerateQuizInput): Promise<QuizQuestion[]>
  gradeAnswer(input: GradeAnswerInput): Promise<AnswerFeedback>
  generatePractice(input: GeneratePracticeInput): Promise<PracticeTask>
}

interface SandboxProvider {
  createSandbox(input: CreateSandboxInput): Promise<Sandbox>
  writeFiles(sandboxId: string, files: SandboxFile[]): Promise<void>
  runCommand(sandboxId: string, command: string): Promise<CommandResult>
}
```

---

## 5. Recommended Backend Services

### VideoService

Responsibilities:
- Create video records.
- Track indexing status.
- Load video metadata.
- Coordinate VideoDB indexing.

### TranscriptSearchService

Responsibilities:
- Search timestamped transcript segments.
- Rank retrieved segments.
- Provide fallback search if VideoDB unavailable.
- Return evidence-ready results.

### TutorService

Responsibilities:
- Ask-video response generation.
- Misconception detection.
- Explanation generation.
- Practice generation.
- Prompt construction.
- AI output validation.

### QuizService

Responsibilities:
- Generate quiz questions.
- Store quiz questions.
- Submit and grade answers.
- Track learner attempts.

### PracticeService

Responsibilities:
- Generate exercises.
- Manage Daytona sandbox creation.
- Run tests/code.
- Return outputs.

### ToolLogService

Responsibilities:
- Record tool calls.
- Record latency.
- Record success/failure.
- Expose logs to UI.

---

## 6. Low-Latency Strategy

1. Preload demo video data.
2. Cache chapters and quiz questions.
3. Cache repeated timestamp explanations.
4. Stream tutor responses.
5. Use retrieval before generation to reduce prompt size.
6. Route simple tasks to cheaper/faster models through TokenRouter.
7. Use Kimi for complex reasoning only.
8. Keep Daytona sandbox creation optional in the core loop.
9. Show progress immediately for long tasks.
10. Log latency for demo storytelling.

---

## 7. Tool Routing Strategy

Suggested routing:

| Task | Preferred route |
|---|---|
| Transcript search | VideoDB/local search |
| Chapter generation | Kimi or TokenRouter |
| Quiz generation | TokenRouter for simple, Kimi for harder |
| Misconception detection | Kimi |
| Timestamp explanation | Kimi with cached retrieval |
| Practice generation | Kimi |
| Code execution | Daytona |
| Heavy preprocessing | Nosana |
| Repeated answer | Cache |

---

## 8. Error Handling Strategy

Every integration must fail gracefully.

### If VideoDB fails

- Use local transcript fallback.
- Show warning in logs.
- Keep demo running.

### If Kimi fails

- Retry once.
- Use cached/mock response if demo mode.
- Show friendly error.

### If Daytona fails

- Show text-only exercise.
- Mark sandbox unavailable.
- Continue learning flow.

### If TokenRouter fails

- Route directly to Kimi or mock provider.
- Record fallback in logs.

### If Nosana fails

- Skip optional heavy compute job.
- Continue with VideoDB/local data.

---

## 9. Observability

The app should expose a simple orchestration log for demo.

Each log entry should show:
- Tool name.
- Operation.
- Status.
- Latency.
- Short input summary.
- Short output summary.

Example:

```text
VideoDB · Search transcript · 423 ms · Found 3 timestamped segments
Kimi · Grade answer · 1280 ms · Misconception: context caching vs routing
TokenRouter · Cache lookup · 87 ms · Cache miss
Daytona · Create sandbox · 4100 ms · Sandbox ready
```

This helps judges see the orchestration.

---

## 10. Security and Privacy

For hackathon MVP:
- Do not expose API keys to frontend.
- Keep sponsor calls server-side.
- Sanitize user inputs before sending to shell/sandbox.
- Never run user code outside Daytona.
- Avoid storing unnecessary personal data.
- Use environment variables for credentials.
- Provide `.env.example`.

---

## 11. Deployment

Recommended for hackathon:

- Frontend/backend: Vercel or local demo.
- Database: SQLite, local JSON, or managed Postgres.
- Demo mode: must work locally.
- External APIs: optional but visible when credentials are configured.

---

## 12. Demo Mode

Demo mode is required.

Demo mode should:
- Load a known video.
- Load known transcript/chapter data.
- Include one known quiz question.
- Include one known wrong-answer example.
- Include fallback AI responses.
- Let the team demo even if APIs are slow.

Environment variable:

```bash
DEMO_MODE=true
```
