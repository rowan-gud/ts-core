export function toString(val: unknown): string {
  let value = String(val)

  if (value === '[object Object]') {
    try {
      value = JSON.stringify(value)
    } catch {
      // Leave it as [object Object]
    }
  }

  return value
}
