import { test } from "node:test";
import assert from "node:assert/strict";
import { isValidGlob } from "../src/isValidGlob.js";

test("accepts simple non-empty strings", () => {
  assert.equal(isValidGlob("*"), true);
  assert.equal(isValidGlob("*.js"), true);
  assert.equal(isValidGlob("src/**/*.ts"), true);
  assert.equal(isValidGlob("Makefile"), true);
});

test("accepts balanced brace and bracket expressions", () => {
  assert.equal(isValidGlob("*.{js,ts}"), true);
  assert.equal(isValidGlob("[abc]"), true);
  assert.equal(isValidGlob("[!abc]"), true);
  assert.equal(isValidGlob("{a,{b,c}}"), true);
  assert.equal(isValidGlob("{1..9}"), true);
});

test("accepts escaped special characters", () => {
  assert.equal(isValidGlob("\\[literal\\]"), true);
  assert.equal(isValidGlob("foo\\{bar"), true);
});

test("rejects empty string", () => {
  assert.equal(isValidGlob(""), false);
});

test("rejects non-strings", () => {
  assert.equal(isValidGlob(undefined), false);
  assert.equal(isValidGlob(null), false);
  assert.equal(isValidGlob(42), false);
  assert.equal(isValidGlob({}), false);
  assert.equal(isValidGlob(["*.js"]), false);
});

test("rejects unbalanced brackets", () => {
  assert.equal(isValidGlob("[abc"), false);
  assert.equal(isValidGlob("[abc\\]"), false);
});

test("treats stray `]` as literal", () => {
  assert.equal(isValidGlob("abc]"), true);
});

test("rejects unbalanced braces", () => {
  assert.equal(isValidGlob("{a,b"), false);
  assert.equal(isValidGlob("a,b}"), false);
  assert.equal(isValidGlob("{a,{b}"), false);
});
