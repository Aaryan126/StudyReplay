export function formatTimestamp(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${remainder
    .toString()
    .padStart(2, "0")}`;
}

export function formatTimestampRange(startSec: number, endSec: number): string {
  return `${formatTimestamp(startSec)}–${formatTimestamp(endSec)}`;
}
