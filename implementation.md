# StudyReplay Implementation Log

This file must be updated after every coding session or phase.

The purpose of this file is to keep the coding agent, human builder, and future contributors aligned on what has been completed, what changed, what was tested, and what remains.

---

## Current Status

**Current phase:** Phase 10 complete; Phase 11 deferred; Phase 12 documentation started  
**Overall status:** Core product complete through Phase 10; setup and end-to-end testing documentation added  
**Last updated:** 2026-06-13  
**Current owner:** Coding agent / human developer  
**Main branch state:** Directory is not initialized as a Git repository  

---

## Environment

Record important environment details here.

```text
Node version: 25.9.0
Package manager: npm 11.12.1
Framework: Next.js 16.2.9 / React 19.2.7 / TypeScript 6.0.3 / Tailwind CSS 4.3.1
Database: In-memory deterministic demo store
AI provider mode: Mock by default; Kimi and TokenRouter adapters available
VideoDB mode: Mock adapter with local fallback; real REST adapter available
Daytona mode: Mock default / Real SDK ready
TokenRouter mode: Mock default / Real route ready when endpoint and model are configured
Nosana mode: Disabled
```

---

## Sponsor Integration Status

| Tool | Status | Mode | Notes |
|---|---|---|---|
| VideoDB | REST and mock adapters implemented | Mock default / Real ready | Search, transcript, URL registration, logs, and local fallback |
| Kimi | Adapter implemented | Mock default / Real ready | OpenAI-compatible server adapter; key, base URL, and model configured |
| Daytona | Official SDK and mock adapters implemented | Mock default / Real ready | Creates sandboxes, writes starter files, executes code, logs latency, and falls back to text-only practice |
| TokenRouter | Adapter, routing policy, cache, and fallback implemented | Mock default / Config pending | Key is set; base URL and model still need sponsor-provided values for real mode |
| Nosana | Optional | Disabled | No API calls implemented |

---

## Phase Log Template

Copy this template after each session.

```md
## YYYY-MM-DD — Phase X: Phase Name

### Summary

Briefly describe what was completed.

### Files changed

- `path/to/file`
- `path/to/file`

### Features implemented

- Feature 1
- Feature 2

### Tests added or updated

- Test 1
- Test 2

### Commands run

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

### Test results

- Lint:
- Typecheck:
- Unit tests:
- Integration tests:
- Build:

### Manual acceptance checks

- [ ] Check 1
- [ ] Check 2

### Issues found

- Issue 1

### Decisions made

- Decision 1

### Next steps

- Next step 1
```

---

## 2026-06-13 — Phase 0: Repo Setup and Project Skeleton

### Summary

Created and verified the initial StudyReplay full-stack foundation. The app now
has a Next.js App Router structure, Tailwind styling, reusable UI primitives,
required page and API route shells, mock-first environment configuration, and
automated test and quality tooling.

### Files changed

- Project config: `package.json`, `package-lock.json`, `tsconfig.json`,
  `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`,
  `vitest.config.mts`, `.gitignore`, `.env.example`
- App routes: `src/app/layout.tsx`, `src/app/page.tsx`,
  `src/app/videos/page.tsx`, `src/app/videos/[id]/page.tsx`,
  `src/app/demo/page.tsx`
- API routes: `src/app/api/health/route.ts`,
  `src/app/api/videos/route.ts`
- UI foundation: `src/app/globals.css`, `src/components/button-link.tsx`,
  `src/components/page-shell.tsx`, `src/components/route-placeholder.tsx`
- Architecture placeholders: `src/lib/**`, `src/server/**`
- Tests: `src/tests/setup.ts`, `src/tests/home.test.tsx`,
  `src/tests/video-workspace.test.tsx`, `src/tests/utils.test.ts`

### Features implemented

- Landing page and shared navigation shell.
- Route shells for `/videos`, `/videos/[id]`, and `/demo`.
- Mock health and video-list API endpoints.
- Mock-first environment defaults for all sponsor integrations.
- Tailwind CSS and a small reusable component foundation.
- ESLint, strict TypeScript, Vitest, Testing Library, and production scripts.

### Tests added or updated

- Landing page renders its product heading and demo link.
- Dynamic video workspace route renders the requested video ID.
- Demo mode utility defaults safely and handles explicit values.

### Commands run

```bash
npm install
npm run lint
npm run typecheck
npm test
npm run build
npm audit
npm run dev
curl http://127.0.0.1:3000/
curl http://127.0.0.1:3000/videos
curl http://127.0.0.1:3000/videos/demo-video
curl http://127.0.0.1:3000/demo
curl http://127.0.0.1:3000/api/health
curl http://127.0.0.1:3000/api/videos
```

