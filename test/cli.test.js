import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLI = path.resolve(__dirname, "..", "src", "index.js");

const EXPECTED_DEFAULT = `# editorconfig.org
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
trim_trailing_whitespace = true
`;

function runIn(cwd, args) {
  return spawnSync(process.execPath, [CLI, ...args], { cwd, encoding: "utf-8" });
}

test("CLI -y writes default .editorconfig", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "cec-cli-"));
  try {
    const result = runIn(dir, ["-y"]);
    assert.equal(result.status, 0, result.stderr);
    const written = readFileSync(path.join(dir, ".editorconfig"), "utf-8");
    assert.equal(written, EXPECTED_DEFAULT);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("CLI --yes long flag also writes default .editorconfig", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "cec-cli-"));
  try {
    const result = runIn(dir, ["--yes"]);
    assert.equal(result.status, 0, result.stderr);
    const written = readFileSync(path.join(dir, ".editorconfig"), "utf-8");
    assert.equal(written, EXPECTED_DEFAULT);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("CLI -y refuses to overwrite existing .editorconfig", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "cec-cli-"));
  try {
    const target = path.join(dir, ".editorconfig");
    writeFileSync(target, "existing\n");
    const result = runIn(dir, ["-y"]);
    assert.match(result.stderr, /already exists/);
    assert.notEqual(result.status, 0);
    assert.equal(readFileSync(target, "utf-8"), "existing\n");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("CLI -y --force overwrites existing .editorconfig", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "cec-cli-"));
  try {
    const target = path.join(dir, ".editorconfig");
    writeFileSync(target, "existing\n");
    const result = runIn(dir, ["-y", "--force"]);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(readFileSync(target, "utf-8"), EXPECTED_DEFAULT);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("CLI -y --stdout writes to stdout and does not touch disk", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "cec-cli-"));
  try {
    const result = runIn(dir, ["-y", "--stdout"]);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout, EXPECTED_DEFAULT);
    assert.equal(
      readFileSync(path.join(dir, ".editorconfig"), "utf-8").length > 0,
      false,
      "expected no .editorconfig on disk",
    );
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("CLI --detect picks a preset from the target directory", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "cec-cli-"));
  try {
    writeFileSync(path.join(dir, "go.mod"), "module x\n");
    const result = runIn(dir, ["--detect"]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stderr, /Detected preset: go/);
    const written = readFileSync(path.join(dir, ".editorconfig"), "utf-8");
    assert.match(written, /\[\*\.go\]\n/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("CLI --preset web writes a multi-section preset", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "cec-cli-"));
  try {
    const result = runIn(dir, ["--preset", "web"]);
    assert.equal(result.status, 0, result.stderr);
    const written = readFileSync(path.join(dir, ".editorconfig"), "utf-8");
    assert.match(written, /\[\*\]\n/);
    assert.match(written, /\[\*\.md\]\n/);
    assert.match(written, /trim_trailing_whitespace = false/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("CLI --preset unknown errors out", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "cec-cli-"));
  try {
    const result = runIn(dir, ["--preset", "nope"]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /unknown preset/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("CLI -y --output writes to the given path", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "cec-cli-"));
  try {
    const target = path.join(dir, "custom.ec");
    const result = runIn(dir, ["-y", "--output", target]);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(readFileSync(target, "utf-8"), EXPECTED_DEFAULT);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("CLI -y writes to positional target directory", () => {
  const cwd = mkdtempSync(path.join(tmpdir(), "cec-cli-cwd-"));
  const outDir = mkdtempSync(path.join(tmpdir(), "cec-cli-out-"));
  try {
    const result = runIn(cwd, ["-y", outDir]);
    assert.equal(result.status, 0, result.stderr);
    const written = readFileSync(path.join(outDir, ".editorconfig"), "utf-8");
    assert.equal(written, EXPECTED_DEFAULT);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
    rmSync(outDir, { recursive: true, force: true });
  }
});
