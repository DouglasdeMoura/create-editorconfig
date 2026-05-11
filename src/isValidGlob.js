export function isValidGlob(glob) {
  if (typeof glob !== "string" || glob.length === 0) return false;

  let inBracket = false;
  let braceDepth = 0;

  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];

    if (c === "\\") {
      i++;
      continue;
    }

    if (inBracket) {
      if (c === "]") inBracket = false;
      continue;
    }

    if (c === "[") inBracket = true;
    else if (c === "{") braceDepth++;
    else if (c === "}") {
      if (braceDepth === 0) return false;
      braceDepth--;
    }
  }

  return !inBracket && braceDepth === 0;
}
