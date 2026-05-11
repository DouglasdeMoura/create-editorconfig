import fs from "node:fs";
import path from "node:path";

const SIGNATURES = [
  {
    name: "go",
    markers: ["go.mod", "go.sum"],
    extensions: [".go"],
  },
  {
    name: "python",
    markers: ["pyproject.toml", "requirements.txt", "setup.py", "setup.cfg", "Pipfile"],
    extensions: [".py"],
  },
  {
    name: "web",
    markers: ["package.json", "tsconfig.json", "deno.json"],
    extensions: [".ts", ".tsx", ".jsx", ".html", ".css", ".scss"],
  },
];

export function detectPreset(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return "default";
  }

  const fileNames = new Set();
  const extensions = new Set();
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    fileNames.add(entry.name);
    extensions.add(path.extname(entry.name));
  }

  for (const sig of SIGNATURES) {
    if (sig.markers.some((m) => fileNames.has(m))) return sig.name;
    if (sig.extensions.some((e) => extensions.has(e))) return sig.name;
  }

  return "default";
}
