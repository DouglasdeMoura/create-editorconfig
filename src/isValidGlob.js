export function isValidGlob(glob) {
  if (Array.isArray(glob)) {
    if (glob.length === 0) return false;
    return glob.every((item) => typeof item === "string" && item.length > 0);
  }

  return typeof glob === "string" && glob.length > 0;
}
