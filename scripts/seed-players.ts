import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import path from "node:path";

type SeedPlayer = {
  name: string;
  position: "GK" | "DEF" | "MID" | "FWD";
  overall: number;
  pace: number;
  shooting: number;
  passing: number;
  defending: number;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Copy .env.local.example to .env.local and fill in your Supabase project credentials.",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function main() {
  const seedPath = path.resolve(__dirname, "../data/players.seed.json");
  const players: SeedPlayer[] = JSON.parse(readFileSync(seedPath, "utf-8"));

  console.log(`Seeding ${players.length} players...`);

  const { error } = await supabase.from("players").upsert(
    players.map((p) => ({
      name: p.name,
      position: p.position,
      overall: p.overall,
      pace: p.pace,
      shooting: p.shooting,
      passing: p.passing,
      defending: p.defending,
    })),
    { onConflict: "name" },
  );

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }

  console.log("Done.");
}

main();
