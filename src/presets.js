import { DEFAULT_OPTIONS } from "./constants.js";

const base = (overrides = {}) => ({ ...DEFAULT_OPTIONS, ...overrides });

const markdownPreservesTrailingSpaces = {
  glob: "*.md",
  trimTrailingWhitespace: false,
};

const makefileUsesTabs = {
  glob: "Makefile",
  indentStyle: "tab",
  indentSize: "unset",
};

export const PRESETS = {
  default: [base()],

  js: [
    base(),
    {
      glob: "*.{js,jsx,ts,tsx,mjs,cjs,cts,mts,json,jsonc}",
      indentStyle: "space",
      indentSize: 2,
    },
    {
      glob: "*.{yml,yaml}",
      indentStyle: "space",
      indentSize: 2,
    },
    markdownPreservesTrailingSpaces,
    makefileUsesTabs,
  ],

  python: [
    base({ indentSize: 4 }),
    markdownPreservesTrailingSpaces,
    makefileUsesTabs,
  ],

  go: [
    base(),
    markdownPreservesTrailingSpaces,
    {
      glob: "*.go",
      indentStyle: "tab",
      indentSize: "unset",
    },
    makefileUsesTabs,
  ],
};

export function getPreset(name) {
  return PRESETS[name];
}

export const PRESET_NAMES = Object.keys(PRESETS);
