#!/usr/bin/env node

'use strict'

const inquirer = require('inquirer')
const isValidGlob = require('is-valid-glob')
const fs = require('fs')

const root = {
  type: 'confirm',
  name: 'root',
  message: 'Is this is the root directory?',
  default: true
}

const commonQuestions = [
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
]

const final = {
  type: 'confirm',
  name: 'final',
  message: 'Do want add different rules for another set of files?',
  default: false
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
      end_of_line,
      insert_final_newline,
      indent_style,
      indent_size,
      trim_trailing_whitespace
    }) => {
      return `${root !== undefined ? `root = ${root ? 'true' : 'false'}\n\n` : ''}` +
        `[${glob}]` + '\n' + '\n' +
        `charset = ${charset}` + '\n' +
        `end_of_line = ${end_of_line}` + '\n' +
        `insert_final_newline = ${insert_final_newline}` + '\n' +
        `indent_style = ${indent_style}` + '\n' +
        `indent_size = ${indent_size}` + '\n' +
        `trim_trailing_whitespace = ${trim_trailing_whitespace}` + '\n'
    })
    .join('\n')
}

function write (file, content) {
  fs.writeFileSync(file, content, {
    encoding: 'utf-8',
    flag: 'w'
  })

  console.log(`\n${file} created. Enjoy :)`)
}

ask([root, ...commonQuestions, final])
  .then(() => {
    const file = '.editorconfig'

    if (fs.existsSync(file)) {
      console.error(`\nERROR: ${file} already exists.`)
      return
    }

    write(file, format(settings))
  })
