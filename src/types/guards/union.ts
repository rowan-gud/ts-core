import { GuardUnionType, TypeGuard, TypeGuardArray } from './guard';

/**
 * Create a type guard for a union of multiple type guards. The type guard
 * will return true if the value passes any of the provided guards.
 *
 * Example:
 * ```ts
 * const isNumberOrString = isUnion(isNumber, isString);
 *
 * console.log(isNumberOrString(42)); // true
 * console.log(isNumberOrString('hello')); // true
 * console.log(isNumberOrString(true)); // false
 * ```
 *
 * @param guards The type guards to union.
 * @returns A type guard for the union of the provided type guards.
 */
export function isUnion<T extends TypeGuardArray<any>>(
  ...guards: T
): TypeGuard<GuardUnionType<T>> {
  return (value: unknown): value is GuardUnionType<T> => {
    return guards.some((guard) => guard(value));
  };
}
