#!/usr/bin/env node

'use strict'

const inquirer = require('inquirer')
const fs = require('fs')
const constants = require('./constants.js');
const formatMap = require('./formatMap.js');

// ----------------------------------------

const settings = constants.DEFAULT_SETTINGS;
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

function format (settings, formatMap) {
  const formated = settings.map(data => {
    const textLines = [];
  
    Object.keys(data).forEach(key => {
      const line = formatMap[key](data[key]);
  
      textLines.push(line);
    });
  
    return ('# editorconfig.org\n' + textLines.join('')).trim();
  });

  return formated.join('\n');
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

    write(file, format(settings, formatMap))
  })
  .catch(console.error);