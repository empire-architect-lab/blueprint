import type { CSSProperties, ReactElement } from "react";

type Props = {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  stagger?: number;
};

export function SplitHeading({
  text,
  as = "h2",
  className = "",
  stagger = 30,
}: Props): ReactElement {
  const Tag = as;
  const chars = Array.from(text);
  return (
    <Tag
      aria-label={text}
      className={`split-heading ${className}`}
      style={{ "--split-stagger": `${stagger}ms` } as CSSProperties}
    >
      {chars.map((ch, i) => (
        <span
          key={`${i}-${ch}`}
          aria-hidden="true"
          style={{ "--i": i } as CSSProperties}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </Tag>
  );
}
