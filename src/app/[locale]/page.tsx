import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Hero } from "@/components/hero/hero";
import { SplitHeading } from "@/components/cinematic/split-heading";
import { ScrollReveal } from "@/components/cinematic/scroll-reveal";
import { EditorialCard } from "@/components/cinematic/editorial-card";
import { ManifestoBlock } from "@/components/cinematic/manifesto-block";
import {
  TestimonialGrid,
  type TestimonialItem,
} from "@/components/cinematic/testimonial-grid";
import { StatCounter } from "@/components/cinematic/stat-counter";
import { LogoMarquee } from "@/components/cinematic/logo-marquee";
import { ClosingCTA } from "@/components/cinematic/closing-cta";
import { WordmarkFooter } from "@/components/cinematic/wordmark-footer";

export const metadata: Metadata = {
  title: "Blueprint Lab",
  description:
    "The practice dashboard built by the spec-driven process it teaches.",
};

const SECTION = "max-w-[1400px] mx-auto px-6 md:px-12";

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing" });

  const testimonials: TestimonialItem[] = [
    {
      tag: t("testimonials.item1.tag"),
      quote: t("testimonials.item1.quote"),
      name: t("testimonials.item1.name"),
      role: t("testimonials.item1.role"),
      avatar: "/images/avatars/01.jpg",
    },
    {
      tag: t("testimonials.item2.tag"),
      quote: t("testimonials.item2.quote"),
      name: t("testimonials.item2.name"),
      role: t("testimonials.item2.role"),
      avatar: "/images/avatars/02.jpg",
    },
    {
      tag: t("testimonials.item3.tag"),
      quote: t("testimonials.item3.quote"),
      name: t("testimonials.item3.name"),
      role: t("testimonials.item3.role"),
      avatar: "/images/avatars/03.jpg",
    },
    {
      tag: t("testimonials.item4.tag"),
      quote: t("testimonials.item4.quote"),
      name: t("testimonials.item4.name"),
      role: t("testimonials.item4.role"),
      avatar: "/images/avatars/04.jpg",
    },
  ];

  const logos = [
    { src: "/logos/nextdotjs.svg", alt: "Next.js" },
    { src: "/logos/supabase.svg", alt: "Supabase" },
    { src: "/logos/vercel.svg", alt: "Vercel" },
    { src: "/logos/tailwindcss.svg", alt: "Tailwind CSS" },
    { src: "/logos/sentry.svg", alt: "Sentry" },
    { src: "/logos/playwright.svg", alt: "Playwright" },
    { src: "/logos/vitest.svg", alt: "Vitest" },
    { src: "/logos/github.svg", alt: "GitHub" },
    { src: "/logos/typescript.svg", alt: "TypeScript" },
    { src: "/logos/framer.svg", alt: "Framer" },
  ];

  const manifestoLines = [
    t("manifesto.line1"),
    t("manifesto.line2"),
    t("manifesto.line3"),
    t("manifesto.line4"),
    t("manifesto.line5"),
  ];

  return (
    <main className="bg-black font-sans text-neutral-50">
      <Hero
        backgroundVideoSrc="/video/hero.mp4"
        splitHeadline
        customControls
        ctaPrimary={{ label: t("hero.ctaPrimary"), href: "#manifesto" }}
        ctaSecondary={{ label: t("hero.ctaSecondary"), href: "#mission" }}
      />

      <section id="mission" className={`${SECTION} py-32 md:py-40`}>
        <ScrollReveal className="flex flex-col gap-8">
          <SplitHeading
            as="h2"
            text={t("mission.headline")}
            className="font-display max-w-4xl text-4xl leading-tight md:text-6xl"
          />
          <p className="max-w-2xl text-lg leading-relaxed text-neutral-300">
            {t("mission.body")}
          </p>
        </ScrollReveal>
      </section>

      <section className={`${SECTION} py-32 md:py-40`}>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          <ScrollReveal>
            <EditorialCard
              image="/images/editorial/builder.jpg"
              imageAlt={t("editorial.builder.title")}
              label={t("editorial.builder.label")}
              title={t("editorial.builder.title")}
              body={t("editorial.builder.body")}
              href="#manifesto"
              ctaLabel={t("editorial.builder.cta")}
            />
          </ScrollReveal>
          <ScrollReveal>
            <EditorialCard
              image="/images/editorial/process.jpg"
              imageAlt={t("editorial.process.title")}
              label={t("editorial.process.label")}
              title={t("editorial.process.title")}
              body={t("editorial.process.body")}
              href="#manifesto"
              ctaLabel={t("editorial.process.cta")}
            />
          </ScrollReveal>
        </div>
      </section>

      <section id="manifesto" className={`${SECTION} py-32 md:py-40`}>
        <ScrollReveal>
          <ManifestoBlock
            intro={t("manifesto.intro")}
            lines={manifestoLines}
            ctaHref="#"
            ctaLabel={t("manifesto.cta")}
          />
        </ScrollReveal>
      </section>

      <section className={`${SECTION} py-32 md:py-40`}>
        <ScrollReveal className="flex flex-col gap-12">
          <SplitHeading
            as="h2"
            text={t("value.headline")}
            className="font-display max-w-4xl text-4xl leading-tight md:text-6xl"
          />
          <p className="max-w-2xl text-lg leading-relaxed text-neutral-300">
            {t("value.body")}
          </p>
          <TestimonialGrid items={testimonials} />
        </ScrollReveal>
      </section>

      <section className={`${SECTION} py-32 md:py-40`}>
        <ScrollReveal className="flex flex-col gap-16">
          <div className="flex flex-col gap-6">
            <SplitHeading
              as="h2"
              text={t("stats.headline")}
              className="font-display max-w-4xl text-4xl leading-tight md:text-6xl"
            />
            <p className="max-w-2xl text-base leading-relaxed text-neutral-400">
              {t("stats.body")}
            </p>
          </div>
          {/* PRACTICE — hardcoded values */}
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
            <StatCounter to={57} label={t("stats.specs")} />
            <StatCounter to={128} label={t("stats.tasks")} />
            <StatCounter to={342} label={t("stats.ci")} />
            <StatCounter to={9} label={t("stats.scripts")} />
          </div>
          <LogoMarquee logos={logos} />
        </ScrollReveal>
      </section>

      <section className={`${SECTION} py-32 md:py-40`}>
        <ScrollReveal>
          <ClosingCTA
            headline={t("closing.headline")}
            body={t("closing.body")}
            ctaLabel={t("closing.cta")}
            ctaHref="#"
          />
        </ScrollReveal>
      </section>

      <section className={`${SECTION} pb-12`}>
        <WordmarkFooter
          wordmark="Blueprint"
          navColumns={[
            {
              title: t("footer.navTitle"),
              links: [
                { label: t("footer.home"), href: "/" },
                { label: t("footer.roadmap"), href: "#" },
                { label: t("footer.specs"), href: "#" },
                { label: t("footer.manifesto"), href: "#manifesto" },
              ],
            },
            {
              title: t("footer.companyTitle"),
              links: [
                { label: t("footer.constitution"), href: "#" },
                { label: t("footer.careers"), href: "#" },
                { label: t("footer.privacy"), href: "#" },
              ],
            },
          ]}
          email={t("footer.email")}
          copyright={t("footer.copy")}
          socials={[
            { label: "GitHub", href: "#" },
            { label: "X", href: "#" },
          ]}
        />
      </section>
    </main>
  );
}