### Test results

- Lint: Passed with no warnings.
- Typecheck: Passed.
- Unit/UI tests: 3 files passed, 3 tests passed.
- Integration smoke checks: All four page routes returned HTTP 200; health and
  videos APIs returned valid mock JSON.
- Build: Passed; all expected routes were generated.
- Dependency audit: Passed with 0 vulnerabilities after enforcing patched
  PostCSS 8.5.10 or newer.

### Manual acceptance checks

- [x] App starts locally.
- [x] Landing page is served successfully.
- [x] Required page routes are served successfully.
- [x] Server reported no runtime errors during smoke checks.

### Issues found

- Next.js Turbopack could not bind its internal CSS worker port inside the
  restricted sandbox. The same production build passed outside that sandbox;
  this is an execution-environment restriction, not an application failure.
- The working directory is not a Git repository, so branch state cannot be
  recorded yet.

### Decisions made

- Use Next.js App Router and colocated route handlers for the full-stack base.
- Keep Phase 0 route content intentionally minimal so Phase 1 owns the polished
  workspace UI.
- Default every sponsor integration to mock mode and keep credentials empty.
- Use Vitest and Testing Library for the initial unit and render test setup.

### Next steps

- Begin Phase 1 only: build the visual landing page and demo workspace shell,
  including the specified placeholder panels, states, and timestamp components.
- Initialize Git separately if source-control history is required.

---

## 2026-06-13 — Phase 1: UI Shell and Demo Workspace

### Summary

Built the responsive StudyReplay product shell and all required workspace UI
components before connecting them to data. The interface emphasizes timestamp
evidence, misconception recovery, and visible orchestration.

### Files changed

- Landing and theme: `src/app/page.tsx`, `src/app/globals.css`
- Shared shell: `src/components/page-shell.tsx`,
  `src/components/button-link.tsx`, `src/components/panel.tsx`
- Workspace UI: `src/components/video-workspace.tsx`,
  `video-player.tsx`, `chapter-list.tsx`, `tutor-panel.tsx`,
  `quiz-panel.tsx`, `timestamp-evidence-card.tsx`,
  `misconception-feedback.tsx`, `tool-call-timeline.tsx`, `status-badge.tsx`
- States/utilities: `src/components/empty-state.tsx`,
  `src/components/loading-state.tsx`, `src/lib/utils/time.ts`
- Tests: `src/tests/phase-one-ui.test.tsx` and updated route tests

### Features implemented

- Modern landing page with the Watch → Test → Replay value proposition.
- Responsive video workspace with player, chapters, tutor, quiz, feedback, and
  orchestration panels.
- Prominent timestamp chips and evidence cards.
- Reusable loading and empty states.

### Test results

- Lint: Passed.
- Typecheck: Passed.
- Unit/UI tests: 4 files passed, 9 tests passed.
- Build: Passed.

### Manual acceptance checks

- [x] UI shell is responsive and visually consistent.
- [x] Timestamp ranges are prominent.
- [x] Workspace hierarchy supports video, learning, and evidence panels.
- [x] Empty and loading states are available.

### Issues found

- Two Phase 0 tests referenced old placeholder copy and were updated to assert
  the new product heading and workspace landmarks.

### Decisions made

- Use a calm green and warm neutral palette to distinguish evidence and
  misconception states without excessive visual effects.
- Keep buttons visually present but non-interactive until their API flows are
  implemented in later phases.

### Next steps

- Populate the UI with typed deterministic data in Phase 2.

---

## 2026-06-13 — Phase 2: Data Model and Local Demo Data

### Summary

Added canonical domain types, a deterministic technical-workshop fixture, an
in-memory store, populated app routes, mock API responses, and a known
wrong-answer scenario. The full workspace now renders without sponsor APIs.

### Files changed

- Types: `src/lib/types/index.ts`
- Fixtures/store: `src/lib/db/demo-data.ts`, `src/lib/db/demo-store.ts`
- Populated routes: `src/app/demo/page.tsx`, `src/app/videos/page.tsx`,
  `src/app/videos/[id]/page.tsx`
- Mock APIs: `src/app/api/videos/route.ts`,
  `src/app/api/videos/[id]/route.ts`
- Configuration: `.env`
- Tests: `src/tests/demo-store.test.ts`,
  `src/tests/video-workspace.test.tsx`

### Features implemented

- Typed Video, Chapter, TranscriptSegment, QuizQuestion, LearnerAnswer, and
  ToolCallLog entities.
