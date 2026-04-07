import localFont from "next/font/local";

export const fontDisplay = localFont({
  src: "../../public/fonts/CabinetGrotesk-Variable.woff2",
  variable: "--font-display",
  display: "swap",
  weight: "100 900",
});

export const fontMono = localFont({
  src: "../../public/fonts/JetBrainsMono-Regular.woff2",
  variable: "--font-mono",
  display: "swap",
  weight: "400",
});

export const fontBody = localFont({
  src: "../../public/fonts/Switzer-Variable.woff2",
  variable: "--font-body",
  display: "swap",
  weight: "100 900",
});
