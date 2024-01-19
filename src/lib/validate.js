export function isValidUrl(str) {
  try {
    new URL(str)
    return true
  } catch (err) {
    return false
  }
}

export function validateColor(color) {
  const COLOR_TYPES = ['hex', 'rgb', 'hsl']
  const SUGGESTED_TONE = ['dark', 'light']
  const HEX_DARK_VALUES = ['0', '1', '2', '3', '4', '5', '6', '7', '8']
  const HSL_DARK_LIGHTNESS = 60

  // HEX
  if (color[0] === '#') {
    return {
      suggestedTone: HEX_DARK_VALUES.includes(color[1]) ? SUGGESTED_TONE[1] : SUGGESTED_TONE[0],
      type: COLOR_TYPES[0],
      value: color,
    }
  }

  // RGB
  if (color.slice(0, 3) === 'rgb') {
    const RGB_SPLIT = color.split(', ')
    if (RGB_SPLIT.length > 3 || RGB_SPLIT.length < 3) return { err: 'invalid_value' }
    const RGB_VALUES = RGB_SPLIT.map((value, index) => {
      if (index === 0) return parseInt(value.slice(4))
      if (index === 1) return parseInt(value)
      if (index === 2) return parseInt(value.slice(0, -1))
    }).filter((value) => !isNaN(value))
    if (RGB_VALUES.length < 3) return { err: 'invalid_value' }

    let matches = 0
    RGB_VALUES.forEach((value) => {
      if (value > 200) return (matches += 2)
      if (value < 200 && value > 160) matches++
    })

    return {
      suggestedTone: matches < 3 ? SUGGESTED_TONE[1] : SUGGESTED_TONE[0],
      type: COLOR_TYPES[1],
      value: `rgb(${RGB_VALUES.join(', ')})`,
    }
  }

  // HSL
  if (color.slice(0, 3) === 'hsl') {
    const HSL_SPLIT = color.split(', ')
    if (HSL_SPLIT.length > 3 || HSL_SPLIT < 3) return { err: 'invalid_value' }
    const HSL_VALUES = HSL_SPLIT.map((value, index) => {
      if (index === 0) {
        let hue = parseInt(value.slice(4))
        if (hue > 360 || hue < 0) return

        return hue
      }
      if (index === 1) return parseInt(value)
      if (index === 2) return parseInt(value.slice(0, -1))
    }).filter((value) => !isNaN(value))
    if (HSL_VALUES.length < 3) return { err: 'invalid_value' }

    return {
      suggestedTone: HSL_DARK_LIGHTNESS > HSL_VALUES[2] ? SUGGESTED_TONE[1] : SUGGESTED_TONE[0],
      type: COLOR_TYPES[2],
      value: `hsl(${HSL_VALUES[0]}, ${HSL_VALUES[1]}%, ${HSL_VALUES[2]}%)`,
    }
  }

  return { err: 'invalid_value' }
}