- One 12:48 demo workshop with five chapters, six transcript segments, and
  three timestamp-grounded quiz questions.
- Cached tutor response and known caching-versus-routing misconception.
- Local tool log creation and listing.
- Basic literal transcript fixture filtering for Phase 2 tests only.
- Video listing/detail APIs that work fully in mock mode.

### Commands run

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm audit
npm run dev
curl http://127.0.0.1:3000/
curl http://127.0.0.1:3000/videos
curl http://127.0.0.1:3000/demo
curl http://127.0.0.1:3000/videos/building-fast-ai-systems
curl http://127.0.0.1:3000/api/videos
curl http://127.0.0.1:3000/api/videos/building-fast-ai-systems
```

### Test results

- Lint: Passed.
- Typecheck: Passed.
- Unit/UI/store tests: 5 files passed, 12 tests passed.
- Build: Passed with `.env` loaded.
- Dependency audit: 0 vulnerabilities.
- Smoke checks: All page routes returned 200; populated APIs returned valid
  mock JSON; an unknown video API request returned 404.

### Manual acceptance checks

- [x] Demo workspace has realistic technical content.
- [x] Chapters align with transcript timestamp boundaries.
- [x] Quiz content is grounded in source segments.
- [x] Full UI is populated without sponsor credentials.

### Issues found

- No blocking Phase 2 issues.
- Buttons remain presentation-only by design; interactive ask, quiz, and seek
  behavior belongs to later phases.

### Decisions made

- Keep the fixture in TypeScript for deterministic typing and zero setup.
- Keep transcript filtering literal and unranked so Phase 3 owns retrieval
  scoring, top-k ordering, and confidence behavior.
- Create a local `.env` with blank secrets and all integrations in mock mode.

### Environment handoff

The local `.env` exists and is ignored by Git. It currently contains blank
slots for `KIMI_API_KEY`, `VIDEODB_API_KEY`, `DAYTONA_API_KEY`,
`TOKENROUTER_API_KEY`, and `NOSANA_API_KEY`. Keep provider modes set to `mock`
until the corresponding adapter phase is implemented; adding a key alone does
not activate a real integration yet.

### Next steps

- Begin Phase 3 only: implement ranked timestamp retrieval over the local
  transcript fixture, with confidence and top-k tests.

---

## 2026-06-13 — Phase 3: Timestamp Retrieval Service

### Summary

Implemented deterministic local timestamp retrieval over transcript fixtures.
The service ranks exact concepts, phrases, and token overlap; returns top-k
evidence with confidence and reasons; and excludes invalid timestamp ranges.

### Files changed

- `src/server/services/transcript-search-service.ts`
- `src/lib/utils/evidence.ts`
- `src/lib/types/index.ts`
- `src/tests/transcript-search-service.test.ts`

### Features implemented

- `TranscriptSearchService` with an injectable transcript source.
- Normalization, stop-word removal, weighted concept/phrase/token scoring.
- Stable top-k ordering and high/medium/low confidence.
- Evidence formatter with timestamp labels and range validation.

### Test results

- Lint: Passed.
- Typecheck: Passed.
- Tests after Phase 3: 6 files passed, 20 tests passed.
- Build: Passed.

### Manual acceptance checks

- [x] `context caching` returns the caching segment at 03:14–04:02.
- [x] `model routing` returns the routing segment.
- [x] `agent sandbox` returns the safe-execution segment.
- [x] Unknown concepts return no evidence and low confidence.

### Decisions made

- Prefer deterministic lexical scoring for the local fallback before adding an
  embedding provider.
- Keep transcript access injectable so VideoDB can replace the local source in
  its later integration phase.

### Next steps

- Add the AI provider abstraction and mock/real adapters in Phase 4.

---

## 2026-06-13 — Phase 4: AI Adapter Layer

### Summary

Implemented the complete AI provider contract for chapter generation,
grounded answers, quiz generation, grading, practice, and summaries. Added a
deterministic mock adapter plus server-only OpenAI-compatible Kimi and
TokenRouter adapters with validation, timeouts, retries, and tool logging.

### Files changed

- Dependency/config: `package.json`, `package-lock.json`, `.env`,
  `.env.example`
- Contracts/config: `src/lib/ai/contracts.ts`, `provider-config.ts`,
  `provider-factory.ts`
- Validation/resiliency: `src/lib/ai/schemas.ts`, `resiliency.ts`
- Adapters: `src/lib/adapters/mock-ai-adapter.ts`, `kimi-adapter.ts`,
  `token-router-adapter.ts`, `openai-compatible-ai-adapter.ts`
- Tests: `src/tests/ai-adapters.test.ts`

### Features implemented

- `AIProvider` interface covering all six required operations.
- Zod schemas and controlled malformed JSON/schema errors.
- Mock provider with valid deterministic outputs for every operation.
- Kimi and TokenRouter OpenAI-compatible chat-completions adapters.
- Environment-based provider factory using `AI_PROVIDER`.
- Abort-based timeout, bounded retry, missing-config errors, and success/failure
  tool logs.
- API credentials are sent only in server-side authorization headers.

### Commands run

```bash
npm install zod
npm run lint
npm run typecheck
npm test
npm run build
npm audit
```

### Test results

- Lint: Passed with no warnings.
- Typecheck: Passed.
- Unit/integration tests: 7 files passed, 28 tests passed.
- Build: Passed with `.env` loaded.
- Dependency audit: 0 vulnerabilities.
- Adapter tests: provider selection, mock outputs, structured validation,
  authorization handling, retry, timeout, and logs all passed.

### Manual acceptance checks

- [x] App remains fully operational in mock mode.
- [x] Kimi can be selected through configuration.
- [x] TokenRouter can be selected when endpoint/model configuration is present.
- [x] Missing credentials or model configuration fails with a clear error.
- [x] Provider operations create tool logs.

### Issues found

- TokenRouter's API key is present, but no authoritative base URL or model name
  was available in the repository. `TOKENROUTER_BASE_URL` and
  `TOKENROUTER_MODEL` are therefore intentionally blank instead of guessed.
- No live paid provider request was made in this phase because
  `AI_PROVIDER=mock`. Adapter behavior is covered with HTTP-level test doubles.

### Decisions made

- Keep mock mode as the default even when keys exist for demo reliability.
- Use a shared OpenAI-compatible transport while retaining named adapters and
  provider-specific configuration.
- Require explicit TokenRouter endpoint/model values before real mode.

### Environment handoff

- Kimi: set `AI_PROVIDER=kimi` to use the configured key, base URL, and model.
- TokenRouter: first fill `TOKENROUTER_BASE_URL` and `TOKENROUTER_MODEL`, then
  set `AI_PROVIDER=tokenrouter`.
- Keep `AI_PROVIDER=mock` for deterministic local development.

### Next steps

- Begin Phase 5 only: connect retrieval and the selected AI adapter through a
  validated ask-video API and interactive tutor UI.

---

## 2026-06-13 — Phase 5: Ask-Video Flow

### Summary

Connected timestamp retrieval and the selected AI provider through a validated
ask-video service and API. The tutor panel now accepts questions, displays
grounded answers and evidence, reports provider/latency, and updates the video
player when an evidence timestamp is selected.

### Files changed

- Server flow: `src/server/services/tutor-service.ts`
- API: `src/app/api/videos/[id]/ask/route.ts`
- Client UI: `src/components/tutor-panel.tsx`,
  `src/components/learning-workspace-client.tsx`,
  `src/components/timestamp-evidence-card.tsx`,
  `src/components/video-player.tsx`, `src/components/video-workspace.tsx`
- Tests: `src/tests/ask-video-route.test.ts`,
  `src/tests/tutor-panel.test.tsx`

### Features implemented

- Validated `POST /api/videos/:id/ask` route.
- Ranked local transcript retrieval before generation.
- AI answer generation receives only retrieved timestamp evidence.
- Honest local uncertainty response when no evidence is found.
- Interactive tutor form with loading and error states.
- Clickable evidence timestamp updates the selected video position.
- Retrieval and provider latency/tool logging.

### Test results

- Lint: Passed.
- Typecheck: Passed.
- Tests after Phase 5: 9 files passed, 33 tests passed.
- Build: Passed with the ask route included.

### Manual acceptance checks

- [x] Asking `What is context caching?` returns a grounded answer.
- [x] Response includes 03:14–04:02 evidence.
- [x] Selecting evidence updates the player timestamp.
- [x] An unrelated question returns low-confidence uncertainty without evidence.

### Issues found

- The generic query term `work` caused an unrelated question to weakly match
  transcript text. It was added to retrieval stop words to preserve honest
  uncertainty behavior.

### Decisions made

- Skip the AI provider entirely when retrieval finds no adequate evidence.
- Use a small client boundary for tutor/player interaction while keeping the
  surrounding workspace server-rendered.

### Next steps

- Add generated quiz state and session persistence in Phase 6.

---

## 2026-06-13 — Phase 6: Quiz Generation Flow

### Summary

Implemented provider-backed quiz generation, local generated-quiz storage, a
public API shape that omits expected answers, and a one-question-at-a-time UI
with short-answer and multiple-choice support. Learner answers persist for the
browser session and are ready for Phase 7 grading.

### Files changed

- Server flow: `src/server/services/quiz-service.ts`
- API: `src/app/api/videos/[id]/quiz/route.ts`
- Store/types: `src/lib/db/demo-store.ts`, `src/lib/types/index.ts`
- Client UI: `src/components/quiz-panel.tsx`,
  `src/components/learning-workspace-client.tsx`,
  `src/components/video-workspace.tsx`
- Route wiring: `src/app/demo/page.tsx`,
  `src/app/videos/[id]/page.tsx`
- Tests: `src/tests/quiz-route.test.ts`,
  `src/tests/quiz-panel.test.tsx`, plus updated UI/route tests

### Features implemented

- `GET` and `POST /api/videos/:id/quiz` endpoints.
- Quiz generation through the configured AI provider.
- Generated question storage with expected answers retained server-side.
- Public quiz responses omit `expectedAnswer`.
- “Test me” generation flow with loading/error states.
- One question at a time, source timestamps, difficulty labels, short answer,
  and multiple choice.
- Answer submission and navigation with `sessionStorage` persistence.

### Commands run

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm audit
npm run dev
curl -X POST http://127.0.0.1:3000/api/videos/building-fast-ai-systems/ask
curl -X POST http://127.0.0.1:3000/api/videos/building-fast-ai-systems/quiz
curl http://127.0.0.1:3000/api/videos/building-fast-ai-systems/quiz
```

