export function parse(value: string = '') {
  if (value.startsWith('=')) {
    try {
      return eval(value.slice(1))
    } catch (error) {
      return value
    }
  }
  return value
}
