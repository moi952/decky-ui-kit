// Copies a freshly built demo (demo-dist/) into <worktree>/<segment>/ inside
// the gh-pages worktree, then regenerates the site-wide versions.json and,
// for a real release, the root redirect to the new latest version. Preview
// deploys (segment "preview") never touch "latest" or the root page.
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "fs";
import path from "path";

const worktree = process.argv[2];
const segment = process.env.DEMO_VERSION_SEGMENT;
const isRelease = process.env.IS_RELEASE === "true";

if (!worktree || !segment) {
  console.error("Usage: DEMO_VERSION_SEGMENT=<segment> IS_RELEASE=<true|false> node publish-docs.mjs <gh-pages-worktree-path>");
  process.exit(1);
}

const target = path.join(worktree, segment);
rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });
cpSync("demo-dist", target, { recursive: true });

const VERSION_RE = /^\d+\.\d+\.\d+$/;
const compareSemver = (a, b) => {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) if (pa[i] !== pb[i]) return pb[i] - pa[i];
  return 0;
};

const entries = readdirSync(worktree, { withFileTypes: true });
const versions = entries.filter((e) => e.isDirectory() && VERSION_RE.test(e.name)).map((e) => e.name).sort(compareSemver);
const preview = entries.some((e) => e.isDirectory() && e.name === "preview");
const latest = versions[0] ?? null;

writeFileSync(path.join(worktree, "versions.json"), JSON.stringify({ latest, versions, preview }, null, 2) + "\n");
writeFileSync(path.join(worktree, ".nojekyll"), "");

if (isRelease && latest) {
  writeFileSync(
    path.join(worktree, "index.html"),
    `<!doctype html>\n<meta charset="utf-8">\n<meta http-equiv="refresh" content="0; url=/decky-ui-kit/${latest}/">\n<script>location.replace("/decky-ui-kit/${latest}/");</script>\n<p>Redirecting to <a href="/decky-ui-kit/${latest}/">the latest docs</a>...</p>\n`,
  );
}

console.log(`Published "${segment}" — latest=${latest} versions=${JSON.stringify(versions)} preview=${preview}`);