### Test results

- Lint: Passed with no warnings.
- Typecheck: Passed.
- Unit/UI/integration tests: 11 files passed, 38 tests passed.
- Build: Passed with ask and quiz routes included.
- Dependency audit: 0 vulnerabilities.
- Live mock smoke checks: grounded ask, uncertainty, quiz generation, quiz
  listing, and `/demo` all succeeded.

### Manual acceptance checks

- [x] “Test me” loads three grounded questions.
- [x] Questions display one at a time with source timestamps.
- [x] Empty answers cannot be submitted.
- [x] Submitted answers and current question persist during the browser session.
- [x] Multiple-choice and short-answer questions render appropriately.

### Issues found

- React lint rejected synchronous session restoration inside an effect. Quiz
  session state now uses lazy initialization from `sessionStorage`.

### Decisions made

- Do not expose expected answers to the browser.
- Record submitted answers without grading them; grading and misconception
  feedback remain owned by Phase 7.
- Use browser-session persistence for MVP quiz continuity.

### Next steps

- Begin Phase 7 only: add the grading API and connect submitted answers to
  structured misconception feedback, recommended timestamps, and retries.

---

## 2026-06-13 — Phase 7: Wrong-Answer Misconception Detection

### Summary

Completed the core StudyReplay loop: submitted quiz answers are graded against
server-side questions and timestamped transcript evidence, then rendered as
correct, partial, or incorrect feedback. Misconceptions include an exact replay
range and a targeted follow-up question.

