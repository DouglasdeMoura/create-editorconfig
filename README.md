# Create EditorConfig

A simple npm script to generate an `.editorconfig` file.

You don't know EditorConfig? [Check out the official documentation!](https://editorconfig.org/)

## Usage

Simply run `npx create-editorconfig` in your project directory and answer
the prompted questions according to your preferences. You must have `node` and
`npm` installed.

Use `npx create-editorconfig -y` to skip the prompts and generate a [default `.editorconfig`
file](.editorconfig).

Pass a directory as a positional argument to write the file somewhere other
than the current directory: `npx create-editorconfig -y ./packages/foo`.

### Flags

- `-y, --yes` — generate the default `.editorconfig` without prompting.
- `-f, --force` — overwrite an existing file instead of erroring out.
- `-o, --output <path>` — write to a specific path instead of `<dir>/.editorconfig`.
- `--stdout` — print the result to stdout instead of writing to disk.

[![Create EditorConfig usage](usage.svg)](https://asciinema.org/a/CDUMGP3neHEMchCFUsIqgN1U4)

## License

Create EditorConfig is open source software [licensed as MIT](https://github.com/facebook/create-react-app/blob/main/LICENSE).
