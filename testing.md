# StudyReplay Testing Plan

## 1. Testing Philosophy

StudyReplay must be tested phase-by-phase. The core feature is timestamp-aware misconception detection, so tests should protect that flow carefully.

Every phase should include:
1. Unit tests.
2. Integration tests where applicable.
3. Manual acceptance checks.
4. Demo regression checks.

A phase is not complete until:
- Code is implemented.
- Tests are added or updated.
- Tests pass.
- `implementation.md` is updated.

---

## 2. Test Categories

### Unit tests

Used for:
- Utility functions.
- Timestamp formatting.
- Data mapping.
- Prompt input construction.
- Schema validation.
- Routing decisions.

### Integration tests

Used for:
- API routes.
- Service coordination.
- Adapter mock responses.
- Ask-video flow.
- Quiz answer flow.

### UI tests

Used for:
- Core rendering.
- Button flows.
- Timestamp cards.
- Quiz submission.
- Misconception feedback.

### Manual demo tests

Used for:
- Full demo flow.
- Sponsor orchestration log.
- Visual polish.
- Latency check.

---

## 3. Phase-by-Phase Tests

## Phase 0: Repo Setup

### Automated tests

- App renders without crashing.
- Landing route returns 200.
- Typecheck passes.
- Lint passes.
- Test runner works.

### Manual checks

- [ ] App starts locally.
- [ ] Landing page visible.
- [ ] No console errors.

---

## Phase 1: UI Shell

### Automated tests

- `VideoPlayer` renders placeholder/demo video.
- `ChapterList` renders chapter titles and timestamps.
- `TimestampEvidenceCard` formats timestamps correctly.
- `TutorPanel` renders empty state.
- `QuizPanel` renders empty state.
- `MisconceptionFeedback` renders misconception and timestamp.

### Manual checks

- [ ] UI looks modern and clean.
- [ ] Timestamp chips are visually obvious.
- [ ] Workspace layout is usable.
- [ ] Loading states are visible.

---

## Phase 2: Local Demo Data

### Automated tests

- Demo video can be loaded.
- Demo chapters can be loaded.
- Demo transcript segments can be loaded.
- Demo quiz questions can be loaded.
- Tool logs can be created.

### Manual checks

- [ ] Demo workspace has realistic content.
- [ ] Chapters align with expected timestamps.
- [ ] Quiz content feels relevant.

---

## Phase 3: Timestamp Retrieval

### Automated tests

Use known transcript fixtures.

Required tests:
- Query `context caching` returns segment containing context caching.
- Query `model routing` returns segment containing model routing.
- Query `agent sandbox` returns segment containing sandbox/execution.
- Unknown query returns low confidence or empty result.
- Top-k results are sorted by score.
- Timestamp ranges are valid.
- No result has `endSec <= startSec`.

### Manual checks

- [ ] Search feels relevant.
- [ ] Returned evidence is understandable.
- [ ] Bad queries do not hallucinate evidence.

---

## Phase 4: AI Adapter Layer

### Automated tests

- Mock AI adapter returns valid ask response.
- Mock AI adapter returns valid quiz questions.
- Mock AI adapter returns valid answer feedback.
- Kimi adapter request construction does not expose frontend secrets.
- TokenRouter adapter can be selected through config.
- Output schema validation catches malformed JSON.
- Timeout handling returns controlled error.

### Manual checks

- [ ] App works in mock mode.
- [ ] Missing API key shows clear error.
- [ ] Tool logs record adapter calls.

---

## Phase 5: Ask-Video Flow

### Automated tests

- Ask API accepts valid question.
- Ask API rejects empty question.
- Ask API retrieves transcript evidence.
- Ask API returns answer with evidence.
- Ask API returns uncertainty when no evidence found.
- UI displays answer.
- UI displays timestamp evidence card.

### Manual checks

- [ ] Ask "What is context caching?"
- [ ] Answer includes timestamp.
- [ ] Clicking timestamp seeks video or updates selected segment.
- [ ] Response starts quickly.

---

## Phase 6: Quiz Generation

### Automated tests

- Quiz generation returns at least one question.
- Each question has expected answer.
- Each question has source timestamp.
- Question difficulty is valid.
- Quiz UI displays question.
- Submit button is disabled for empty answer.

### Manual checks

- [ ] Click "Test me."
- [ ] Quiz appears.
- [ ] Question is understandable.
- [ ] Timestamp/source concept is available internally.