### Files changed

- Grading flow: `src/server/services/answer-grading-service.ts`
- API: `src/app/api/quiz/[questionId]/answer/route.ts`
- Mock reasoning: `src/lib/adapters/mock-ai-adapter.ts`
- Persistence: `src/lib/db/demo-store.ts`
- UI: `src/components/quiz-panel.tsx`,
  `src/components/misconception-feedback.tsx`,
  `src/components/learning-workspace-client.tsx`
- Tests: `src/tests/answer-grading-route.test.ts`,
  `src/tests/quiz-panel.test.tsx`

### Features implemented

- Validated grading endpoint with server-side expected answers.
- Evidence selection from the question's source timestamp range.
- Deterministic mock grading for correct, partial, incorrect, and the known
  caching-versus-routing confusion.
- Video-duration validation for recommended replay timestamps.
- Stored learner attempts and tool logs.
- Correct feedback state without a misconception warning.
- Clickable “Watch this part” action and follow-up retry prompt.

### Test results

- Lint: Passed.
- Typecheck: Passed.
- Tests after Phase 7: 12 files passed, 43 tests passed.
- Build: Passed after marking the interactive feedback component client-side.

### Manual acceptance checks

- [x] Known wrong answer identifies context caching vs model routing.
- [x] Incorrect feedback includes 03:14–05:56 and a follow-up question.
- [x] Correct answer has no misconception warning.
- [x] Partial answer explains which side of the comparison is missing.
- [x] Replay action updates the selected player timestamp.

### Issues found

- The production build caught an event handler crossing a server/client
  boundary in `MisconceptionFeedback`; the component is now explicitly client-side.

### Decisions made

