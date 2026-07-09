"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { PillButton } from "@/components/ui/PillButton";
import { useToast } from "@/providers/ToastProvider";
import { buildShareCardImage } from "@/lib/shareCard";
import type { Player } from "@/lib/game-engine/types";
import type { Contribution } from "@/lib/game-engine/contributions";

type ShareData = {
  homeName: string;
  awayName: string;
  homeScore: number;
  awayScore: number;
  homeSquad: Player[];
  awaySquad: Player[];
  headline: string;
  description: string;
  contributions: Map<string, Contribution>;
};

function caption(data: ShareData): string {
  return `${data.homeName} ${data.homeScore}–${data.awayScore} ${data.awayName}\n\n${data.headline}\n\nThink your five can beat this? Build your squad, run the match and share the result on Squad Up. #SquadUp #FiveASide`;
}

export function ShareModal({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: ShareData;
}) {
  const showToast = useToast();
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    buildShareCardImage(data).then((result) => {
      if (!cancelled) setImage(result);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function nativeShare() {
    if (!image) return;
    try {
      const blob = await (await fetch(image)).blob();
      const file = new File([blob], "squad-up-result.png", { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: "Squad Up result", text: caption(data), files: [file] });
        return;
      }
    } catch {
      // fall through to download
    }
    downloadImage();
    showToast("Sharing isn't supported here, so the image was downloaded.");
  }

  function downloadImage() {
    if (!image) return;
    const link = document.createElement("a");
    link.href = image;
    link.download = "squad-up-result.png";
    link.click();
  }

  async function copyCaption() {
    try {
      await navigator.clipboard.writeText(caption(data));
      showToast("Result caption copied.");
    } catch {
      showToast("Couldn't copy — select and copy the caption manually.");
    }
  }

  return (
    <Modal open={open} onClose={onClose} className="text-center text-white">
      <h2 className="font-display text-title font-black italic uppercase text-brand-yellow">
        Share the result
      </h2>
      <div className="mt-4 aspect-[4/3] w-full overflow-hidden rounded-lg bg-black/20">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={`Share card showing ${data.homeName} ${data.homeScore}, ${data.awayName} ${data.awayScore}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-white/60">
            Building your share card...
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <PillButton onClick={nativeShare} disabled={!image}>
          Share Result
        </PillButton>
        <PillButton variant="outline" onClick={downloadImage} disabled={!image}>
          Download
        </PillButton>
        <PillButton variant="outline" onClick={copyCaption}>
          Copy Caption
        </PillButton>
      </div>
      <p className="mt-4 text-xs text-white/60">
        &ldquo;Share Result&rdquo; sends the match card and a ready-made challenge caption through
        your standard share sheet.
      </p>
    </Modal>
  );
}
