import readline from "node:readline";

let rl;
const queued = [];
const waiters = [];

function ensureInterface() {
  if (rl) return;
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });
  rl.on("line", (line) => {
    if (waiters.length) waiters.shift()(line);
    else queued.push(line);
  });
  rl.once("close", () => {
    while (waiters.length) waiters.shift()(undefined);
  });
}

function question(text) {
  ensureInterface();
  process.stdout.write(text);
  if (queued.length) return Promise.resolve(queued.shift());
  return new Promise((resolve) => waiters.push(resolve));
}

export function closePrompt() {
  if (rl) {
    rl.close();
    rl = undefined;
  }
}

export function parseConfirm(raw, defaultValue) {
  const v = raw.trim().toLowerCase();
  if (v === "") return defaultValue;
  if (v === "y" || v === "yes") return true;
  if (v === "n" || v === "no") return false;
  return undefined;
}

export function parseList(raw, choices, defaultValue) {
  const v = raw.trim();
  if (v === "") return defaultValue ?? choices[0];
  const n = Number(v);
  if (Number.isInteger(n) && n >= 1 && n <= choices.length) return choices[n - 1];
  if (choices.includes(v)) return v;
  return undefined;
}

async function promptOne(q) {
  while (true) {
    if (q.type === "confirm") {
      const hint = q.default === true ? "Y/n" : "y/N";
      const raw = (await question(`${q.message} (${hint}) `)) ?? "";
      const answer = parseConfirm(raw, q.default);
      if (answer === undefined) {
        console.error("Please answer y or n.");
        continue;
      }
      return answer;
    }

    if (q.type === "list") {
      console.log(q.message);
      q.choices.forEach((c, i) => {
        const marker = c === q.default ? " (default)" : "";
        console.log(`  ${i + 1}) ${c}${marker}`);
      });
      const raw = (await question("> ")) ?? "";
      const answer = parseList(raw, q.choices, q.default);
      if (answer === undefined) {
        console.error("Please pick a number or one of the listed values.");
        continue;
      }
      return answer;
    }

    const hint = q.default !== undefined && q.default !== "" ? ` (${q.default})` : "";
    let raw = (await question(`${q.message}${hint} `)) ?? "";
    if (raw === "" && q.default !== undefined) raw = q.default;
    if (q.validate) {
      const result = q.validate(raw);
      if (result !== true) {
        console.error(typeof result === "string" ? result : "Invalid input.");
        continue;
      }
    }
    return q.filter ? q.filter(raw) : raw;
  }
}

export async function prompt(questions) {
  const answers = {};
  for (const q of questions) {
    answers[q.name] = await promptOne(q);
  }
  return answers;
}
