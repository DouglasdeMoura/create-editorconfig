# Changelog

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
