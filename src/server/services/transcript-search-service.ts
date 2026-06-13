import { getTranscriptByVideoId } from "@/lib/db/demo-store";
import type {
  RetrievedSegment,
  TranscriptSearchResult,
  TranscriptSegment,
} from "@/lib/types";

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "did",
  "do",
  "does",
  "for",
  "how",
  "in",
  "is",
  "it",
  "of",
  "on",
  "the",
  "this",
  "to",
  "was",
  "what",
  "where",
  "why",
  "work",
]);

export type TranscriptSource = (videoId: string) => TranscriptSegment[];

export type TranscriptSearchOptions = {
  topK?: number;
  minimumScore?: number;
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value: string): string[] {
  return normalize(value)
    .split(" ")
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function scoreSegment(segment: TranscriptSegment, query: string) {
  const normalizedQuery = normalize(query);
  const queryTokens = [...new Set(tokenize(query))];
  const normalizedText = normalize(segment.text);
  const normalizedConcepts = segment.concepts.map(normalize);
  const searchable = `${normalizedText} ${normalizedConcepts.join(" ")}`;
  const matchedTokens = queryTokens.filter((token) => searchable.includes(token));
  const exactConcepts = normalizedConcepts.filter(
    (concept) => concept === normalizedQuery || normalizedQuery.includes(concept),
  );
  const phraseInText = normalizedQuery.length > 2 && normalizedText.includes(normalizedQuery);

  if (queryTokens.length === 0 || matchedTokens.length === 0) {
    return { score: 0, reason: undefined };
  }

  const coverage = matchedTokens.length / queryTokens.length;
  const conceptBoost = exactConcepts.length > 0 ? 0.55 : 0;
  const phraseBoost = phraseInText ? 0.3 : 0;
  const multiTokenBoost = matchedTokens.length > 1 ? 0.1 : 0;
  const score = Math.min(1, coverage * 0.55 + conceptBoost + phraseBoost + multiTokenBoost);

  const reason =
    exactConcepts.length > 0
      ? `Direct concept match: ${exactConcepts[0]}`
      : phraseInText
        ? "Exact phrase appears in this transcript segment"
        : `Matched terms: ${matchedTokens.join(", ")}`;

  return { score, reason };
}

export class TranscriptSearchService {
  constructor(private readonly transcriptSource: TranscriptSource = getTranscriptByVideoId) {}

  search(
    videoId: string,
    query: string,
    options: TranscriptSearchOptions = {},
  ): TranscriptSearchResult {
    const topK = Math.max(1, Math.floor(options.topK ?? 3));
    const minimumScore = options.minimumScore ?? 0.25;
    const normalizedQuery = normalize(query);

    if (!normalizedQuery) {
      return { query, confidence: "low", segments: [] };
    }

    const segments = this.transcriptSource(videoId)
      .filter((segment) => segment.endSec > segment.startSec)
      .map((segment) => {
        const { score, reason } = scoreSegment(segment, normalizedQuery);
        return {
          segmentId: segment.id,
          startSec: segment.startSec,
          endSec: segment.endSec,
          text: segment.text,
          score: Number(score.toFixed(4)),
          reason,
        } satisfies RetrievedSegment;
      })
      .filter((segment) => segment.score >= minimumScore)
      .sort((left, right) => right.score - left.score || left.startSec - right.startSec)
      .slice(0, topK);

    const bestScore = segments[0]?.score ?? 0;
    const confidence = bestScore >= 0.8 ? "high" : bestScore >= 0.5 ? "medium" : "low";

    return { query, confidence, segments };
  }
}
