import Link from "next/link";
import type { ReactElement } from "react";

export type FooterNavColumn = {
  title: string;
  links: Array<{ label: string; href: string }>;
};

export type FooterSocial = { label: string; href: string };

type Props = {
  wordmark: string;
  navColumns: FooterNavColumn[];
  email: string;
  copyright: string;
  socials: FooterSocial[];
};

export function WordmarkFooter({
  wordmark,
  navColumns,
  email,
  copyright,
  socials,
}: Props): ReactElement {
  return (
    <footer className="flex flex-col gap-16 border-t border-neutral-900 pt-20">
      <h2
        aria-label={wordmark}
        className="font-display text-[18vw] leading-[0.85] tracking-tighter text-neutral-50"
      >
        {wordmark}
      </h2>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {navColumns.map((col, i) => (
          <div key={i} className="flex flex-col gap-4">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">
              {col.title}
            </p>
            <ul className="flex flex-col gap-2">
              {col.links.map((link, j) => (
                <li key={j}>
                  <Link
                    href={link.href}
                    className="text-base text-neutral-200 underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 border-t border-neutral-900 py-8 text-sm text-neutral-400 md:flex-row md:items-center md:justify-between">
        <a href={`mailto:${email}`} className="hover:text-neutral-50">
          {email}
        </a>
        <p>{copyright}</p>
        <ul className="flex gap-4">
          {socials.map((s, i) => (
            <li key={i}>
              <Link href={s.href} className="hover:text-neutral-50">
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
