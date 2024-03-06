export const MS_TYPES_AVAILABLES = {
  s: 1000,
  m: 60000,
  h: 3600000,
  d: 86400000,
  w: 604800000,
  mo: 2629746000,
  y: 31556952000,
  permanent: 'permanent',
}

export function ms(time_string) {
  let number = ''
  let type = ''

  for (let i = 0; i < time_string.length; i++) {
    if (!isNaN(time_string.charAt(i))) number += time_string.charAt(i)
    if (isNaN(time_string.charAt(i))) type += time_string.charAt(i)
  }

  if (!Object.keys(MS_TYPES_AVAILABLES).includes(type)) return { err: 'type_invalid' }

  return {
    time: type === 'permanent' ? 'permanent' : parseInt(number) * MS_TYPES_AVAILABLES[type],
  }
}
