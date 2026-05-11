import { parseArgs as nodeParseArgs } from "node:util";
import { OPTIONS_DEFINTIONS } from "./constants.js";

export function parseArgs(argv = process.argv.slice(2)) {
  const { values } = nodeParseArgs({
    args: argv,
    options: OPTIONS_DEFINTIONS,
    allowPositionals: true,
  });

  return { ...values };
}
