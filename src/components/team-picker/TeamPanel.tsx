import { PillButton } from "@/components/ui/PillButton";
import { PositionInput } from "@/components/ui/PositionInput";
import { SQUAD_SLOTS, type Side } from "@/store/squadStore";
import type { Player } from "@/lib/game-engine/types";

export function TeamPanel({
  side,
  name,
  squad,
  candidatesFor,
  onNameChange,
  onSelect,
  onClear,
  onRandomise,
  onClearTeam,
}: {
  side: Side;
  name: string;
  squad: (Player | null)[];
  candidatesFor: (index: number, position: Player["position"]) => Player[];
  onNameChange: (value: string) => void;
  onSelect: (index: number, player: Player, custom: boolean) => void;
  onClear: (index: number) => void;
  onRandomise: () => void;
  onClearTeam: () => void;
}) {
  const accent = side === "home" ? "border-brand-yellow" : "border-brand-red";

  return (
    <div>
      <input
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Enter Team Name"
        maxLength={28}
        className={`mb-4 w-full rounded-full border-2 ${accent} bg-transparent px-5 py-3 text-center font-display text-button font-black italic uppercase text-white placeholder:text-white/60 focus:outline-none`}
      />
      <p className="mb-2 text-center text-badge font-bold uppercase text-white">Select Your Team</p>
      <div className="space-y-3">
        {SQUAD_SLOTS.map((position, i) => (
          <PositionInput
            key={i}
            id={`slot-${side}-${i}`}
            position={position}
            player={squad[i]}
            onSelect={(player, custom) => onSelect(i, player, custom)}
            onClear={() => onClear(i)}
            candidates={candidatesFor(i, position)}
          />
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-3">
        <div className="w-32">
          <PillButton variant="outline" onClick={onRandomise} className="!py-2 !text-xs">
            Randomise
          </PillButton>
        </div>
        <div className="w-32">
          <PillButton variant="outline" onClick={onClearTeam} className="!py-2 !text-xs">
            Clear
          </PillButton>
        </div>
      </div>
    </div>
  );
}
