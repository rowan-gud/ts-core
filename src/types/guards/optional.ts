import type { TypeGuard } from './guard';

import { isNull, isUndefined } from './primitive';
import { isUnion } from './union';

/**
 * Create a type guard that allows null values.
 *
 * Example:
 * ```ts
 * const isNumberOrNull = isNullable(isNumber);
 *
 * console.log(isNumberOrNull(42)); // true
 * console.log(isNumberOrNull(null)); // true
 * console.log(isNumberOrNull('42')); // false
 * ```
 *
 * @param guard The guard to check.
 * @returns A type guard that allows null values.
 */
export function isNullable<T>(guard: TypeGuard<T>): TypeGuard<null | T> {
  return isUnion(isNull, guard);
}

/**
 * Create a type guard that allows undefined values.
 *
 * Example:
 * ```ts
 * const isNumberOrUndefined = isOptional(isNumber);
 *
 * console.log(isNumberOrUndefined(42)); // true
 * console.log(isNumberOrUndefined(undefined)); // true
 * console.log(isNumberOrUndefined('42')); // false
 * ```
 *
 * @param guard The guard to check.
 * @returns A type guard that allows undefined values.
 */
export function isOptional<T>(guard: TypeGuard<T>): TypeGuard<T | undefined> {
  return isUnion(isUndefined, guard);
}

/**
 * Create a type guard that allows undefined and null values.
 *
 * Example:
 * ```ts
 * const isNumberOrNullOrUndefined = isOptionalNullable(isNumber);
 *
 * console.log(isNumberOrNullOrUndefined(42)); // true
 * console.log(isNumberOrNullOrUndefined(null)); // true
 * console.log(isNumberOrNullOrUndefined(undefined)); // true
 * console.log(isNumberOrNullOrUndefined('42')); // false
 * ```
 *
 * @param guard The guard to check.
 * @returns A type guard that allows undefined and null values.
 */
export function isOptionalNullable<T>(
  guard: TypeGuard<T>,
): TypeGuard<null | T | undefined> {
  return isUnion(isUndefined, isNull, guard);
}