---

## Phase 7: Misconception Detection

This is the most important phase.

### Required fixture

Create a fixture where:
- Concept A: context caching.
- Concept B: model routing.
- Wrong answer mixes them up.

### Automated tests

- Wrong answer returns status `incorrect` or `partial`.
- Feedback includes misconception text.
- Feedback mentions confused concepts.
- Feedback includes recommended timestamp.
- Feedback includes follow-up question.
- Correct answer returns status `correct`.
- Correct answer does not show misconception warning.
- Partial answer gives nuanced feedback.
- Recommended timestamp is within source video duration.
- UI shows "Watch this part" button.

### Manual checks

- [ ] Submit deliberately wrong answer.
- [ ] App says what was misunderstood.
- [ ] App gives timestamp range.
- [ ] App gives short explanation.
- [ ] App gives retry/follow-up question.
- [ ] Timestamp can be clicked.

---

## Phase 8: VideoDB Integration

### Automated tests

- VideoDB adapter maps external response to internal transcript segments.
- VideoDB search maps to `RetrievedSegment`.
- Adapter handles empty response.
- Adapter handles API failure.
- Fallback to local retrieval works.
- Logs include VideoDB operation.

### Manual checks

- [ ] Real or mock VideoDB call appears in orchestration log.
- [ ] Timestamped retrieval still works.
- [ ] App continues if VideoDB fails.

---

## Phase 9: Daytona Practice Sandbox

### Automated tests

- Practice generation returns valid exercise.
- Sandbox creation mock returns sandbox ID.
- Run command mock returns output.
- Failure returns fallback text exercise.
- UI displays sandbox status.

### Manual checks

- [ ] Click "Practice this."
- [ ] Exercise appears.
- [ ] Sandbox status is visible.
- [ ] Output or fallback is shown.

---

## Phase 10: TokenRouter and Caching

### Automated tests

- Routing rules choose expected provider.
- Cache key is stable.
- Cache hit returns cached response.
- Cache miss calls provider.
- Logs show routing decision.
- Fallback path works.

### Manual checks

- [ ] Repeat same question.
- [ ] Second response is faster or marked cached.
- [ ] Orchestration log shows TokenRouter/cache event.

---

## Phase 11: Nosana Optional Worker

### Automated tests

- Mock job submission succeeds.
- Job status updates.
- Failed job does not break UI.
- Logs show Nosana job.

### Manual checks

- [ ] Optional worker appears in logs.
- [ ] Main app works without Nosana.

---

## Phase 12: Demo Hardening

### Full regression test

The following must work from a clean app start:

1. Open app.
2. Load demo video.
3. See chapters.
4. Ask a question.
5. Get timestamped answer.
6. Generate quiz.
7. Submit wrong answer.
8. See misconception diagnosis.
9. See timestamp recommendation.
10. Click timestamp.
11. Generate follow-up practice.
12. See orchestration log.
13. Build passes.

### Manual demo checklist

- [ ] Demo completes under 3 minutes.
- [ ] No blank loading states.
- [ ] No unhandled errors.
- [ ] UI looks polished.
- [ ] Sponsor tools are clearly visible.
- [ ] Core timestamp loop is obvious.

---

## 4. Test Data Requirements

Create a deterministic demo fixture with:

### Transcript concepts

- Context caching.
- Model routing.
- Agent sandboxes.
- Tool orchestration.
- Video timestamp retrieval.

### Known wrong answer

Question:
"What is the difference between context caching and model routing?"

Expected answer:
Context caching reuses prior context/computation to reduce latency or cost, while model routing chooses which model should handle a task based on cost, speed, or capability.

Wrong answer:
"Context caching is when the system chooses the cheapest model for each user request."

Expected feedback:
- Incorrect or partial.
- Misconception: mixing context caching with model routing.
- Timestamp: segment where both are explained.
- Follow-up question: "What does context caching reuse?"

---

## 5. Continuous Quality Rules

Before marking any phase complete:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

If a command does not exist yet, create it or document why it is not available in `implementation.md`.

---

## 6. Demo Reliability Rules

The app must have:
- Mock AI mode.
- Local transcript fallback.
- Preloaded demo data.
- Cached known wrong-answer response.
- Graceful integration failure handling.
- Visible errors only in debug/log panel, not disruptive UI.
