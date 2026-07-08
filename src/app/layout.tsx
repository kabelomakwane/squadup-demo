import type { Metadata } from "next";
import { superSport } from "@/lib/fonts";
import { AuthProvider } from "@/providers/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Squad Up | SuperSportBET",
  description: "Pick your fantasy 5-a-side squad and play a simulated match.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${superSport.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-brand-blue text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
