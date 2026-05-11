import { test } from "node:test";
import assert from "node:assert/strict";
import { PRESETS, PRESET_NAMES, getPreset } from "../src/presets.js";
import { format } from "../src/format.js";

test("ships at least default, web, python, go presets", () => {
  for (const name of ["default", "web", "python", "go"]) {
    assert.ok(PRESET_NAMES.includes(name), `missing preset: ${name}`);
    assert.ok(Array.isArray(getPreset(name)));
  }
});

test("default preset matches the bare `-y` output", () => {
  const out = format(PRESETS.default);
  assert.match(out, /^# editorconfig\.org\n/);
  assert.match(out, /\[\*\]\n/);
  assert.match(out, /charset = utf-8\n/);
});

test("web preset adds an [*.md] override that preserves trailing whitespace", () => {
  const out = format(PRESETS.web);
  assert.match(out, /\[\*\.md\]\n[^[]*trim_trailing_whitespace = false/);
});

test("python preset uses 4-space indent and a tab Makefile", () => {
  const out = format(PRESETS.python);
  assert.match(out, /indent_size = 4/);
  assert.match(out, /\[Makefile\]\n[^[]*indent_style = tab/);
  assert.match(out, /\[Makefile\]\n[^[]*indent_size = unset/);
});

test("go preset uses tabs for *.go and Makefile", () => {
  const out = format(PRESETS.go);
  assert.match(out, /\[\*\.go\]\n[^[]*indent_style = tab/);
  assert.match(out, /\[Makefile\]\n[^[]*indent_style = tab/);
});
