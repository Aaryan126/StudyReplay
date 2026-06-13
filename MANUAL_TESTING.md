# StudyReplay Testing Guide

This guide verifies the completed Phase 0-10 application. Run the mock-mode
checks first. Real-provider checks are optional and may use external quota.

## 1. Clean Setup

From the project root:

```bash
npm install
test -f .env || cp .env.example .env
```

Use these values for the reliable baseline:

```dotenv
DEMO_MODE=true
AI_PROVIDER=mock
VIDEO_MEMORY_PROVIDER=mock
SANDBOX_PROVIDER=mock
TOKEN_ROUTER_MODE=mock
NOSANA_MODE=disabled
```

Do not remove existing credentials from your private `.env`; provider modes,
not the presence of keys, control whether real APIs are called.

## 2. Automated Checks

Run:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Expected baseline from the latest implementation session:

- ESLint passes.
- TypeScript passes with no emitted files.
- 18 test files and 62 tests pass.
- The production build completes and lists all page/API routes.

If Turbopack reports that it cannot bind an internal worker port, rerun the
build outside a restricted shell. This is an environment limitation already
recorded in `implementation.md`.

Optional dependency report:

```bash
npm audit
```

Expect current transitive Daytona/OpenTelemetry `protobufjs` findings. Do not
run `npm audit fix --force` without reviewing the proposed Daytona downgrade.

## 3. Start the App

```bash
npm run dev
```

In another terminal:

```bash
curl http://localhost:3000/api/health
```

Expected response includes:

```json
{"status":"ok","service":"study-replay","mode":"mock"}
```

## 4. Page Smoke Test

Open each page and confirm it loads without a blank state or console error:

1. `http://localhost:3000/`
2. `http://localhost:3000/videos`
3. `http://localhost:3000/demo`
4. `http://localhost:3000/videos/building-fast-ai-systems`

Expected:

- Landing page explains Watch, Test, Replay.
- Video library shows `Building Fast AI Systems`.
- Workspace shows player preview, chapters, tutor, quiz, feedback, and logs.
- The player says `Video preview placeholder`; real media playback is not yet
  implemented.

## 5. Tutor and Timestamp Test

On `/demo` or the dynamic workspace:

1. Enter `What is context caching?` in Ask StudyReplay.
2. Click **Ask**.
3. Confirm the answer explains reuse of prior context or computation.
4. Confirm evidence shows `03:14-04:02`.
5. Click the evidence timestamp.
6. Confirm the displayed current video timestamp changes to `03:14` and the
   progress bar moves.

Uncertainty check:

1. Ask `How does photosynthesis work?`.
2. Confirm the response says there is not enough video evidence.
3. Confirm no fabricated timestamp evidence appears.

## 6. Explanation Cache Test

The cache is in server memory, so keep the same dev-server process running.

1. Ask `What is context caching?` once.
2. Ask the exact same question again.
3. Confirm the second response metadata includes `cached`.
4. In **Orchestration log**, confirm a `Cache hit - timestamp explanation`
   event appears.

Restarting the server clears this cache.

## 7. Quiz and Misconception Test

For a clean quiz, open a private browser window or clear this key in DevTools:

```js
sessionStorage.removeItem("studyreplay-quiz-building-fast-ai-systems")
```

Then:

1. Click **Test me**.
2. Confirm a question appears with source timestamp and difficulty.
3. Confirm **Check my answer** is disabled while the answer is empty.
4. For the caching-versus-routing question, enter:

   `Context caching chooses the cheapest model for each request.`

5. Submit the answer.
6. Confirm feedback identifies `Context caching vs model routing`.
7. Confirm the explanation says choosing a model is routing.
8. Confirm a follow-up question and replay timestamp appear.
9. Click **Watch this part** and confirm the displayed player timestamp changes
   to `03:14`.

Correct-answer check:

`Caching reuses prior computation, while routing selects which model handles the task.`

Expected: correct feedback without a misconception warning.

## 8. Practice Sandbox Test

After producing incorrect or partial quiz feedback:

1. Click **Practice this**.
2. Confirm an exercise, success criteria, editable code, and `Mock ready` appear.
3. Confirm the initial output reports a passing mock verification.
4. Replace the code with:

```js
console.log("Caching reuses work; model routing selects a model.");
```

5. Click **Run in sandbox**.
6. Confirm output includes `PASS` and the orchestration log records the run.

Failure-result check:

```js
console.log("Only one concept is described.");
```

Expected: mock output reports that both caching/reuse and model routing are
required.

## 9. Quiz Cache Test

Quiz progress is stored in `sessionStorage`, while generated quiz output is
cached by the server.

1. Generate a quiz.
2. Clear only the browser quiz session key shown above.
3. Click **Test me** again without restarting the server.
4. Confirm the orchestration log includes `Cache hit - quiz`.

## 10. Orchestration Test

After tutor, quiz, grading, and practice interactions, verify the live log shows
some or all of:

