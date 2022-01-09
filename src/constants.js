const isValidGlob = require('is-valid-glob')

const defaultOptions = {
  root: true,
  glob: '*',
  charset: 'utf-8',
  endOfLine: 'lf',
  insertFinalNewline: true,
  indentStyle: 'space',
  indentSize: 2,
  trimTrailingWhitespace: true
}

exports.DEFAULT_OPTIONS = defaultOptions

exports.OPTIONS_DEFINTIONS = [
  {
    name: 'yes',
    alias: 'y',
    type: Boolean,
    defaultValue: false,
  }
]

exports.FILE_NAME = '.editorconfig'

exports.ROOT_QUESTION = {
  type: 'confirm',
  name: 'root',
  message: 'Is this is the root directory?',
  default: defaultOptions.root
}

exports.COMMON_QUESTIONS = [
  {
    type: 'input',
    name: 'glob',
    message: 'Files to apply those rules:',
    default: defaultOptions.glob,
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
    default: defaultOptions.charset,
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
    default: defaultOptions.endOfLine,
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
    default: defaultOptions.insertFinalNewline
  },
  {
    type: 'list',
    name: 'indentStyle',
    message: 'Indent style:',
    default: defaultOptions.indentStyle,
    choices: [
      'space',
      'tab'
    ]
  },
  {
    type: 'input',
    name: 'indentSize',
    message: 'Indent size:',
    default: defaultOptions.indentSize,
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
    default: defaultOptions.trimTrailingWhitespace
  }
]

exports.FINAL_QUESTION = {
  type: 'confirm',
  name: 'final',
  message: 'Do you want add different rules for another set of files?',
  default: false
}