- Validate AI timestamps against video duration before persisting feedback.
- Keep expected answers and source evidence server-side.
- Allow learners to check an answer again after reviewing feedback.

### Next steps

- Route timestamp retrieval through VideoDB with graceful local fallback.

---

## 2026-06-13 — Phase 8: VideoDB Integration

### Summary

Implemented a provider-neutral video-memory layer with local, mock VideoDB, and
real VideoDB REST adapters. Ask-video retrieval now uses this layer. Mock mode
shows VideoDB operations in the orchestration timeline, while real failures or
empty results continue through the tested local transcript fallback.

### Files changed

- Contracts/config: `src/lib/video-memory/contracts.ts`, `config.ts`,
  `provider-factory.ts`
- Adapters: `src/lib/adapters/local-video-memory-adapter.ts`,
  `mock-videodb-adapter.ts`, `videodb-adapter.ts`
- Fallback orchestration: `src/server/services/video-memory-service.ts`
- Tutor integration: `src/server/services/tutor-service.ts`
- Configuration: `.env`, `.env.example`
- Demo logs: `src/lib/db/demo-data.ts`
- Tests: `src/tests/videodb-adapter.test.ts`

### Features implemented

- `VideoMemoryProvider` interface for registration, transcript retrieval, and
  timestamp search.
- Mock VideoDB adapter backed by deterministic local data.
- Real REST adapter using `x-access-token` authentication.
- URL registration through `/collection/{collection_id}/upload`.
- Timestamped spoken-word search through `/video/{video_id}/search/`.
- Transcript import through `/video/{video_id}/transcription/`.
- Mapping of VideoDB results to internal transcript and evidence types.
- Failure and empty-result fallback to local ranked retrieval.
- Visible VideoDB success/failure and fallback tool logs.

### Commands run

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm audit
npm run dev
curl -X POST http://127.0.0.1:3000/api/quiz/quiz-cache-routing/answer
curl -X POST http://127.0.0.1:3000/api/videos/building-fast-ai-systems/ask
```

### Test results

- Lint: Passed with no warnings.
- Typecheck: Passed.
- Unit/UI/integration tests: 13 files passed, 50 tests passed.
- Build: Passed.
- Dependency audit: 0 vulnerabilities.
- VideoDB tests: mock mode, URL registration, search mapping, transcript
  mapping, empty responses, provider selection, logs, and fallback passed.
- Live mock smoke checks: incorrect/correct/partial grading, VideoDB-routed ask,
  and `/demo` all succeeded.

### Manual acceptance checks

- [x] Mock VideoDB calls appear in the orchestration timeline.
- [x] Timestamped retrieval works through the video-memory layer.
- [x] App continues using local search when VideoDB fails or returns no result.

### Issues found

- Real VideoDB mode needs an external video mapping. `VIDEODB_VIDEO_ID` remains
  blank because the local demo fixture has not been uploaded to VideoDB.
- No real upload/search was triggered to avoid consuming credits or processing
  an unspecified video.

### Decisions made

- Use the official VideoDB REST API rather than adding an SDK dependency.
- Keep `VIDEO_MEMORY_PROVIDER=mock` until a real VideoDB video ID is supplied.
- Treat VideoDB as the preferred timestamp memory layer and local search as a
  reliability fallback.

### Environment handoff

- Current defaults: `VIDEO_MEMORY_PROVIDER=mock`,
  `VIDEODB_BASE_URL=https://api.videodb.io`, and collection `default`.
- For real search, set `VIDEODB_VIDEO_ID` to an indexed VideoDB video ID and
  change `VIDEO_MEMORY_PROVIDER=videodb`.
- The configured API key remains server-only.

### Next steps

- Begin Phase 9 only: generate targeted practice and execute coding exercises
  through a Daytona sandbox with text fallback.

---

## 2026-06-13 — Phase 9: Daytona Practice Sandbox

### Summary

Added targeted coding practice generated from quiz misconceptions. Practice can
run in a deterministic local sandbox or a real Daytona sandbox through the
official TypeScript SDK, with a text-only fallback when provisioning fails.

### Files changed

- Sandbox layer: `src/lib/sandbox/*`, `src/lib/adapters/daytona-adapter.ts`,
  `src/lib/adapters/mock-sandbox-adapter.ts`
- Practice flow: `src/server/services/practice-service.ts`,
  `src/app/api/practice/generate/route.ts`, `src/app/api/practice/run/route.ts`
- UI: `src/components/practice-card.tsx`, `src/components/quiz-panel.tsx`,
  `src/components/misconception-feedback.tsx`
