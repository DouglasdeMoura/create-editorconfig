# Changelog

## 2.2.0

### Breaking changes

- The `web` preset is renamed to `js` and gains explicit
  `[*.{js,jsx,ts,tsx,mjs,cjs,cts,mts,json,jsonc}]`, `[*.{yml,yaml}]`, and
  `[Makefile]` sections. `--detect` now reports `js` for Node/TypeScript
  projects (`package.json`, `tsconfig.json`, `deno.json`, `bun.lockb`,
  `*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}`).

## 2.1.0

### New CLI flags

- `<dir>` positional argument — write `.editorconfig` to that directory.
- `-f, --force` — overwrite an existing file.
- `-o, --output <path>` — write to a specific path.
- `--stdout` — print to stdout instead of writing to disk.
- `-p, --preset <name>` — generate from a named preset (`default`, `web`, `python`, `go`).
- `--detect` — pick a preset by sniffing the target directory.
- `-m, --merge` — append new sections to an existing `.editorconfig`.

### New prompt properties

- `tab_width` (positive integer, optional).
- `max_line_length` (positive integer, `off`, or blank).
- `unset` is now accepted for every property in per-glob override sections.

### Fixes

- `indent_size` now requires a positive integer or the literal `tab`.
- Glob validation rejects unbalanced `[]`/`{}`.
- `format()` no longer throws on unknown keys.
- No leading blank line in the output when there is no `root` preamble.
- README typo: `create-editor` → `create-editorconfig`.

## 2.0.0

### Breaking changes

- Now requires Node.js `>=18.3.0` (needed for `node:util.parseArgs`).

### Changes

- Removed `command-line-args` dependency; argument parsing now uses `node:util.parseArgs`.
- Removed `is-valid-glob` dependency; glob validation is now an inline native check.
- Converted source to ES modules (`"type": "module"`).
- Added a test suite using `node:test`. Run with `npm test`.

CLI behavior, prompts, and `.editorconfig` output are unchanged.

## 1.2.2

- Re-enable adding multiple `.editorconfig` rules.

## 1.2.1

- Typo fixes.

## 1.2.0

- Add `-y` flag for default `.editorconfig`.
- Switch internal naming to camelCase; add default options object.

## 1.1.0

- Initial multi-section support.
