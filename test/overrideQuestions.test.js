import { test } from "node:test";
import assert from "node:assert/strict";
import { OVERRIDE_QUESTIONS } from "../src/constants.js";

function q(name) {
  return OVERRIDE_QUESTIONS.find((x) => x.name === name);
}

test("glob question is unchanged in override mode", () => {
  assert.equal(q("glob").type, "input");
});

test("list questions gain `unset` as a choice and default to it", () => {
  for (const name of ["charset", "endOfLine", "indentStyle"]) {
    const question = q(name);
    assert.equal(question.type, "list");
    assert.ok(question.choices.includes("unset"));
    assert.equal(question.default, "unset");
  }
});

test("confirm questions become a list with true/false/unset and convert booleans back", () => {
  for (const name of ["insertFinalNewline", "trimTrailingWhitespace"]) {
    const question = q(name);
    assert.equal(question.type, "list");
    assert.deepEqual(question.choices, ["true", "false", "unset"]);
    assert.equal(question.default, "unset");
    assert.equal(question.filter("true"), true);
    assert.equal(question.filter("false"), false);
    assert.equal(question.filter("unset"), "unset");
  }
});

test("input questions accept `unset` (any case)", () => {
  for (const name of ["indentSize", "tabWidth", "maxLineLength"]) {
    const question = q(name);
    assert.equal(question.type, "input");
    assert.equal(question.validate("unset"), true);
    assert.equal(question.validate("UNSET"), true);
    assert.equal(question.filter("unset"), "unset");
    assert.equal(question.default, "unset");
  }
});