- Configuration/dependencies: `.env.example`, `package.json`, `package-lock.json`
- Tests: `src/tests/practice-service.test.ts`,
  `src/tests/practice-route.test.ts`, `src/tests/practice-card.test.tsx`

### Features implemented

- Provider-neutral create, write, run, and delete sandbox contract.
- Official `@daytona/sdk` adapter with short-lived TypeScript sandboxes.
- Editable starter code, initial verification, reruns, output, exit status, and
  visible provider status in the misconception flow.
- Controlled fallback that preserves the exercise when Daytona is unavailable.

### Test results

- Lint: Passed.
- Typecheck: Passed.
- Focused Phase 9 tests: 3 files passed, 6 tests passed.
- Full suite after Phase 9: 16 files passed, 56 tests passed.
- Build: Passed after allowing Turbopack's internal worker port.

### Issues found

- The restricted execution sandbox blocks Turbopack from binding its internal
  CSS worker port; the same build passes with the required system permission.
- Real Daytona execution was not invoked automatically because
  `SANDBOX_PROVIDER` remains explicitly mock-first.

### Environment handoff

- Use `SANDBOX_PROVIDER=daytona` to enable real execution.
- `DAYTONA_API_KEY` is required. `DAYTONA_API_URL` and `DAYTONA_TARGET` are
  optional and may be left blank for Daytona defaults.

### Next steps

- Implement Phase 10 routing, caching, latency metrics, and orchestration UI.

---

## 2026-06-13 — Phase 10: TokenRouter Optimization and Caching

### Summary

Added explicit simple/complex AI routing, stable caching for repeated timestamp
explanations and quizzes, provider fallback, latency logs, and a live
orchestration panel that refreshes after learner interactions.

### Files changed

- Routing/cache: `src/lib/ai/routing.ts`, `src/lib/ai/orchestrator.ts`,
  `src/lib/cache/response-cache.ts`
- Services: tutor, quiz, answer grading, and practice services
- API/UI: `src/app/api/logs/route.ts`,
  `src/components/orchestration-panel.tsx`, tutor/quiz/practice panels
- Tests: `src/tests/routing-cache.test.ts`,
  `src/tests/orchestration-panel.test.tsx`, updated tutor tests

### Features implemented

- Simple quiz/explanation work routes through TokenRouter when real mode is
  complete; complex misconception/practice work routes through Kimi when opted in.
- Missing configuration and provider errors fall back to deterministic mock AI.
- Canonical cache keys make equivalent inputs stable across property ordering.
- Repeated explanations are marked cached in the tutor UI; repeated quizzes
  avoid another provider call.
- Logs expose route complexity, provider choice, cache hit/miss, fallback, and
  operation latency through `/api/logs` and the live workspace panel.

