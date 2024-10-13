import { TypeGuard } from './guard';

export type ArrayLike<T> = Array<T> | ReadonlyArray<T>;

/**
 * Type guard for arrays. Pass through for Array.isArray.
 *
 * Example:
 * ```ts
 * console.log(isArray([1, 2, 3])); // true
 * console.log(isArray('hello')); // false
 * ```
 *
 * @param value The value to check.
 * @returns True if the value is an array.
 */
export function isArray(value: unknown): value is Array<unknown> {
  return Array.isArray(value);
}

/**
 * Type guard for arrays of a specific type. Checks if the value is an array and
 * if all elements pass the provided guard.
 *
 * Example:
 * ```ts
 * const isNumberArray = isArrayOf(isNumber);
 *
 * console.log(isNumberArray([1, 2, 3])); // true
 * console.log(isNumberArray([1, '2', 3])); // false
 * ```
 *
 * @param guard The guard to check each element against.
 * @returns A type guard for arrays of the provided type.
 */
export function isArrayOf<T>(guard: TypeGuard<T>): TypeGuard<Array<T>> {
  return (value: unknown): value is Array<T> => {
    return isArray(value) && value.every(guard);
  };
}
