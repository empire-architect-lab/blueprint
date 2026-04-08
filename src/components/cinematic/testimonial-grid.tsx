import Image from "next/image";
import type { ReactElement } from "react";

export type TestimonialItem = {
  tag: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
};

type Props = {
  items: TestimonialItem[];
};

export function TestimonialGrid({ items }: Props): ReactElement {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {items.map((item, i) => (
        <figure
          key={i}
          className="flex flex-col justify-between gap-8 rounded-xl border border-neutral-800 bg-neutral-950 p-8"
        >
          <span className="inline-flex w-fit items-center rounded-full border border-neutral-700 px-3 py-1 font-mono text-xs uppercase tracking-wider text-neutral-400">
            {item.tag}
          </span>
          <blockquote className="font-display text-2xl leading-snug text-neutral-50">
            {"\u201C"}
            {item.quote}
            {"\u201D"}
          </blockquote>
          <figcaption className="flex items-center gap-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-neutral-800">
              <Image
                src={item.avatar}
                alt={item.name}
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-neutral-100">
                {item.name}
              </span>
              <span className="text-xs text-neutral-400">{item.role}</span>
            </div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
