"use client";

import { Component, type ReactNode } from "react";
import * as Sentry from "@sentry/nextjs";
import { Hero } from "@/components/hero/hero";
import { track } from "@/lib/analytics/plausible";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class CinematicErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    Sentry.captureException(error, {
      tags: { component: "cinematic-intro" },
    });
    track("cinematic_crashed");
  }

  render() {
    if (this.state.hasError) {
      return <Hero />;
    }
    return this.props.children;
  }
}
