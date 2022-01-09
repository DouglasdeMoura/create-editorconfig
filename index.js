#!/usr/bin/env node

'use strict'

const commandLineArgs = require('command-line-args')
const inquirer = require('inquirer')
const isValidGlob = require('is-valid-glob')
const fs = require('fs')

const FILE = '.editorconfig'

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

const settings = []

function ask (questions) {
  return inquirer
    .prompt(questions)
    .then(answers => {
      settings.push(answers)

      if (answers.final) {
        console.log('\n')
        return ask([...commonQuestions, final])
      }
    })
}

function format (settings) {
  return settings
    .map(({
      root,
      glob,
      charset,
      endOfLine,
      insertFinalNewline,
      indentStyle,
      indentSize,
      trimTrailingWhitespace
    }) => {
      return `${root !== undefined ? `root = ${root ? 'true' : 'false'}\n\n` : ''}` +
        `[${glob}]` + '\n' + '\n' +
        `charset = ${charset}` + '\n' +
        `end_of_line = ${endOfLine}` + '\n' +
        `insert_final_newline = ${insertFinalNewline}` + '\n' +
        `indent_style = ${indentStyle}` + '\n' +
        `indent_size = ${indentSize}` + '\n' +
        `trim_trailing_whitespace = ${trimTrailingWhitespace}` + '\n'
    })
    .join('\n')
}

function write (file, content) {
  if (fs.existsSync(file)) {
    console.error(`\nERROR: ${file} already exists.`)
    return
  }

  fs.writeFileSync(file, content, {
    encoding: 'utf-8',
    flag: 'w'
  })

  console.log(`\n${file} created. Enjoy :)`)
}

const optionDefinitions = [
  {
    name: 'yes',
    alias: 'y',
    type: Boolean,
    defaultValue: false,
  }
]

const options = commandLineArgs(optionDefinitions)

if (options.yes) {
  write(FILE, format([defaultOptions]))

  process.exit(0)
}

const root = {
  type: 'confirm',
  name: 'root',
  message: 'Is this is the root directory?',
  default: defaultOptions.root
}

const commonQuestions = [
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
    name: 'end_of_line',
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

const final = {
  type: 'confirm',
  name: 'final',
  message: 'Do want add different rules for another set of files?',
  default: false
}

ask([root, ...commonQuestions, final])
  .then(() => {
    write(FILE, format(settings))
  })
