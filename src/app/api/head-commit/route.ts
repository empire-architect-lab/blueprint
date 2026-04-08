import { FALLBACK_COMMIT } from "@/content/fallback-commit";
import { truncate } from "@/lib/text/truncate";

export const runtime = "edge";
export const revalidate = 60;

const GITHUB_URL =
  "https://api.github.com/repos/empire-architect-lab/blueprint/commits/main";

type HeadCommitResponse = {
  sha: string;
  shortSha: string;
  message: string;
  source: "github" | "fallback";
};

function fallback(): HeadCommitResponse {
  return { ...FALLBACK_COMMIT, source: "fallback" };
}

export async function GET(): Promise<Response> {
  try {
    const res = await fetch(GITHUB_URL, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "blueprint-lab",
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      return Response.json(fallback());
    }
    const data = (await res.json()) as {
      sha: string;
      commit: { message: string };
    };
    const sha = data.sha;
    const firstLine = data.commit.message.split("\n")[0];
    const body: HeadCommitResponse = {
      sha,
      shortSha: sha.slice(0, 7),
      message: truncate(firstLine, 72),
      source: "github",
    };
    return Response.json(body);
  } catch {
    return Response.json(fallback());
  }
}
