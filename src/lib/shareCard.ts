import { superSport } from "@/lib/fonts";
import type { Player } from "@/lib/game-engine/types";
import { contributionMarks, type Contribution } from "@/lib/game-engine/contributions";

function fitText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, startSize: number, align: CanvasTextAlign = "left") {
  let size = startSize;
  ctx.textAlign = align;
  while (size > 12 && ctx.measureText(text).width > maxWidth) {
    size -= 1;
    ctx.font = ctx.font.replace(/\d+px/, `${size}px`);
  }
  ctx.fillText(text, x, y);
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, fill: string) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.fillStyle = fill;
  ctx.fill();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines = 2) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  words.forEach((word) => {
    const test = `${line}${word} `;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line.trim());
      line = `${word} `;
    } else {
      line = test;
    }
  });
  if (line && lines.length < maxLines) lines.push(line.trim());
  lines.slice(0, maxLines).forEach((item, index) => ctx.fillText(item, x, y + index * lineHeight));
}

function drawLineup(
  ctx: CanvasRenderingContext2D,
  squad: Player[],
  contributions: Map<string, Contribution>,
  x: number,
  y: number,
  width: number,
  accent: string,
) {
  const display = superSport.style.fontFamily;
  squad.forEach((player, index) => {
    const rowY = y + index * 62;
    roundedRect(ctx, x, rowY, width, 48, 24, "rgba(255,255,255,.08)");
    ctx.textAlign = "left";
    ctx.fillStyle = accent;
    ctx.font = `900 13px ${display}`;
    ctx.fillText(player.position, x + 18, rowY + 30);
    ctx.fillStyle = "#ffffff";
    ctx.font = `700 17px ${display}`;
    fitText(ctx, player.name, x + 64, rowY + 31, width - 155, 17);
    const marks = contributionMarks(contributions.get(player.name));
    ctx.textAlign = "right";
    ctx.fillStyle = "#ffffff";
    ctx.font = "16px sans-serif";
    ctx.fillText(marks, x + width - 18, rowY + 30);
  });
}

export async function buildShareCardImage({
  homeName,
  awayName,
  homeScore,
  awayScore,
  homeSquad,
  awaySquad,
  headline,
  description,
  contributions,
}: {
  homeName: string;
  awayName: string;
  homeScore: number;
  awayScore: number;
  homeSquad: Player[];
  awaySquad: Player[];
  headline: string;
  description: string;
  contributions: Map<string, Contribution>;
}): Promise<string> {
  if (typeof document !== "undefined" && document.fonts?.ready) {
    await document.fonts.ready;
  }

  const display = superSport.style.fontFamily;
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 900;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#111fa3";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const gradient = ctx.createRadialGradient(0, 900, 0, 0, 900, 850);
  gradient.addColorStop(0, "rgba(241,199,47,.22)");
  gradient.addColorStop(1, "rgba(241,199,47,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#f1c72f";
  ctx.font = `900 italic 92px ${display}`;
  ctx.textAlign = "center";
  ctx.fillText("SQUAD UP", 600, 106);

  ctx.fillStyle = "#ffffff";
  ctx.font = `700 30px ${display}`;
  wrapText(ctx, headline, 600, 150, 960, 38);

  roundedRect(ctx, 145, 205, 910, 120, 20, "#ffffff");
  ctx.fillStyle = "#db1b13";
  ctx.font = `800 16px ${display}`;
  ctx.textAlign = "left";
  ctx.fillText("HOME", 185, 244);
  ctx.fillStyle = "#111fa3";
  ctx.font = `800 25px ${display}`;
  fitText(ctx, homeName, 185, 282, 285, 25);

  ctx.fillStyle = "#b68b00";
  ctx.font = `800 16px ${display}`;
  ctx.textAlign = "right";
  ctx.fillText("AWAY", 1015, 244);
  ctx.fillStyle = "#111fa3";
  ctx.font = `800 25px ${display}`;
  fitText(ctx, awayName, 1015, 282, 285, 25, "right");

  ctx.textAlign = "center";
  ctx.fillStyle = "#111fa3";
  ctx.font = `900 64px ${display}`;
  ctx.fillText(`${homeScore} – ${awayScore}`, 600, 287);

  drawLineup(ctx, homeSquad, contributions, 145, 365, 430, "#f08a86");
  drawLineup(ctx, awaySquad, contributions, 625, 365, 430, "#f1c72f");

  ctx.fillStyle = "rgba(255,255,255,.78)";
  ctx.font = "500 18px sans-serif";
  ctx.textAlign = "center";
  wrapText(ctx, description, 600, 745, 900, 27, 3);

  ctx.fillStyle = "#f1c72f";
  ctx.font = `800 18px ${display}`;
  ctx.textAlign = "center";
  ctx.fillText("THINK YOUR FIVE CAN BEAT THIS? BUILD YOURS ON SQUAD UP.", 600, 855);

  return canvas.toDataURL("image/png");
}
