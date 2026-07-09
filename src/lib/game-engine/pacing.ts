import type { MatchEvent } from "./types";

export type PacedEvent = MatchEvent & { atMs: number; displayMs: number };

const READING_WORDS_PER_MINUTE = 150;
const READING_MIN_MS = 2200;
const READING_MAX_MS = 6500;
const READING_BUFFER_MS = 600;

export const MATCH_REAL_MS = 60_000;
export const FIRST_HALF_END_MS = 27_000;
export const HALFTIME_END_MS = 30_000;
export const SECOND_HALF_END_MS = 57_000;
export const FULL_TIME_MS = 60_000;

function readingTimeMs(text: string): number {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const raw = (wordCount / READING_WORDS_PER_MINUTE) * 60_000;
  return Math.max(READING_MIN_MS, Math.min(READING_MAX_MS, raw + READING_BUFFER_MS));
}

function scheduleWindow(items: MatchEvent[], startMs: number, endMs: number): PacedEvent[] {
  if (items.length === 0) return [];
  const readingTimes = items.map((event) => readingTimeMs(event.text));
  const total = readingTimes.reduce((sum, time) => sum + time, 0);
  const scale = total > 0 ? (endMs - startMs) / total : 0;
  let cursor = startMs;
  return items.map((event, i) => {
    const displayMs = Math.round(readingTimes[i] * scale);
    const paced: PacedEvent = { ...event, atMs: Math.round(cursor), displayMs };
    cursor += displayMs;
    return paced;
  });
}

export function scheduleEvents(events: MatchEvent[]): PacedEvent[] {
  const firstHalf = events.filter((event) => event.half === 1 && event.type !== "half-time");
  const halfTime = events.find((event) => event.type === "half-time");
  const secondHalf = events.filter((event) => event.half === 2);

  const pacedFirst = scheduleWindow(firstHalf, 0, FIRST_HALF_END_MS);
  const pacedHalfTime: PacedEvent[] = halfTime
    ? [{ ...halfTime, atMs: FIRST_HALF_END_MS, displayMs: HALFTIME_END_MS - FIRST_HALF_END_MS }]
    : [];
  const pacedSecond = scheduleWindow(secondHalf, HALFTIME_END_MS, SECOND_HALF_END_MS);

  return [...pacedFirst, ...pacedHalfTime, ...pacedSecond].sort((a, b) => a.atMs - b.atMs);
}

export function matchClockLabel(elapsedMs: number): string {
  if (elapsedMs >= HALFTIME_END_MS - 1500 && elapsedMs < HALFTIME_END_MS) {
    return "Half Time";
  }
  const inSecondHalf = elapsedMs >= HALFTIME_END_MS;
  const halfStart = inSecondHalf ? HALFTIME_END_MS : 0;
  const halfEnd = inSecondHalf ? SECOND_HALF_END_MS : FIRST_HALF_END_MS;
  const regulationWindow = halfEnd - halfStart;
  const halfElapsed = Math.min(regulationWindow + 3000, Math.max(0, elapsedMs - halfStart));
  const baseMinute = inSecondHalf ? 15 : 0;

  if (halfElapsed <= regulationWindow) {
    const matchSeconds = Math.floor((halfElapsed / regulationWindow) * 15 * 60);
    const minutes = baseMinute + Math.floor(matchSeconds / 60);
    const seconds = matchSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  const stoppageWindow = FULL_TIME_MS - SECOND_HALF_END_MS;
  const addedMs = Math.min(stoppageWindow, halfElapsed - regulationWindow);
  const addedSeconds = Math.floor((addedMs / stoppageWindow) * 60);
  const regulationMinute = baseMinute + 15;
  return `${regulationMinute}:00 +0:${String(addedSeconds).padStart(2, "0")}`;
}
