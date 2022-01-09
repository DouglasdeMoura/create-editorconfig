#!/usr/bin/env node

'use strict'

const commandLineArgs = require('command-line-args')
const inquirer = require('inquirer')
const fs = require('fs')
const constants = require('./constants.js');
const formatMap = require('./formatMap.js');

// ----------------------------------------

const fileName = constants.FILE_NAME
const root = constants.ROOT_QUESTION
const commonQuestions = constants.COMMON_QUESTIONS
const final = constants.FINAL_QUESTION
const optionDefinitions = constants.OPTIONS_DEFINTIONS
const defaultOptions = constants.DEFAULT_OPTIONS

async function ask (questions) {
  const settings = []

  const askQuestions = (_questions) =>
    inquirer
      .prompt(_questions)
      .then(_answers => {
        const { final, ...answers } = _answers

        settings.push(answers)

        if (final) {
          console.log('\n')
          return ask([...commonQuestions, final])
        }
      })

  await askQuestions(questions)

  return settings
}

function format (settings, formatMap) {
  const formatted = settings.map(data => {
    const textLines = []

    Object.keys(data).forEach(key => {
      const line = formatMap[key](data[key])

      textLines.push(line)
    })

    return ('# editorconfig.org\n' + textLines.join('')).trim()
  })

  return formatted.join('\n') + '\n'
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

const options = commandLineArgs(optionDefinitions)

if (options.yes) {
  write(fileName, format([defaultOptions], formatMap))

  process.exit(0)
}

ask([root, ...commonQuestions, final])
  .then((settings) => {
    write(fileName, format(settings, formatMap))
  })
  .catch(console.error);
