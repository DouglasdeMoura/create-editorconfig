import { test } from 'node:test'
import assert from 'node:assert/strict'
import formatMap from '../src/formatMap.js'

test('root: true → "root = true\\n"', () => {
  assert.equal(formatMap.root(true), 'root = true\n')
})

test('root: false → "root = false\\n"', () => {
  assert.equal(formatMap.root(false), 'root = false\n')
})

test('root: undefined → ""', () => {
  assert.equal(formatMap.root(undefined), '')
})

test('glob: produces leading blank line and bracketed pattern', () => {
  assert.equal(formatMap.glob('*'), '\n[*]\n')
  assert.equal(formatMap.glob('*.{js,ts}'), '\n[*.{js,ts}]\n')
})

test('charset', () => {
  assert.equal(formatMap.charset('utf-8'), 'charset = utf-8\n')
})

test('endOfLine', () => {
  assert.equal(formatMap.endOfLine('lf'), 'end_of_line = lf\n')
})

test('insertFinalNewline', () => {
  assert.equal(formatMap.insertFinalNewline(true), 'insert_final_newline = true\n')
  assert.equal(formatMap.insertFinalNewline(false), 'insert_final_newline = false\n')
})

test('indentStyle', () => {
  assert.equal(formatMap.indentStyle('space'), 'indent_style = space\n')
})

test('indentSize', () => {
  assert.equal(formatMap.indentSize(2), 'indent_size = 2\n')
})

test('trimTrailingWhitespace', () => {
  assert.equal(formatMap.trimTrailingWhitespace(true), 'trim_trailing_whitespace = true\n')
})
