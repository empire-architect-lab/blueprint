"use client";

import dynamic from "next/dynamic";

const EarthScene = dynamic(
  () => import("./earth-scene").then((m) => m.EarthScene),
  { ssr: false, loading: () => null },
);

export default EarthScene;
