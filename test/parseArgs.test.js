import { test } from "node:test";
import assert from "node:assert/strict";
import { parseArgs } from "../src/parseArgs.js";

test("no args → yes defaults to false", () => {
  assert.deepEqual(parseArgs([]), { yes: false });
});

test("--yes long flag → yes: true", () => {
  assert.deepEqual(parseArgs(["--yes"]), { yes: true });
});

test("-y short flag → yes: true", () => {
  assert.deepEqual(parseArgs(["-y"]), { yes: true });
});

test("reads from process.argv by default", () => {
  const original = process.argv;
  process.argv = ["node", "index.js", "-y"];
  try {
    assert.deepEqual(parseArgs(), { yes: true });
  } finally {
    process.argv = original;
  }
});
