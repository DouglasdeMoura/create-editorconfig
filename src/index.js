#!/usr/bin/env node

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
import { format, appendSections } from "./format.js";
import { parseArgs } from "./parseArgs.js";
import { PRESETS, PRESET_NAMES } from "./presets.js";
import { prompt, closePrompt } from "./prompt.js";
import { detectPreset } from "./sniff.js";

async function ask(questions) {
  const settings = [];
  let next = questions;

  while (next) {
    const { final, ...answers } = await prompt(next);
    settings.push(answers);

    if (final) {
      console.log("");
      next = [...OVERRIDE_QUESTIONS, FINAL_QUESTION];
    } else {
      next = null;
    }
  }

  return settings;
}

function emit(content, { file, force, merge }) {
  if (file === "-") {
    process.stdout.write(content);
    return;
  }

  const exists = fs.existsSync(file);

  if (merge && exists) {
    const existing = fs.readFileSync(file, "utf-8");
    const merged = appendSections(existing, content);
    fs.writeFileSync(file, merged, { encoding: "utf-8", flag: "w" });
    console.log(`\n${file} updated. Enjoy :)`);
    return;
  }

  if (!force && exists) {
    console.error(
      `\nERROR: ${file} already exists. Use --force to overwrite or --merge to append.`,
    );
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

const mergeAppend = options.merge && target !== "-" && fs.existsSync(target);

function settingsForAppend(settings) {
  return settings.map(({ root, ...rest }) => rest).filter((s) => Object.keys(s).length > 0);
}

function render(settings) {
  return mergeAppend
    ? format(settingsForAppend(settings), formatMap, { header: false })
    : format(settings, formatMap);
}

if (options.preset !== undefined) {
  const preset = PRESETS[options.preset];
  if (!preset) {
    console.error(
      `\nERROR: unknown preset \`${options.preset}\`. Available: ${PRESET_NAMES.join(", ")}.`,
    );
    process.exit(1);
  }
  emit(render(preset), { file: target, force: options.force, merge: mergeAppend });
  process.exit(process.exitCode ?? 0);
}

if (options.yes) {
  emit(render([DEFAULT_OPTIONS]), { file: target, force: options.force, merge: mergeAppend });
  process.exit(process.exitCode ?? 0);
}

const initialQuestions = mergeAppend
  ? [...COMMON_QUESTIONS, FINAL_QUESTION]
  : [ROOT_QUESTION, ...COMMON_QUESTIONS, FINAL_QUESTION];

ask(initialQuestions)
  .then((settings) => {
    emit(render(settings), { file: target, force: options.force, merge: mergeAppend });
  })
  .catch(console.error)
  .finally(closePrompt);
