#!/usr/bin/env node

'use strict'

const inquirer = require('inquirer')
const fs = require('fs')
const constants = require('./constants.js');

// ----------------------------------------

const settings = constants.DEFAULTS;
const root = constants.ROOT_QUESTION;
const commonQuestions = constants.COMMON_QUESTIONS;
const final = constants.FINAL_QUESTION;

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
