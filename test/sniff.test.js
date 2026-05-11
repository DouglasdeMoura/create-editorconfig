import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { detectPreset } from "../src/sniff.js";

function withTempDir(fn) {
  const dir = mkdtempSync(path.join(tmpdir(), "cec-sniff-"));
  try {
    fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test("empty directory → default", () => {
  withTempDir((dir) => {
    assert.equal(detectPreset(dir), "default");
  });
});

test("non-existent directory → default", () => {
  assert.equal(detectPreset("/this/does/not/exist"), "default");
});

test("go.mod → go", () => {
  withTempDir((dir) => {
    writeFileSync(path.join(dir, "go.mod"), "module x\n");
    assert.equal(detectPreset(dir), "go");
  });
});

test("a .go file → go", () => {
  withTempDir((dir) => {
    writeFileSync(path.join(dir, "main.go"), "package main\n");
    assert.equal(detectPreset(dir), "go");
  });
});

test("pyproject.toml → python", () => {
  withTempDir((dir) => {
    writeFileSync(path.join(dir, "pyproject.toml"), "");
    assert.equal(detectPreset(dir), "python");
  });
});

test("package.json → js", () => {
  withTempDir((dir) => {
    writeFileSync(path.join(dir, "package.json"), "{}");
    assert.equal(detectPreset(dir), "js");
  });
});

test("a .ts file → js", () => {
  withTempDir((dir) => {
    writeFileSync(path.join(dir, "index.ts"), "");
    assert.equal(detectPreset(dir), "js");
  });
});

test("go markers take precedence over js markers", () => {
  withTempDir((dir) => {
    writeFileSync(path.join(dir, "go.mod"), "module x\n");
    writeFileSync(path.join(dir, "package.json"), "{}");
    assert.equal(detectPreset(dir), "go");
  });
});
