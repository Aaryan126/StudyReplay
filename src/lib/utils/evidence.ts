import type { RetrievedSegment } from "@/lib/types";
import { formatTimestampRange } from "@/lib/utils/time";

export type FormattedEvidence = {
  segmentId: string;
  label: string;
  startSec: number;
  endSec: number;
  transcript: string;
  reason: string;
  score: number;
};

export function formatRetrievedSegment(segment: RetrievedSegment): FormattedEvidence {
  if (segment.endSec <= segment.startSec) {
    throw new Error("Evidence timestamp range must have a positive duration.");
  }

  return {
    segmentId: segment.segmentId,
    label: formatTimestampRange(segment.startSec, segment.endSec),
    startSec: segment.startSec,
    endSec: segment.endSec,
    transcript: segment.text,
    reason: segment.reason ?? "Relevant transcript evidence",
    score: segment.score,
  };
}
