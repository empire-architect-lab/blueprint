import Link from "next/link";
import type { ReactElement } from "react";

type Props = {
  intro: string;
  lines: string[];
  ctaHref: string;
  ctaLabel: string;
};

export function ManifestoBlock({
  intro,
  lines,
  ctaHref,
  ctaLabel,
}: Props): ReactElement {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-10 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400">
        {intro}
      </p>
      <ul className="flex flex-col gap-3">
        {lines.map((line, i) => (
          <li
            key={i}
            className="font-display text-3xl leading-[1.1] md:text-5xl"
          >
            {line}
          </li>
        ))}
      </ul>
      <Link
        href={ctaHref}
        className="inline-flex items-center gap-2 text-sm font-medium text-neutral-50 underline-offset-4 hover:underline"
      >
        {ctaLabel}
        <span aria-hidden="true">{"\u2192"}</span>
      </Link>
    </div>
  );
}
