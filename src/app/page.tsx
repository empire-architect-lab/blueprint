import type { Metadata } from "next";
import { CinematicRouter } from "@/components/cursor/cinematic-router";

export const metadata: Metadata = {
  title: "Blueprint Lab",
  description:
    "The practice dashboard built by the spec-driven process it teaches.",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <CinematicRouter />
    </main>
  );
}