- VideoDB or local transcript search.
- TokenRouter routing decision.
- Cache hit or miss.
- Mock AI, Kimi, or TokenRouter provider operation.
- Daytona or local mock sandbox operation.
- Latency in milliseconds.
- Fallback event when a configured real provider fails.

The log endpoint can also be inspected directly:

```bash
curl http://localhost:3000/api/logs
```

## 11. API Smoke Tests

Set the demo ID once:

```bash
VIDEO_ID=building-fast-ai-systems
```

List videos and load the fixture:

```bash
curl http://localhost:3000/api/videos
curl http://localhost:3000/api/videos/$VIDEO_ID
```

Ask a grounded question:

```bash
curl -X POST http://localhost:3000/api/videos/$VIDEO_ID/ask \
  -H 'Content-Type: application/json' \
  -d '{"question":"What is context caching?"}'
```

Generate a quiz:

```bash
curl -X POST http://localhost:3000/api/videos/$VIDEO_ID/quiz \
  -H 'Content-Type: application/json' \
  -d '{"count":3}'
```

Grade the known misconception:

```bash
curl -X POST http://localhost:3000/api/quiz/quiz-cache-routing/answer \
  -H 'Content-Type: application/json' \
  -d '{"answer":"Context caching chooses the cheapest model."}'
```

Generate practice:

```bash
curl -X POST http://localhost:3000/api/practice/generate \
  -H 'Content-Type: application/json' \
  -d '{"questionId":"quiz-cache-routing","misconception":"Context caching vs model routing"}'
```

The response contains a `sandboxId`. Use it to test `/api/practice/run`:

```bash
curl -X POST http://localhost:3000/api/practice/run \
  -H 'Content-Type: application/json' \
  -d '{"sandboxId":"PASTE_SANDBOX_ID","code":"console.log(\"Caching reuses work; routing selects a model.\");"}'
```

Validation checks:

```bash
curl -i -X POST http://localhost:3000/api/videos/$VIDEO_ID/ask \
  -H 'Content-Type: application/json' -d '{"question":""}'

curl -i -X POST http://localhost:3000/api/videos/$VIDEO_ID/quiz \
  -H 'Content-Type: application/json' -d '{"count":10}'
```

Expected: both return HTTP 400 with controlled JSON errors.

## 12. Fallback Tests

### Missing credentials

Keep provider modes set to `mock` and remove or blank credentials. Restart the
server and confirm the full demo still works.

### Incomplete TokenRouter

Set:

```dotenv
TOKEN_ROUTER_MODE=real
TOKENROUTER_BASE_URL=
TOKENROUTER_MODEL=
```

Restart and ask a question. Expected: routing uses deterministic mock fallback;
the app remains operational.

### Daytona text fallback

Set `SANDBOX_PROVIDER=daytona` with an invalid or unavailable key, restart, and
generate practice. Expected: the exercise remains visible as `Text-only
fallback`, with a controlled reason instead of an application crash.

Restore `SANDBOX_PROVIDER=mock` afterward.

## 13. Optional Real Integration Tests

Run these individually, restarting the dev server after each `.env` change.

### Real Kimi

Required:

```dotenv
AI_PROVIDER=kimi
KIMI_API_KEY=...
KIMI_BASE_URL=https://api.moonshot.ai/v1
KIMI_MODEL=kimi-k2.6
```

Test misconception grading and practice generation. Confirm Kimi appears in the
orchestration log. A provider failure should fall back to mock output.

### Real TokenRouter

Required:

```dotenv
TOKEN_ROUTER_MODE=real
TOKENROUTER_API_KEY=...
TOKENROUTER_BASE_URL=...
TOKENROUTER_MODEL=...
```

Ask a new question or generate a new quiz after restarting to avoid existing
cache entries. Confirm TokenRouter appears in the orchestration log.

### Real VideoDB

Required:

```dotenv
VIDEO_MEMORY_PROVIDER=videodb
VIDEODB_API_KEY=...
VIDEODB_VIDEO_ID=...
```

The external ID must refer to an indexed video whose timestamps align with the
demo lesson. Ask a grounded question and confirm VideoDB search appears in the
log. Failure should return to local transcript search.

### Real Daytona

Required:

```dotenv
SANDBOX_PROVIDER=daytona
DAYTONA_API_KEY=...
```

Generate practice, confirm `Daytona ready`, run code, and inspect output. This
creates a real sandbox and may consume quota. Restore mock mode after testing.

## 14. Final Pass Checklist

- [ ] Landing page and workspace load without console errors.
- [ ] Grounded tutor answer includes timestamp evidence.
- [ ] Unknown topic returns honest uncertainty.
- [ ] Timestamp buttons update the preview position.
- [ ] Wrong answer produces the known misconception.
- [ ] Correct answer avoids misconception feedback.
- [ ] Practice generates and code runs or text fallback appears.
- [ ] Repeated explanation is marked cached.
- [ ] Repeated quiz produces a cache-hit log.
- [ ] Orchestration log refreshes after interactions.
- [ ] Missing keys do not break mock mode.
- [ ] Lint, typecheck, tests, and build pass.
