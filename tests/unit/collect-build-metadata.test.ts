import { describe, it, expect } from "vitest";
import path from "node:path";
import {
  collect,
  type CollectDeps,
} from "../../scripts/collect-build-metadata";

const cwd = "/fake/repo";
const specsDir = path.join(cwd, "specs");

function makeDeps(overrides: Partial<CollectDeps>): CollectDeps {
  return {
    runner: () => "",
    listDir: () => [],
    listDirEntries: () => [],
    readFile: () => "",
    ...overrides,
  };
}

describe("collect-build-metadata", () => {
  it("counts spec dirs matching NNN- prefix and tick/unticked task lines across specs", () => {
    const tasksPath1 = path.join(specsDir, "001-the-cursor", "tasks.md");
    const tasksPath2 = path.join(specsDir, "002-foo", "tasks.md");

    const deps = makeDeps({
      runner: (cmd) => {
        if (cmd === "git rev-parse HEAD") {
          return "abcdef1234567890abcdef1234567890abcdef12";
        }
        if (cmd === 'git log -1 --pretty=format:"%h|%s"') {
          return '"abcdef1|feat(cursor): add metadata collector"';
        }
        throw new Error(`unexpected cmd: ${cmd}`);
      },
      listDir: (dir) => {
        if (dir === specsDir) {
          return ["001-the-cursor", "002-foo", "003-bar", "drafts", "README"];
        }
        return [];
      },
      listDirEntries: (dir) => {
        if (dir === specsDir) {
          return [
            { name: "001-the-cursor", isDir: true },
            { name: "002-foo", isDir: true },
            { name: "drafts", isDir: true },
          ];
        }
        if (dir === path.join(specsDir, "001-the-cursor")) {
          return [{ name: "tasks.md", isDir: false }];
        }
        if (dir === path.join(specsDir, "002-foo")) {
          return [{ name: "tasks.md", isDir: false }];
        }
        if (dir === path.join(specsDir, "drafts")) {
          return [];
        }
        return [];
      },
      readFile: (file) => {
        if (file === tasksPath1) {
          return [
            "# Tasks",
            "- [ ] first",
            "- [x] second",
            "random line",
            "- [x] third",
          ].join("\n");
        }
        if (file === tasksPath2) {
          return ["- [ ] alpha", "- [ ] beta"].join("\n");
        }
        return "";
      },
    });

    const { metadata, fallback } = collect(cwd, deps);

    expect(metadata.sha).toBe("abcdef1234567890abcdef1234567890abcdef12");
    expect(metadata.shortSha).toBe("abcdef1");
    // 3 dirs match NNN- prefix (001, 002, 003) — 003 has no tasks.md
    expect(metadata.specCount).toBe(3);
    // 3 from tasks1 + 2 from tasks2 = 5
    expect(metadata.taskCount).toBe(5);
    expect(metadata.lieCount).toBe(0);

    expect(fallback.shortSha).toBe("abcdef1");
    expect(fallback.message).toBe("feat(cursor): add metadata collector");
  });

  it("preserves pipe characters in commit messages and returns zeros when specs is empty", () => {
    const deps = makeDeps({
      runner: (cmd) => {
        if (cmd === "git rev-parse HEAD") return "1234567abcdef";
        if (cmd === 'git log -1 --pretty=format:"%h|%s"') {
          return '"1234567|fix: thing | with pipe"';
        }
        throw new Error(`unexpected cmd: ${cmd}`);
      },
      listDir: () => [],
      listDirEntries: () => [],
      readFile: () => "",
    });

    const { metadata, fallback } = collect(cwd, deps);
    expect(metadata.specCount).toBe(0);
    expect(metadata.taskCount).toBe(0);
    expect(fallback.message).toBe("fix: thing | with pipe");
  });
});
