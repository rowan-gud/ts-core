/**
 * Convert an unknown value to a string.
 *
 * @param val The value to convert.
 * @returns The string representation of the value.
 */
export function toString(val: unknown): string {
  let value = String(val);

  if (value === '[object Object]') {
    try {
      value = JSON.stringify(value);
    } catch {
      // Leave it as [object Object]
    }
  }

  return value;
}
