import defaultFormatMap from './formatMap.js'

export function format (settings, map = defaultFormatMap) {
  const formatted = settings.map(data => {
    const textLines = []

    Object.keys(data).forEach(key => {
      const line = map[key](data[key])

      textLines.push(line)
    })

    return textLines.join('')
  })

  return '# editorconfig.org\n' + formatted.join('')
}
