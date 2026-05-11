import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isValidGlob } from '../src/isValidGlob.js'

test('accepts non-empty strings', () => {
  assert.equal(isValidGlob('*'), true)
  assert.equal(isValidGlob('*.js'), true)
  assert.equal(isValidGlob('src/**/*.ts'), true)
})

test('rejects empty string', () => {
  assert.equal(isValidGlob(''), false)
})

test('rejects non-strings', () => {
  assert.equal(isValidGlob(undefined), false)
  assert.equal(isValidGlob(null), false)
  assert.equal(isValidGlob(42), false)
  assert.equal(isValidGlob({}), false)
})

test('accepts arrays of non-empty strings', () => {
  assert.equal(isValidGlob(['*.js', '*.ts']), true)
})

test('rejects empty arrays', () => {
  assert.equal(isValidGlob([]), false)
})

test('rejects arrays containing an empty string', () => {
  assert.equal(isValidGlob(['*.js', '']), false)
})

test('rejects arrays containing non-strings', () => {
  assert.equal(isValidGlob(['*.js', 42]), false)
})
