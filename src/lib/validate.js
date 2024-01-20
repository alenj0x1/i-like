import { hex, rgb, hsl } from 'color-convert'

export function isValidUrl(str) {
  try {
    new URL(str)
    return true
  } catch (err) {
    return false
  }
}

export function validateColor({ color, convert, useTone }) {
  const COLOR_TYPES = ['hex', 'rgb', 'hsl']
  const SUGGESTED_TONE = ['dark', 'light']
  const HEX_DARK_VALUES = ['0', '1', '2', '3', '4', '5', '6', '7', '8']
  const HSL_DARK_LIGHTNESS = 60

  function convertColor(type, suggestedTone) {
    // HEX
    if (type === COLOR_TYPES[0]) {
      if (convert === COLOR_TYPES[1]) {
        const RGB = hex.rgb(color)
        return `rgb(${RGB[0]}, ${RGB[1]}, ${RGB[2]})`
      }

      if (convert === COLOR_TYPES[2]) {
        const HSL = hex.hsl(color)

        if (useTone)
          return {
            normal: `hsl(${HSL[0]}, ${HSL[1]}%, ${
              suggestedTone === SUGGESTED_TONE[0] ? parseInt(HSL[2]) - 10 : parseInt(HSL[2]) + 10
            }%)`,
            opaque: `hsl(${HSL[0]}, ${HSL[1]}%, ${
              suggestedTone === SUGGESTED_TONE[0] ? parseInt(HSL[2]) - 5 : parseInt(HSL[2]) + 5
            }%)`,
          }

        return `hsl(${HSL[0]}, ${HSL[1]}%, ${HSL[2]}%)`
      }
    }

    // RGB
    if (type === COLOR_TYPES[1]) {
      if (convert === COLOR_TYPES[0]) {
        const HEX = rgb.hex(color)
        return `#${HEX}`
      }

      if (convert === COLOR_TYPES[2]) {
        const HSL = rgb.hsl(color)

        if (useTone)
          return {
            normal: `hsl(${HSL[0]}, ${HSL[1]}%, ${
              suggestedTone === SUGGESTED_TONE[0] ? parseInt(HSL[2]) - 10 : parseInt(HSL[2]) + 10
            }%)`,
            opaque: `hsl(${HSL[0]}, ${HSL[1]}%, ${
              suggestedTone === SUGGESTED_TONE[0] ? parseInt(HSL[2]) - 5 : parseInt(HSL[2]) + 5
            }%)`,
          }

        return `hsl(${HSL[0]}, ${HSL[1]}%, ${HSL[2]}%)`
      }
    }

    // HSL
    if (type === COLOR_TYPES[2]) {
      if (convert === COLOR_TYPES[0]) {
        const HEX = hsl.hex(color)
        return `#${HEX}`
      }

      if (convert === COLOR_TYPES[1]) {
        const RGB = hsl.rgb(color)
        return `rgb(${RGB[0]}, ${RGB[1]}, ${RGB[2]})`
      }

      if (convert === COLOR_TYPES[2]) {
        if (useTone) {
          const HSL = color.split(',').map((value) => value.trim())
          const HSL_LIGHTNESS = HSL[2].slice(0, -2)

          return {
            normal: `${HSL[0]} ${HSL[1]} ${
              suggestedTone === SUGGESTED_TONE[0]
                ? parseInt(HSL_LIGHTNESS) - 10
                : parseInt(HSL_LIGHTNESS) + 10
            }%)`,
            opaque: `${HSL[0]} ${HSL[1]} ${
              suggestedTone === SUGGESTED_TONE[0]
                ? parseInt(HSL_LIGHTNESS) - 5
                : parseInt(HSL_LIGHTNESS) + 5
            }%)`,
          }
        }

        return color
      }
    }
  }

  // HEX
  if (color[0] === '#') {
    const suggestedTone = HEX_DARK_VALUES.includes(color[1]) ? SUGGESTED_TONE[1] : SUGGESTED_TONE[0]

    return {
      suggestedTone,
      type: COLOR_TYPES[0],
      value: color,
      converted: convertColor('hex', suggestedTone),
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

    const suggestedTone = matches < 3 ? SUGGESTED_TONE[1] : SUGGESTED_TONE[0]

    return {
      suggestedTone,
      type: COLOR_TYPES[1],
      value: `rgb(${RGB_VALUES.join(', ')})`,
      converted: convertColor('hex', suggestedTone),
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

    const suggestedTone = HSL_DARK_LIGHTNESS > HSL_VALUES[2] ? SUGGESTED_TONE[1] : SUGGESTED_TONE[0]

    return {
      suggestedTone,
      type: COLOR_TYPES[2],
      value: `hsl(${HSL_VALUES[0]}, ${HSL_VALUES[1]}%, ${HSL_VALUES[2]}%)`,
      converted: convertColor('hsl', suggestedTone),
    }
  }

  return { err: 'invalid_value' }
}
