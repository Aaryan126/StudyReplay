# StudyReplay

StudyReplay turns technical videos into a timestamp-aware learning loop:

1. Ask a question about the lesson.
2. Receive an answer grounded in transcript evidence.
3. Generate and answer a knowledge check.
4. Detect a misconception and jump back to the relevant timestamp.
5. Generate a focused coding exercise and run it in a sandbox.

The project is mock-first. The complete demo works without external API keys,
while VideoDB, Kimi, Daytona, and TokenRouter remain available behind adapters.

## Current Scope

- Preloaded demo lesson, transcript, chapters, and quiz data.
- Timestamp-ranked transcript retrieval with VideoDB and local fallback modes.
- Kimi and TokenRouter-compatible AI adapters with timeout, retry, validation,
  task routing, and deterministic fallback.
- Misconception grading with recommended replay timestamps.
- Mock and Daytona practice sandboxes.
- In-memory caching for repeated explanations and quizzes.
- Live orchestration log showing routing, cache, provider, fallback, and latency.

The current video player is a preview placeholder. Timestamp buttons update its
displayed position and progress bar, but no media file is streamed yet.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript 6
- Tailwind CSS 4
- Vitest and Testing Library
- Zod
- Daytona TypeScript SDK

## Quick Start

Requirements:

- Node.js 20 or newer
- npm

Install and configure:

```bash
npm install
test -f .env || cp .env.example .env
```

The default values use deterministic mocks, so no credentials are required.

Start the development server:

```bash
npm run dev
```

Open:

- `http://localhost:3000/` - landing page
- `http://localhost:3000/demo` - populated demo workspace
- `http://localhost:3000/videos` - video library

## Quality Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

See [MANUAL_TESTING.md](./MANUAL_TESTING.md) for the complete UI, API, cache,
fallback, and optional real-provider test procedure.

## Environment Modes

Keep `.env` private. It is ignored by Git; `.env.example` documents supported
settings.

### Mock mode

```dotenv
DEMO_MODE=true
AI_PROVIDER=mock
VIDEO_MEMORY_PROVIDER=mock
SANDBOX_PROVIDER=mock
TOKEN_ROUTER_MODE=mock
NOSANA_MODE=disabled
```

This is the recommended development and demo baseline.

### Kimi

Kimi handles complex misconception grading and practice generation when enabled:

```dotenv
AI_PROVIDER=kimi
KIMI_API_KEY=...
KIMI_BASE_URL=https://api.moonshot.ai/v1
KIMI_MODEL=kimi-k2.6
```

If the provider request fails, the orchestrator continues with deterministic
mock output.

### TokenRouter

TokenRouter handles simple quiz and explanation work when all values are set:

```dotenv
TOKEN_ROUTER_MODE=real
TOKENROUTER_API_KEY=...
TOKENROUTER_BASE_URL=...
TOKENROUTER_MODEL=...
```

The base URL and model must come from the active TokenRouter account or sponsor
documentation. Do not guess them. Incomplete configuration uses mock fallback.

### VideoDB

```dotenv
VIDEO_MEMORY_PROVIDER=videodb
VIDEODB_API_KEY=...
VIDEODB_BASE_URL=https://api.videodb.io
VIDEODB_COLLECTION_ID=default
VIDEODB_VIDEO_ID=...
```

`VIDEODB_VIDEO_ID` must identify an indexed video corresponding to the demo
lesson. VideoDB failure falls back to local transcript retrieval.

### Daytona

```dotenv
SANDBOX_PROVIDER=daytona
DAYTONA_API_KEY=...
DAYTONA_API_URL=
DAYTONA_TARGET=
```

The API URL and target are optional when Daytona's defaults are appropriate.
Real tests create a sandbox and may consume account quota. StudyReplay configures
auto-stop after 15 minutes and auto-delete after 60 minutes.

### Nosana

Nosana is intentionally disabled. Phase 11 is optional and has not been
implemented.

## Main Routes

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/demo` | Preloaded learning workspace |
| `/videos` | Demo video library |
| `/videos/building-fast-ai-systems` | Dynamic workspace route |
| `/api/health` | Health and mode response |
| `/api/videos` | Video list |
| `/api/videos/:id/ask` | Grounded tutor question |
| `/api/videos/:id/quiz` | Quiz listing and generation |
| `/api/quiz/:questionId/answer` | Answer grading |
| `/api/practice/generate` | Practice and sandbox creation |
| `/api/practice/run` | Sandbox code execution |
| `/api/logs` | Current in-process orchestration logs |

## Architecture

```text
Next.js UI and route handlers
  -> Tutor, quiz, grading, practice, and video-memory services
  -> Provider-neutral adapter contracts
  -> Mock providers or VideoDB/Kimi/TokenRouter/Daytona
  -> Local fallback, response cache, and orchestration logs
```

Important project documents:

- `prd.md` - product requirements
- `plan.md` - phased implementation plan
- `architecture.md` - system architecture
- `testing.md` - phase-level testing plan
- `implementation.md` - completed work, decisions, and known issues
- `MANUAL_TESTING.md` - hands-on verification procedure

## Known Limitations

- State is held in process memory and resets when the server restarts.
- Quiz progress is held in browser `sessionStorage`.
- The response cache is process-local, not shared or persistent.
- The video player does not yet stream real media.
- Real TokenRouter testing requires a valid base URL and model.
- `npm audit` currently reports transitive `protobufjs` findings through the
  Daytona SDK's OpenTelemetry dependencies. The offered forced fix requires a
  breaking Daytona downgrade and has not been applied.
