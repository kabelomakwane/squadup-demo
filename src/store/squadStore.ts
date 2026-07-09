import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Player, Position } from "@/lib/game-engine/types";

export const SQUAD_SLOTS: Position[] = ["GK", "DEF", "MID", "MID", "FWD"];

export type GameMode = "vs-ai" | "head-to-head";
export type Side = "home" | "away";

type TeamState = {
  name: string;
  squad: (Player | null)[];
};

const emptyTeam = (): TeamState => ({ name: "", squad: SQUAD_SLOTS.map(() => null) });

const RANDOM_TEAM_FIRST = ["Banger", "Ballerz", "Touchline", "Top Bin", "Five Star", "Nutmeg", "Sunday"];
const RANDOM_TEAM_SECOND = ["United", "FC", "Athletic", "Rovers", "City", "Collective"];

type SquadState = {
  mode: GameMode;
  home: TeamState;
  away: TeamState;
  setMode: (mode: GameMode) => void;
  setTeamName: (side: Side, name: string) => void;
  setSlot: (side: Side, index: number, player: Player) => void;
  clearSlot: (side: Side, index: number) => void;
  clearTeam: (side: Side) => void;
  randomiseTeam: (side: Side, pool: Player[]) => void;
  isTeamComplete: (side: Side) => boolean;
  isReadyToPlay: () => boolean;
  reset: () => void;
};

export const useSquadStore = create<SquadState>()(
  persist(
    (set, get) => ({
      mode: "vs-ai",
      home: emptyTeam(),
      away: emptyTeam(),

      setMode: (mode) => set({ mode }),

      setTeamName: (side, name) => set((state) => ({ [side]: { ...state[side], name } })),

      setSlot: (side, index, player) =>
        set((state) => {
          const squad = [...state[side].squad];
          squad[index] = player;
          return { [side]: { ...state[side], squad } };
        }),

      clearSlot: (side, index) =>
        set((state) => {
          const squad = [...state[side].squad];
          squad[index] = null;
          return { [side]: { ...state[side], squad } };
        }),

      clearTeam: (side) => set({ [side]: emptyTeam() }),

      randomiseTeam: (side, pool) =>
        set((state) => {
          const used = new Set<string>();
          const squad = SQUAD_SLOTS.map((position) => {
            const candidates = pool.filter((p) => p.position === position && !used.has(p.id));
            const pick = candidates[Math.floor(Math.random() * candidates.length)];
            if (pick) used.add(pick.id);
            return pick ?? null;
          });
          const name =
            state[side].name.trim() ||
            `${RANDOM_TEAM_FIRST[Math.floor(Math.random() * RANDOM_TEAM_FIRST.length)]} ${
              RANDOM_TEAM_SECOND[Math.floor(Math.random() * RANDOM_TEAM_SECOND.length)]
            }`;
          return { [side]: { name, squad } };
        }),

      isTeamComplete: (side) => get()[side].squad.every((p) => p !== null),

      isReadyToPlay: () => {
        const state = get();
        if (state.mode === "vs-ai") return state.home.squad.every((p) => p !== null);
        return (
          state.home.squad.every((p) => p !== null) &&
          state.away.squad.every((p) => p !== null) &&
          state.home.name.trim().length > 0 &&
          state.away.name.trim().length > 0
        );
      },

      reset: () => set({ mode: "vs-ai", home: emptyTeam(), away: emptyTeam() }),
    }),
    {
      name: "squad-up-squad",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
