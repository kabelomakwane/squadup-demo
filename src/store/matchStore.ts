import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { MatchResult } from "@/lib/game-engine/types";

type MatchState = {
  result: MatchResult | null;
  resultId: string | null;
  setResult: (result: MatchResult, resultId: string | null) => void;
  reset: () => void;
};

export const useMatchStore = create<MatchState>()(
  persist(
    (set) => ({
      result: null,
      resultId: null,
      setResult: (result, resultId) => set({ result, resultId }),
      reset: () => set({ result: null, resultId: null }),
    }),
    {
      name: "squad-up-match",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
