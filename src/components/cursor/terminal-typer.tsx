"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

type TerminalTyperProps = {
  command: string;
  charDelayMs: number;
  onComplete: () => void;
};

export function TerminalTyper({
  command,
  charDelayMs,
  onComplete,
}: TerminalTyperProps) {
  const reduced = useReducedMotion();
  const [typed, setTyped] = useState<string>(reduced ? command : "");
  const chars = [...command];

  useEffect(() => {
    if (reduced) {
      setTyped(command);
      onComplete();
      return;
    }

    setTyped("");
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(chars.slice(0, i).join(""));
      if (i >= chars.length) {
        clearInterval(id);
        onComplete();
      }
    }, charDelayMs);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [command, charDelayMs, reduced]);

  return (
    <pre className="font-mono">
      {typed}
      <span aria-hidden="true" className="animate-pulse">
        ▋
      </span>
    </pre>
  );
}
