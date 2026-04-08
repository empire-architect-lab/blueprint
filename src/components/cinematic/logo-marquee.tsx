import Image from "next/image";
import type { ReactElement } from "react";

type Logo = { src: string; alt: string };

type Props = {
  logos: Logo[];
};

export function LogoMarquee({ logos }: Props): ReactElement {
  const doubled = [...logos, ...logos];
  return (
    <div className="marquee" dir="ltr">
      <div className="marquee-track">
        {doubled.map((logo, i) => (
          <div
            key={i}
            className="flex h-10 w-auto items-center opacity-70 transition-opacity hover:opacity-100"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={120}
              height={40}
              className="h-10 w-auto object-contain brightness-0 invert"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
