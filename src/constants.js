const isValidGlob = require('is-valid-glob')

exports.DEFAULT_SETTINGS = [];

exports.ROOT_QUESTION = {
  type: 'confirm',
  name: 'root',
  message: 'Is this is the root directory?',
  default: true
};

exports.COMMON_QUESTIONS = [
  {
    type: 'input',
    name: 'glob',
    message: 'Files to apply those rules:',
    default: '*',
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
    default: 'utf-8',
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
    name: 'end_of_line',
    message: 'End of line:',
    default: 'lf',
    choices: [
      'cr',
      'crlf',
      'lf'
    ]
  },
  {
    type: 'confirm',
    name: 'insert_final_newline',
    message: 'Insert final newline:',
    default: true
  },
  {
    type: 'list',
    name: 'indent_style',
    message: 'Indent style:',
    default: 'space',
    choices: [
      'space',
      'tab'
    ]
  },
  {
    type: 'input',
    name: 'indent_size',
    message: 'Indent size:',
    default: 2,
    validate (value) {
      if (Number.isInteger(Number(value))) {
        return true
      }

      return 'Please enter a valid integer.'
    }
  },
  {
    type: 'confirm',
    name: 'trim_trailing_whitespace',
    message: 'Trim trailing whitespace:',
    default: true
  }
];

exports.FINAL_QUESTION = {
  type: 'confirm',
  name: 'final',
  message: 'Do want add different rules for another set of files?',
  default: false
};