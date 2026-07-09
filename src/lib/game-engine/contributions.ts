import type { MatchEvent } from "./types";

export type Contribution = { goals: number; assists: number; saves: number };

export function computeContributions(events: MatchEvent[]): Map<string, Contribution> {
  const byName = new Map<string, Contribution>();

  const bump = (name: string | null, key: keyof Contribution) => {
    if (!name) return;
    const current = byName.get(name) ?? { goals: 0, assists: 0, saves: 0 };
    current[key] += 1;
    byName.set(name, current);
  };

  for (const event of events) {
    if (event.type === "goal") {
      bump(event.actingPlayer, "goals");
      bump(event.secondaryPlayer, "assists");
    }
    if (event.type === "save") {
      bump(event.secondaryPlayer, "saves");
    }
  }

  return byName;
}

export function contributionMarks(contribution: Contribution | undefined): string {
  if (!contribution) return "";
  const { goals, assists, saves } = contribution;
  return `${"⚽".repeat(goals)}${"🎯".repeat(assists)}${saves ? ` 🧤${saves > 1 ? saves : ""}` : ""}`;
}
