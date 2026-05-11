import { test } from "node:test";
import assert from "node:assert/strict";
import { COMMON_QUESTIONS } from "../src/constants.js";

const indentSize = COMMON_QUESTIONS.find((q) => q.name === "indentSize");

test("indentSize accepts positive integers", () => {
  assert.equal(indentSize.validate("1"), true);
  assert.equal(indentSize.validate("2"), true);
  assert.equal(indentSize.validate("8"), true);
});

test("indentSize accepts the literal `tab` (any case)", () => {
  assert.equal(indentSize.validate("tab"), true);
  assert.equal(indentSize.validate("TAB"), true);
  assert.equal(indentSize.validate(" Tab "), true);
});

test("indentSize rejects zero, negatives, non-integers, and garbage", () => {
  assert.notEqual(indentSize.validate("0"), true);
  assert.notEqual(indentSize.validate("-2"), true);
  assert.notEqual(indentSize.validate("1.5"), true);
  assert.notEqual(indentSize.validate(""), true);
  assert.notEqual(indentSize.validate("abc"), true);
});

test("indentSize filter normalizes `tab` and converts numeric strings", () => {
  assert.equal(indentSize.filter("TAB"), "tab");
  assert.equal(indentSize.filter("4"), 4);
  assert.equal(indentSize.filter(2), 2);
});
