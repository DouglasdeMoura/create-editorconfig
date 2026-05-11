import { test } from "node:test";
import assert from "node:assert/strict";
import { parseArgs } from "../src/parseArgs.js";

const BASE = { yes: false, force: false, stdout: false, targetDir: undefined };

test("no args → all flags default to false, no target", () => {
  assert.deepEqual(parseArgs([]), BASE);
});

test("--yes / -y", () => {
  assert.deepEqual(parseArgs(["--yes"]), { ...BASE, yes: true });
  assert.deepEqual(parseArgs(["-y"]), { ...BASE, yes: true });
});

test("--force / -f", () => {
  assert.deepEqual(parseArgs(["--force"]), { ...BASE, force: true });
  assert.deepEqual(parseArgs(["-f"]), { ...BASE, force: true });
});

test("--stdout", () => {
  assert.deepEqual(parseArgs(["--stdout"]), { ...BASE, stdout: true });
});

test("--output / -o takes a value", () => {
  assert.deepEqual(parseArgs(["--output", "foo.ec"]), { ...BASE, output: "foo.ec" });
  assert.deepEqual(parseArgs(["-o", "bar.ec"]), { ...BASE, output: "bar.ec" });
});

test("first positional becomes targetDir", () => {
  assert.deepEqual(parseArgs(["./packages/foo"]), {
    ...BASE,
    targetDir: "./packages/foo",
  });
  assert.deepEqual(parseArgs(["-y", "./out"]), {
    ...BASE,
    yes: true,
    targetDir: "./out",
  });
});

test("reads from process.argv by default", () => {
  const original = process.argv;
  process.argv = ["node", "index.js", "-y"];
  try {
    assert.deepEqual(parseArgs(), { ...BASE, yes: true });
  } finally {
    process.argv = original;
  }
});
