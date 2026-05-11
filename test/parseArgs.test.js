import { test } from "node:test";
import assert from "node:assert/strict";
import { parseArgs } from "../src/parseArgs.js";

test("no args → yes false, targetDir undefined", () => {
  assert.deepEqual(parseArgs([]), { yes: false, targetDir: undefined });
});

test("--yes long flag → yes: true", () => {
  assert.deepEqual(parseArgs(["--yes"]), { yes: true, targetDir: undefined });
});

test("-y short flag → yes: true", () => {
  assert.deepEqual(parseArgs(["-y"]), { yes: true, targetDir: undefined });
});

test("first positional becomes targetDir", () => {
  assert.deepEqual(parseArgs(["./packages/foo"]), {
    yes: false,
    targetDir: "./packages/foo",
  });
  assert.deepEqual(parseArgs(["-y", "./out"]), {
    yes: true,
    targetDir: "./out",
  });
});

test("reads from process.argv by default", () => {
  const original = process.argv;
  process.argv = ["node", "index.js", "-y"];
  try {
    assert.deepEqual(parseArgs(), { yes: true, targetDir: undefined });
  } finally {
    process.argv = original;
  }
});
