import Link from "next/link";
import type { ReactElement } from "react";
import { SplitHeading } from "./split-heading";

type Props = {
  headline: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
};

export function ClosingCTA({
  headline,
  body,
  ctaLabel,
  ctaHref,
}: Props): ReactElement {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
      <SplitHeading
        as="h2"
        text={headline}
        className="font-display text-5xl leading-tight md:text-7xl"
      />
      <p className="max-w-prose text-base leading-relaxed text-neutral-300">
        {body}
      </p>
      <Link
        href={ctaHref}
        className="inline-flex items-center gap-2 rounded-full border border-neutral-700 px-6 py-3 text-sm font-medium text-neutral-50 transition-colors hover:bg-neutral-50 hover:text-neutral-950"
      >
        {ctaLabel}
        <span aria-hidden="true">{"\u2192"}</span>
      </Link>
    </div>
  );
}
