import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import "../globals.css";
import { LenisProvider } from "@/lib/animations/lenis-provider";
import { routing } from "@/i18n/routing";
import { fontDisplay, fontMono, fontBody } from "@/styles/fonts";

const PLAUSIBLE_DOMAIN =
  process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ??
  "blueprint.empire-architect-lab.dev";

export const metadata: Metadata = {
  title: "Blueprint",
  description:
    "The Blueprint — practice dashboard for Spec-Driven Development.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${fontDisplay.variable} ${fontMono.variable} ${fontBody.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script
          defer
          data-domain={PLAUSIBLE_DOMAIN}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
        <NextIntlClientProvider>
          <LenisProvider>{children}</LenisProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
