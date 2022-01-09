module.exports = {
  root: content => `${content !== undefined ? `root = ${content ? 'true' : 'false'}\n\n` : ''}`,
  glob: content => `[${content}]\n`,
  charset: content => `charset = ${content}\n`,
  endOfLine: content => `end_of_line = ${content}\n`,
  insertFinalNewline: content => `insert_final_newline = ${content}\n`,
  indentStyle: content => `indent_style = ${content}\n`,
  indentSize: content => `indent_size = ${content}\n`,
  trimTrailingWhitespace: content => `trim_trailing_whitespace = ${content}\n`,
}
