import { redirect } from "next/navigation";

// next-intl middleware normally redirects "/" to the default locale before
// this file is reached. This stays as a no-op fallback in case the middleware
// matcher ever changes.
export default function RootPage() {
  redirect("/en");
}
