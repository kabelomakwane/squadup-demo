import localFont from "next/font/local";

export const superSport = localFont({
  src: [
    { path: "../fonts/SuperSport-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/SuperSport-Italic.ttf", weight: "400", style: "italic" },
    { path: "../fonts/SuperSport-Bold.ttf", weight: "700", style: "normal" },
    { path: "../fonts/SuperSport-BoldItalic.ttf", weight: "700", style: "italic" },
    { path: "../fonts/SuperSport-Black.ttf", weight: "900", style: "normal" },
    { path: "../fonts/SuperSport-BlackItalic.ttf", weight: "900", style: "italic" },
  ],
  variable: "--font-supersport",
  display: "swap",
});
