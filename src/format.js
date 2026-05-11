import defaultFormatMap from "./formatMap.js";

const HEADER = "# editorconfig.org\n";

export function format(settings, map = defaultFormatMap) {
  let body = "";

  for (const data of settings) {
    for (const key of Object.keys(data)) {
      const formatter = map[key];
      if (typeof formatter !== "function") continue;
      if (data[key] === undefined || data[key] === "") continue;

      const line = formatter(data[key]);
      if (line === "") continue;

      if (key === "glob" && body !== "") body += "\n";
      body += line;
    }
  }

  return HEADER + body;
}
