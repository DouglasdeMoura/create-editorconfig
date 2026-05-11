import defaultFormatMap from "./formatMap.js";

export function format(settings, map = defaultFormatMap) {
  const formatted = settings.map((data) => {
    const textLines = [];

    Object.keys(data).forEach((key) => {
      const formatter = map[key];
      if (typeof formatter !== "function") return;

      textLines.push(formatter(data[key]));
    });

    return textLines.join("");
  });

  return "# editorconfig.org\n" + formatted.join("");
}
