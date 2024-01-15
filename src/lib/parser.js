export function parserTags(tags) {
  return tags
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length)
}