### Commands run

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm audit
```

### Test results

- Lint: Passed.
- Typecheck: Passed.
- Focused Phase 10 tests: 3 files passed, 7 tests passed.
- Full suite: 18 files passed, 62 tests passed.
- Build: Passed; all page and API routes generated.
- Dependency audit: Reports 15 high-severity transitive `protobufjs` findings
  under Daytona's OpenTelemetry dependencies. The offered forced fix downgrades
  Daytona to 0.173.0, so it was not applied automatically.

### Manual acceptance checks

- [x] Repeated explanation responses are marked cached.
- [x] TokenRouter/cache decisions are visible in orchestration data and UI.
- [x] Mock fallback keeps every AI task operational without external APIs.
- [ ] Real TokenRouter request pending sponsor base URL and model values.
- [ ] Real Daytona request pending explicit `SANDBOX_PROVIDER=daytona` smoke test.

### Decisions made

- Keep all real integrations opt-in even when credentials exist.
- Treat TokenRouter as both the simple-task route and the visible optimization
  layer for cache/routing events.
- Use process-local cache storage for the MVP; persistent/distributed cache is
  deferred until deployment requirements exist.
- Do not force a breaking Daytona downgrade solely to satisfy the current audit.

### Next steps

- Begin Phase 11 only if the optional Nosana worker improves the demo story;
  otherwise continue to Phase 12 hardening when directed.
- Obtain `TOKENROUTER_BASE_URL` and `TOKENROUTER_MODEL` before enabling
  `TOKEN_ROUTER_MODE=real`.

---

## 2026-06-13 — Phase 12 Partial: README and Testing Documentation

### Summary

Added project setup, architecture, environment-mode, limitation, and testing
documentation. Phase 12 remains incomplete because final manual regression,
real-provider smoke tests, and demo hardening have not been performed.

### Files changed

- `README.md`
- `MANUAL_TESTING.md`
- `implementation.md`

### Features documented

- Mock-first local setup and quality commands.
- Optional Kimi, TokenRouter, VideoDB, and Daytona activation.
- Full UI flow, API smoke commands, cache checks, fallback tests, and final
  acceptance checklist.
- Explicit current limitation that timestamp seeking updates a preview
  placeholder rather than streaming real media.

### Tests run

- Documentation-only change; automated checks were not rerun because no runtime
  source or configuration files changed.

### Issues and next steps

- Complete the `MANUAL_TESTING.md` final-pass checklist before presenting.
- Add real media playback if the final product must demonstrate actual seeking.
- Keep Phase 11 deferred unless Nosana materially improves the sponsor story.

---

## Running Decision Log

Use this section for architectural decisions.

| Date | Decision | Reason | Alternatives considered |
|---|---|---|---|
| 2026-06-13 | Next.js App Router with route handlers | Keeps the MVP in one TypeScript full-stack project | Separate frontend and API server |
| 2026-06-13 | Mock-first integration configuration | Phase 0 has no credentials and later phases require graceful local operation | Real providers during setup |
| 2026-06-13 | Vitest and Testing Library | Fast unit and React render checks with TypeScript support | Jest |
| 2026-06-13 | Deterministic TypeScript demo fixtures | Provides typed, zero-setup demo reliability | JSON files or database |
| 2026-06-13 | Literal store filtering only in Phase 2 | Satisfies fixture access without preempting Phase 3 ranking logic | Full retrieval service |
| 2026-06-13 | Weighted lexical retrieval fallback | Deterministic, explainable, and testable without external embeddings | Embedding-only search |
| 2026-06-13 | Shared OpenAI-compatible AI transport | Kimi and TokenRouter can share resiliency and validation while retaining named adapters | Separate duplicated HTTP clients |
| 2026-06-13 | Keep real providers opt-in | Keys can exist without making development or demos depend on network availability | Automatically enable providers when keys exist |
| 2026-06-13 | Retrieval gates video answers | Prevents the model from inventing video-specific context when evidence is absent | Always call the model |
| 2026-06-13 | Keep quiz answers server-only | Avoids leaking grading keys in public API responses | Return complete question objects |
| 2026-06-13 | Persist quiz state in sessionStorage | Maintains progress without adding a database before it is needed | URL state or permanent local storage |
| 2026-06-13 | Validate recommended timestamps against duration | Prevents malformed provider output from producing impossible replay links | Trust provider output |
| 2026-06-13 | Video-memory provider with local fallback | Makes VideoDB central without allowing an external outage to break the demo | VideoDB-only retrieval |
| 2026-06-13 | VideoDB REST integration | Uses the documented API directly and avoids another runtime dependency | Node SDK |
| 2026-06-13 | Official Daytona TypeScript SDK | Uses the current sandbox lifecycle and filesystem/process APIs directly | Custom REST calls |
| 2026-06-13 | Task-aware AI routing with deterministic fallback | Keeps real providers opt-in while making routing choices explicit and testable | One global AI provider |
| 2026-06-13 | Process-local stable response cache | Delivers deterministic MVP cache behavior without adding infrastructure | Redis or database cache |

---

## Known Issues

| Issue | Severity | Status | Notes |
|---|---|---|---|
| Working directory has no Git metadata | Low | Open | Initialize Git when source-control setup is desired |
| Turbopack build needs local port access | Low | Documented | Build passes outside the restricted sandbox |
| Daytona SDK dependency audit findings | High | Open upstream | 15 transitive `protobufjs` findings; npm's forced fix requires a breaking Daytona downgrade |

---

## Current TODO

- [x] Set up project foundation.
- [x] Create app skeleton.
- [x] Build UI shell.
- [x] Add demo data.
- [x] Implement timestamp retrieval.
- [x] Implement AI adapters.
- [x] Implement ask-video flow.
- [x] Implement quiz flow.
- [x] Implement misconception detection.
- [x] Integrate VideoDB.
- [x] Integrate Daytona.
- [x] Add TokenRouter/caching.
- [ ] Polish demo.

---

## Demo Readiness Checklist

- [ ] Demo video loads.
- [x] Chapters show timestamps.
- [x] Ask-video flow works.
- [x] Timestamped evidence appears.
- [x] Quiz generation works.
- [x] Wrong answer produces misconception diagnosis.
- [x] Recommended timestamp is clickable.
- [x] Follow-up question appears.
- [x] Daytona practice works or fallback works.
- [x] Orchestration log shows sponsor tools.
- [x] App handles missing API keys.
- [x] Build passes.
- [ ] Final demo script is ready.
