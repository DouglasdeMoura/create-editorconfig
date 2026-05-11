import { test } from "node:test";
import assert from "node:assert/strict";
import { parseConfirm, parseList } from "../src/prompt.js";

test("parseConfirm returns default for empty input", () => {
  assert.equal(parseConfirm("", true), true);
  assert.equal(parseConfirm("   ", false), false);
});

test("parseConfirm maps y/yes/n/no (case-insensitive)", () => {
  assert.equal(parseConfirm("y", false), true);
  assert.equal(parseConfirm("YES", false), true);
  assert.equal(parseConfirm("n", true), false);
  assert.equal(parseConfirm("No", true), false);
});

test("parseConfirm returns undefined for garbage", () => {
  assert.equal(parseConfirm("maybe", true), undefined);
});

test("parseList returns default (or first choice) for empty", () => {
  assert.equal(parseList("", ["a", "b"], "b"), "b");
  assert.equal(parseList("", ["a", "b"], undefined), "a");
});

test("parseList accepts a 1-based number", () => {
  assert.equal(parseList("1", ["a", "b", "c"]), "a");
  assert.equal(parseList("3", ["a", "b", "c"]), "c");
});

test("parseList accepts the literal choice name", () => {
  assert.equal(parseList("b", ["a", "b", "c"]), "b");
});

test("parseList returns undefined for bad input", () => {
  assert.equal(parseList("0", ["a", "b"]), undefined);
  assert.equal(parseList("4", ["a", "b"]), undefined);
  assert.equal(parseList("z", ["a", "b"]), undefined);
});
