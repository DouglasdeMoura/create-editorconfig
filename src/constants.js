import isValidGlob from 'is-valid-glob'

export const DEFAULT_OPTIONS = {
  root: true,
  glob: '*',
  charset: 'utf-8',
  endOfLine: 'lf',
  insertFinalNewline: true,
  indentStyle: 'space',
  indentSize: 2,
  trimTrailingWhitespace: true
}

export const OPTIONS_DEFINTIONS = [
  {
    name: 'yes',
    alias: 'y',
    type: Boolean,
    defaultValue: false,
  }
]

export const FILE_NAME = '.editorconfig'

export const ROOT_QUESTION = {
  type: 'confirm',
  name: 'root',
  message: 'Is this is the root directory?',
  default: DEFAULT_OPTIONS.root
}

export const COMMON_QUESTIONS = [
  {
    type: 'input',
    name: 'glob',
    message: 'Files to apply those rules:',
    default: DEFAULT_OPTIONS.glob,
    validate (value) {
      if (isValidGlob(value)) {
        return true
      }

      return 'Please enter a valid glob expression.'
    }
  },
  {
    type: 'list',
    name: 'charset',
    message: 'Charset:',
    default: DEFAULT_OPTIONS.charset,
    choices: [
      'latin1',
      'utf-8',
      'utf-8-bom',
      'utf-16be',
      'utf-16le'
    ]
  },
  {
    type: 'list',
    name: 'endOfLine',
    message: 'End of line:',
    default: DEFAULT_OPTIONS.endOfLine,
    choices: [
      'cr',
      'crlf',
      'lf'
    ]
  },
  {
    type: 'confirm',
    name: 'insertFinalNewline',
    message: 'Insert final newline:',
    default: DEFAULT_OPTIONS.insertFinalNewline
  },
  {
    type: 'list',
    name: 'indentStyle',
    message: 'Indent style:',
    default: DEFAULT_OPTIONS.indentStyle,
    choices: [
      'space',
      'tab'
    ]
  },
  {
    type: 'input',
    name: 'indentSize',
    message: 'Indent size:',
    default: DEFAULT_OPTIONS.indentSize,
    validate (value) {
      if (Number.isInteger(Number(value))) {
        return true
      }

      return 'Please enter a valid integer.'
    }
  },
  {
    type: 'confirm',
    name: 'trimTrailingWhitespace',
    message: 'Trim trailing whitespace:',
    default: DEFAULT_OPTIONS.trimTrailingWhitespace
  }
]

export const FINAL_QUESTION = {
  type: 'confirm',
  name: 'final',
  message: 'Do you want add different rules for another set of files?',
  default: false
}
