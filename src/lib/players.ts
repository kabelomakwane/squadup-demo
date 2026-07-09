import { createClient } from "@/lib/supabase/client";
import type { Player } from "@/lib/game-engine/types";
import seedPlayers from "../../data/players.seed.json";

let cachedPool: Player[] | null = null;

function fromSeed(): Player[] {
  return (seedPlayers as Omit<Player, "id">[]).map((p) => ({ id: p.name, ...p }));
}

export async function getPlayerPool(): Promise<Player[]> {
  if (cachedPool) return cachedPool;

  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("players").select("*");
    if (error || !data || data.length === 0) throw error ?? new Error("empty players table");
    cachedPool = data as Player[];
  } catch {
    cachedPool = fromSeed();
  }

  return cachedPool;
}
