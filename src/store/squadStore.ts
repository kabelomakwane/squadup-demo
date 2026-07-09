import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Player, Position } from "@/lib/game-engine/types";

export const SQUAD_SLOTS: Position[] = ["GK", "DEF", "MID", "MID", "FWD"];

type SquadState = {
  squad: (Player | null)[];
  teamName: string;
  setTeamName: (name: string) => void;
  setSlot: (index: number, player: Player) => void;
  clearSlot: (index: number) => void;
  isComplete: () => boolean;
  reset: () => void;
};

export const useSquadStore = create<SquadState>()(
  persist(
    (set, get) => ({
      squad: SQUAD_SLOTS.map(() => null),
      teamName: "",
      setTeamName: (name) => set({ teamName: name }),
      setSlot: (index, player) =>
        set((state) => {
          const squad = [...state.squad];
          squad[index] = player;
          return { squad };
        }),
      clearSlot: (index) =>
        set((state) => {
          const squad = [...state.squad];
          squad[index] = null;
          return { squad };
        }),
      isComplete: () => get().squad.every((p) => p !== null),
      reset: () => set({ squad: SQUAD_SLOTS.map(() => null), teamName: "" }),
    }),
    {
      name: "squad-up-squad",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
