import { ArrayLike } from './array';
import { TypeGuard } from './guard';

export type EnumLike<T = unknown> = ArrayLike<T> | Record<string, T>;

export type EnumValue<T> =
  T extends ArrayLike<infer U>
    ? U
    : T extends Record<string, infer U>
      ? U
      : never;

/**
 * Create a type guard for an enum-like object. The type guard will return true
 * if the value is one of the values in the enum.
 *
 * Example:
 * ```ts
 * const isDirection = isEnum(['up', 'down', 'left', 'right']);
 *
 * console.log(isDirection('up')); // true
 * console.log(isDirection('diagonal')); // false
 * ```
 *
 * Example:
 *
 * ```ts
 * enum Direction {
 *  Up = 'up',
 *  Down = 'down',
 *  Left = 'left',
 *  Right = 'right',
 * }
 *
 * const isDirection = isEnum(Direction);
 *
 * console.log(isDirection('up')); // true
 * console.log(isDirection('diagonal')); // false
 * ```
 *
 * @param options The enum-like object to create a type guard for. This can be
 * an array of values or an object with string keys and values like a native enum.
 * @returns A type guard for the provided enum-like object.
 */
export function isEnum<T extends EnumLike<any>>(
  options: T,
): TypeGuard<EnumValue<T>> {
  const values = Array.isArray(options) ? options : Object.values(options);

  return (value: unknown): value is EnumValue<T> => {
    return values.includes(value);
  };
}
