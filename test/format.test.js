import { test } from "node:test";
import assert from "node:assert/strict";
import { format, appendSections } from "../src/format.js";
import { DEFAULT_OPTIONS } from "../src/constants.js";

const DEFAULT_EXPECTED = `# editorconfig.org
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
trim_trailing_whitespace = true
`;

test("format([DEFAULT_OPTIONS]) matches the expected .editorconfig", () => {
  assert.equal(format([DEFAULT_OPTIONS]), DEFAULT_EXPECTED);
});

test("format([]) returns only the header", () => {
  assert.equal(format([]), "# editorconfig.org\n");
});

test("format() omits leading blank line when there's no preamble", () => {
  const out = format([{ glob: "*", charset: "utf-8" }]);
  assert.equal(out, "# editorconfig.org\n[*]\ncharset = utf-8\n");
});

test("format() skips keys whose value is undefined or empty string", () => {
  const out = format([{ glob: "*", charset: "utf-8", tabWidth: undefined, indentSize: "" }]);
  assert.equal(out, "# editorconfig.org\n[*]\ncharset = utf-8\n");
});

test("format({header: false}) omits the editorconfig.org header", () => {
  const out = format([{ glob: "*", charset: "utf-8" }], undefined, { header: false });
  assert.equal(out, "[*]\ncharset = utf-8\n");
});

test("appendSections inserts a blank line between existing and new content", () => {
  const existing = "# editorconfig.org\nroot = true\n\n[*]\nindent_size = 2\n";
  const fresh = "[*.md]\ntrim_trailing_whitespace = false\n";
  assert.equal(
    appendSections(existing, fresh),
    "# editorconfig.org\nroot = true\n\n[*]\nindent_size = 2\n\n[*.md]\ntrim_trailing_whitespace = false\n",
  );
});

test("appendSections normalizes trailing newlines on the existing file", () => {
  const existing = "[*]\nindent_size = 2\n\n\n\n";
  const fresh = "[*.md]\n";
  assert.equal(appendSections(existing, fresh), "[*]\nindent_size = 2\n\n[*.md]\n");
});

test("appendSections returns the new content when existing is empty", () => {
  assert.equal(appendSections("", "[*]\n"), "[*]\n");
});

test("format() writes `unset` values verbatim", () => {
  const out = format([
    { root: true, glob: "*", indentStyle: "space" },
    { glob: "Makefile", indentStyle: "unset", indentSize: "unset" },
  ]);
  assert.equal(
    out,
    "# editorconfig.org\n" +
      "root = true\n" +
      "\n[*]\n" +
      "indent_style = space\n" +
      "\n[Makefile]\n" +
      "indent_style = unset\n" +
      "indent_size = unset\n",
  );
});

test("format() skips keys without a formatter", () => {
  const out = format([{ glob: "*", charset: "utf-8", unknownKey: "x" }]);
  assert.equal(out, "# editorconfig.org\n[*]\ncharset = utf-8\n");
});

test("format() concatenates multiple sections", () => {
  const out = format([
    { root: true, glob: "*", charset: "utf-8" },
    { glob: "*.md", trimTrailingWhitespace: false },
  ]);

  assert.equal(
    out,
    "# editorconfig.org\n" +
      "root = true\n" +
      "\n[*]\n" +
      "charset = utf-8\n" +
      "\n[*.md]\n" +
      "trim_trailing_whitespace = false\n",
  );
});
