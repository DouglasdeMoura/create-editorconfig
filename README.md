# create-editorconfig

Generate an [`.editorconfig`](https://editorconfig.org/) for any project.
Interactive prompts, ready-made presets, or a single `-y` for sensible defaults.

```bash
npx create-editorconfig
```

## Install

Nothing to install — just run `npx create-editorconfig` from the directory
where you want the file. Requires Node.js `>=18.3.0`.

## Quick start

```bash
# interactive prompts
npx create-editorconfig

# accept defaults, no prompts
npx create-editorconfig -y

# detect the ecosystem and pick a matching preset
npx create-editorconfig --detect

# emit a Python project preset
npx create-editorconfig --preset python

# write to a specific directory
npx create-editorconfig -y ./packages/foo

# append a new section to an existing file
npx create-editorconfig --merge --preset js
```

## Presets

`--preset <name>` skips the prompts and emits a ready-made multi-section config:

| Preset    | What you get                                                                                                |
| --------- | ----------------------------------------------------------------------------------------------------------- |
| `default` | Same as `-y`. Single `[*]` section with safe defaults.                                                      |
| `js`      | Defaults + explicit JS/TS/JSON/YAML sections, `[*.md]` keeping trailing whitespace, `[Makefile]` with tabs. |
| `python`  | 4-space indent + `[Makefile]` tab override.                                                                 |
| `go`      | `[*.go]` and `[Makefile]` set to tabs, default elsewhere.                                                   |

`--detect` picks one of these automatically by sniffing the target directory:
`go.mod` or `*.go` → `go`, `pyproject.toml` / `requirements.txt` / `*.py` →
`python`, `package.json` / `tsconfig.json` / `*.ts`/`*.tsx`/`*.js` → `js`,
otherwise `default`.

## Flags

| Flag                  | Description                                                                  |
| --------------------- | ---------------------------------------------------------------------------- |
| `-y, --yes`           | Generate the default config without prompting.                               |
| `-p, --preset <name>` | Generate from a named preset (`default`, `js`, `python`, `go`).              |
| `--detect`            | Pick a preset by sniffing the target directory.                              |
| `-f, --force`         | Overwrite an existing file.                                                  |
| `-m, --merge`         | Append new sections to an existing `.editorconfig` instead of erroring out.  |
| `-o, --output <path>` | Write to a specific path.                                                    |
| `--stdout`            | Print to stdout instead of writing to disk.                                  |

A positional argument sets the target directory:
`npx create-editorconfig -y ./packages/foo`.

## Supported properties

Every property in the
[EditorConfig specification](https://spec.editorconfig.org/) is supported, plus
the de-facto `max_line_length`:

- `root` (preamble)
- `charset` — `latin1`, `utf-8`, `utf-8-bom`, `utf-16be`, `utf-16le`
- `end_of_line` — `cr`, `crlf`, `lf`
- `indent_style` — `space`, `tab`
- `indent_size` — positive integer, or `tab`
- `tab_width`
- `insert_final_newline`
- `trim_trailing_whitespace`
- `max_line_length`

Every property accepts `unset` in per-glob override sections to remove a parent
rule.

## Demo

[![Create EditorConfig usage](usage.svg)](https://asciinema.org/a/CDUMGP3neHEMchCFUsIqgN1U4)

## License

[MIT](LICENSE)
