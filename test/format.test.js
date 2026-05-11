import { test } from "node:test";
import assert from "node:assert/strict";
import { format } from "../src/format.js";
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
