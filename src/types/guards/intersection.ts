import type { GuardIntersectionType, TypeGuard, TypeGuardArray } from './guard';

/**
 * Create a type guard for an intersection of multiple type guards. The type guard
 * will return true if the value passes all of the provided guards. The type
 * returned by the type guard will be correctly inferred as the intersection of
 * the types guarded by the provided guards.
 *
 * Example:
 * ```ts
 * interface A {
 *  a: number;
 * }
 *
 * interface B {
 *  b: string;
 * }
 *
 * const isA = (value: unknown): value is A => {
 *  return typeof value === 'object' && 'a' in value;
 * };
 * const isB = (value: unknown): value is B => {
 *  return typeof value === 'object' && 'b' in value;
 * };
 *
 * // (value: unknown) => value is A & B
 * const isAAndB = isIntersection(isA, isB);
 *
 * console.log(isAAndB({ a: 1, b: 'hello' })); // true
 * console.log(isAAndB({ a: 1 })); // false
 * ```
 *
 * @param guards The type guards to intersect.
 * @returns A type guard for the intersection of the provided type guards.
 */
export function isIntersection<T extends TypeGuardArray<any>>(
  ...guards: T
): TypeGuard<GuardIntersectionType<T>> {
  return (value: unknown): value is GuardIntersectionType<T> => {
    return guards.every((guard) => guard(value));
  };
}
