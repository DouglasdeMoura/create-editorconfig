module.exports = {
  root: content => `${content !== undefined ? `root = ${content ? 'true' : 'false'}\n\n` : ''}`,
  glob: content => `[${content}]\n`,
  charset: content => `charset = ${content}\n`,
  end_of_line: content => `end_of_line = ${content}\n`,
  insert_final_newline: content => `insert_final_newline = ${content}\n`,
  indent_style: content => `indent_style = ${content}\n`,
  indent_size: content => `indent_size = ${content}\n`,
  trim_trailing_whitespace: content => `trim_trailing_whitespace = ${content}\n`,
  final: _content => ''
};