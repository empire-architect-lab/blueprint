import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";

type Props = {
  image: string;
  imageAlt: string;
  label: string;
  title: string;
  body: string;
  href: string;
  ctaLabel: string;
};

export function EditorialCard({
  image,
  imageAlt,
  label,
  title,
  body,
  href,
  ctaLabel,
}: Props): ReactElement {
  return (
    <article className="flex flex-col gap-6">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-neutral-900">
        <Image
          src={image}
          alt={imageAlt}
          width={1600}
          height={1200}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="h-full w-full object-cover"
        />
      </div>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">
        {label}
      </p>
      <h2 className="font-display text-4xl leading-tight md:text-5xl">
        {title}
      </h2>
      <p className="max-w-prose text-base leading-relaxed text-neutral-300">
        {body}
      </p>
      <Link
        href={href}
        className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-50 underline-offset-4 hover:underline"
      >
        {ctaLabel}
        <span
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-1"
        >
          {"\u2192"}
        </span>
      </Link>
    </article>
  );
}
