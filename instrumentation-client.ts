import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  debug: false,
});

if (
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).has("sentrytest")
) {
  setTimeout(() => {
    throw new Error("sentry-smoke-test-056");
  }, 500);
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
