#!/usr/bin/env node

import inquirer from "inquirer";
import fs from "node:fs";
import path from "node:path";
import {
  FILE_NAME,
  ROOT_QUESTION,
  COMMON_QUESTIONS,
  OVERRIDE_QUESTIONS,
  FINAL_QUESTION,
  DEFAULT_OPTIONS,
} from "./constants.js";
import formatMap from "./formatMap.js";
import { format } from "./format.js";
import { parseArgs } from "./parseArgs.js";

async function ask(questions) {
  const settings = [];

  const askQuestions = (_questions) =>
    inquirer.prompt(_questions).then((_answers) => {
      const { final, ...answers } = _answers;

      settings.push(answers);

      if (final) {
        console.log("\n");
        return askQuestions([...OVERRIDE_QUESTIONS, FINAL_QUESTION]);
      }
    });

  await askQuestions(questions);

  return settings;
}

function write(file, content) {
  if (fs.existsSync(file)) {
    console.error(`\nERROR: ${file} already exists.`);
    return;
  }

  fs.writeFileSync(file, content, {
    encoding: "utf-8",
    flag: "w",
  });

  console.log(`\n${file} created. Enjoy :)`);
}

const options = parseArgs();
const targetFile = path.join(options.targetDir ?? ".", FILE_NAME);

if (options.yes) {
  write(targetFile, format([DEFAULT_OPTIONS], formatMap));

  process.exit(0);
}

ask([ROOT_QUESTION, ...COMMON_QUESTIONS, FINAL_QUESTION])
  .then((settings) => {
    write(targetFile, format(settings, formatMap));
  })
  .catch(console.error);
