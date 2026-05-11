#!/usr/bin/env node

import commandLineArgs from 'command-line-args'
import inquirer from 'inquirer'
import fs from 'node:fs'
import {
  FILE_NAME,
  ROOT_QUESTION,
  COMMON_QUESTIONS,
  FINAL_QUESTION,
  OPTIONS_DEFINTIONS,
  DEFAULT_OPTIONS,
} from './constants.js'
import formatMap from './formatMap.js'
import { format } from './format.js'

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
          return askQuestions([...COMMON_QUESTIONS, FINAL_QUESTION])
        }
      })

  await askQuestions(questions)

  return settings
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

const options = commandLineArgs(OPTIONS_DEFINTIONS)

if (options.yes) {
  write(FILE_NAME, format([DEFAULT_OPTIONS], formatMap))

  process.exit(0)
}

ask([ROOT_QUESTION, ...COMMON_QUESTIONS, FINAL_QUESTION])
  .then((settings) => {
    write(FILE_NAME, format(settings, formatMap))
  })
  .catch(console.error)
