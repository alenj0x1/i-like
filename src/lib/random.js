export function randomColor(type) {
  let hue
  let saturation
  let lightness

  switch (type) {
    case 'pastel':
      hue = randomInt(0, 360)
      saturation = 50
      lightness = 90

      return `hsl(${hue}deg, ${saturation}%, ${lightness}%)`
    default:
      hue = randomInt(0, 360)
      saturation = randomInt(0, 100)
      lightness = randomInt(0, 100)

      return `hsl(${hue}deg, ${saturation}%, ${lightness}%)`
  }
}

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min))
}
