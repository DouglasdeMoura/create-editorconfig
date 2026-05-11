import { DEFAULT_OPTIONS } from "./constants.js";

const base = (overrides = {}) => ({ ...DEFAULT_OPTIONS, ...overrides });

const markdownPreservesTrailingSpaces = {
  glob: "*.md",
  trimTrailingWhitespace: false,
};

export const PRESETS = {
  default: [base()],

  web: [
    base(),
    markdownPreservesTrailingSpaces,
  ],

  python: [
    base({ indentSize: 4 }),
    markdownPreservesTrailingSpaces,
    {
      glob: "Makefile",
      indentStyle: "tab",
      indentSize: "unset",
    },
  ],

  go: [
    base(),
    markdownPreservesTrailingSpaces,
    {
      glob: "*.go",
      indentStyle: "tab",
      indentSize: "unset",
    },
    {
      glob: "Makefile",
      indentStyle: "tab",
      indentSize: "unset",
    },
  ],
};

export function getPreset(name) {
  return PRESETS[name];
}

export const PRESET_NAMES = Object.keys(PRESETS);
