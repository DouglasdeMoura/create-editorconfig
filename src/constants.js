import { isValidGlob } from "./isValidGlob.js";

export const DEFAULT_OPTIONS = {
  root: true,
  glob: "*",
  charset: "utf-8",
  endOfLine: "lf",
  insertFinalNewline: true,
  indentStyle: "space",
  indentSize: 2,
  trimTrailingWhitespace: true,
};

export const OPTIONS_DEFINTIONS = {
  yes: {
    type: "boolean",
    short: "y",
    default: false,
  },
  force: {
    type: "boolean",
    short: "f",
    default: false,
  },
  stdout: {
    type: "boolean",
    default: false,
  },
  output: {
    type: "string",
    short: "o",
  },
  preset: {
    type: "string",
    short: "p",
  },
  detect: {
    type: "boolean",
    default: false,
  },
  merge: {
    type: "boolean",
    short: "m",
    default: false,
  },
};

export const FILE_NAME = ".editorconfig";

export const ROOT_QUESTION = {
  type: "confirm",
  name: "root",
  message: "Is this is the root directory?",
  default: DEFAULT_OPTIONS.root,
};

export const COMMON_QUESTIONS = [
  {
    type: "input",
    name: "glob",
    message: "Files to apply those rules:",
    default: DEFAULT_OPTIONS.glob,
    validate(value) {
      if (isValidGlob(value)) {
        return true;
      }

      return "Please enter a valid glob expression.";
    },
  },
  {
    type: "list",
    name: "charset",
    message: "Charset:",
    default: DEFAULT_OPTIONS.charset,
    choices: ["latin1", "utf-8", "utf-8-bom", "utf-16be", "utf-16le"],
  },
  {
    type: "list",
    name: "endOfLine",
    message: "End of line:",
    default: DEFAULT_OPTIONS.endOfLine,
    choices: ["cr", "crlf", "lf"],
  },
  {
    type: "confirm",
    name: "insertFinalNewline",
    message: "Insert final newline:",
    default: DEFAULT_OPTIONS.insertFinalNewline,
  },
  {
    type: "list",
    name: "indentStyle",
    message: "Indent style:",
    default: DEFAULT_OPTIONS.indentStyle,
    choices: ["space", "tab"],
  },
  {
    type: "input",
    name: "indentSize",
    message: "Indent size (positive integer or `tab`):",
    default: DEFAULT_OPTIONS.indentSize,
    validate(value) {
      if (typeof value === "string" && value.trim().toLowerCase() === "tab") {
        return true;
      }

      const n = Number(value);
      if (Number.isInteger(n) && n > 0) {
        return true;
      }

      return "Please enter a positive integer or `tab`.";
    },
    filter(value) {
      if (typeof value === "string" && value.trim().toLowerCase() === "tab") {
        return "tab";
      }
      const n = Number(value);
      return Number.isInteger(n) ? n : value;
    },
  },
  {
    type: "input",
    name: "tabWidth",
    message: "Tab width (positive integer, leave blank to default to indent size):",
    default: "",
    validate(value) {
      if (value === "" || value === undefined) return true;
      const n = Number(value);
      if (Number.isInteger(n) && n > 0) return true;
      return "Please enter a positive integer, or leave blank.";
    },
    filter(value) {
      if (value === "" || value === undefined) return undefined;
      const n = Number(value);
      return Number.isInteger(n) ? n : value;
    },
  },
  {
    type: "confirm",
    name: "trimTrailingWhitespace",
    message: "Trim trailing whitespace:",
    default: DEFAULT_OPTIONS.trimTrailingWhitespace,
  },
  {
    type: "input",
    name: "maxLineLength",
    message: "Max line length (positive integer, `off`, or leave blank):",
    default: "",
    validate(value) {
      if (value === "" || value === undefined) return true;
      if (typeof value === "string" && value.trim().toLowerCase() === "off") {
        return true;
      }
      const n = Number(value);
      if (Number.isInteger(n) && n > 0) return true;
      return "Please enter a positive integer, `off`, or leave blank.";
    },
    filter(value) {
      if (value === "" || value === undefined) return undefined;
      if (typeof value === "string" && value.trim().toLowerCase() === "off") {
        return "off";
      }
      const n = Number(value);
      return Number.isInteger(n) ? n : value;
    },
  },
];

export const FINAL_QUESTION = {
  type: "confirm",
  name: "final",
  message: "Do you want add different rules for another set of files?",
  default: false,
};

const UNSET = "unset";

function withUnsetChoice(q) {
  return {
    ...q,
    choices: [...q.choices, UNSET],
    default: UNSET,
  };
}

function asUnsetableInput(q) {
  return {
    ...q,
    message: q.message.replace(/:$/, `, or \`${UNSET}\`:`),
    default: UNSET,
    validate(value) {
      if (typeof value === "string" && value.trim().toLowerCase() === UNSET) {
        return true;
      }
      return q.validate ? q.validate(value) : true;
    },
    filter(value) {
      if (typeof value === "string" && value.trim().toLowerCase() === UNSET) {
        return UNSET;
      }
      return q.filter ? q.filter(value) : value;
    },
  };
}

function confirmAsUnsetableList(q) {
  return {
    type: "list",
    name: q.name,
    message: q.message,
    default: UNSET,
    choices: ["true", "false", UNSET],
    filter(value) {
      if (value === "true") return true;
      if (value === "false") return false;
      return value;
    },
  };
}

export const OVERRIDE_QUESTIONS = COMMON_QUESTIONS.map((q) => {
  if (q.name === "glob") return q;
  if (q.type === "list") return withUnsetChoice(q);
  if (q.type === "confirm") return confirmAsUnsetableList(q);
  if (q.type === "input") return asUnsetableInput(q);
  return q;
});
