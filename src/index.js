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
import { PRESETS, PRESET_NAMES } from "./presets.js";
import { detectPreset } from "./sniff.js";

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

function emit(content, { file, force }) {
  if (file === "-") {
    process.stdout.write(content);
    return;
  }

  if (!force && fs.existsSync(file)) {
    console.error(`\nERROR: ${file} already exists. Use --force to overwrite.`);
    process.exitCode = 1;
    return;
  }

  fs.writeFileSync(file, content, { encoding: "utf-8", flag: "w" });
  console.log(`\n${file} created. Enjoy :)`);
}

function resolveTarget(options) {
  if (options.stdout) return "-";
  if (options.output) return options.output;
  return path.join(options.targetDir ?? ".", FILE_NAME);
}

const options = parseArgs();
const target = resolveTarget(options);

if (options.detect && options.preset === undefined) {
  const detected = detectPreset(options.targetDir ?? ".");
  console.error(`Detected preset: ${detected}`);
  options.preset = detected;
}

if (options.preset !== undefined) {
  const preset = PRESETS[options.preset];
  if (!preset) {
    console.error(
      `\nERROR: unknown preset \`${options.preset}\`. Available: ${PRESET_NAMES.join(", ")}.`,
    );
    process.exit(1);
  }
  emit(format(preset, formatMap), { file: target, force: options.force });
  process.exit(process.exitCode ?? 0);
}

if (options.yes) {
  emit(format([DEFAULT_OPTIONS], formatMap), { file: target, force: options.force });
  process.exit(process.exitCode ?? 0);
}

ask([ROOT_QUESTION, ...COMMON_QUESTIONS, FINAL_QUESTION])
  .then((settings) => {
    emit(format(settings, formatMap), { file: target, force: options.force });
  })
  .catch(console.error);
