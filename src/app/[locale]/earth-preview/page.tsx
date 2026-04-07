// TEMP: removed in T016. Preview-only route for T009 visual verification.
"use client";

import EarthScene from "@/components/cursor/earth-scene-dynamic";

export default function EarthPreviewPage() {
  return (
    <main className="w-screen h-screen bg-black">
      <EarthScene />
    </main>
  );
}
