import type { GuardType, TypeGuard } from './guard';

export type Index = number | string | symbol;
export type PlainObject<K extends Index = Index, V = unknown> = {
  [Key in K]: V;
};

/**
 * Type guard for plain objects with a specific key.
 *
 * @param key The key to check for.
 * @param guard An optional guard to check the value against.
 * @returns A type guard for plain objects with the provided key.
 */
export function hasKey<K extends Index, V = unknown>(
  key: K,
  guard?: TypeGuard<V>,
): (value: unknown) => value is PlainObject<K, V> {
  return (value: unknown): value is PlainObject<K, V> => {
    if (!isPlainObject(value)) {
      return false;
    }

    if (guard) {
      return guard(value[key]);
    }

    return key in value;
  };
}

/**
 * Type guard for plain objects.
 *
 * Example:
 * ```ts
 * console.log(isPlainObject({})); // true
 * console.log(isPlainObject([])); // false
 * ```
 *
 * @param value The value to check.
 * @returns True if the value is a plain object.
 */
export function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Type guard for plain objects with a specific value type.
 *
 * Example:
 * ```ts
 * const isNumberObject = isPlainObjectOf(isNumber);
 *
 * console.log(isNumberObject({ a: 1, b: 2 })); // true
 * console.log(isNumberObject({ a: 1, b: '2' })); // false
 * ```
 *
 * @param guard The guard to check each value against.
 * @returns A type guard for plain objects with the provided value type.
 */
export function isPlainObjectOf<T>(
  guard: TypeGuard<T>,
): TypeGuard<PlainObject<Index, T>> {
  return (value: unknown): value is PlainObject<Index, T> => {
    if (!isPlainObject(value)) {
      return false;
    }

    for (const key of Object.getOwnPropertyNames(value)) {
      if (!guard(value[key])) {
        return false;
      }
    }

    return true;
  };
}

/**
 * Type guard for plain objects with a specific shape. The shape is defined as an
 * object with keys of the same name as the keys in the object to check and values
 * that are type guards for the values of those keys.
 *
 * If the `strict` parameter is set to `true`, the object must not have any extra
 * keys that are not part of the shape.
 *
 * Example:
 * ```ts
 * const isPerson = isShapedObject({
 *  name: isString,
 *  age: isNumber,
 * });
 *
 * console.log(isPerson({ name: 'Alice', age: 30 })); // true
 * console.log(isPerson({ name: 'Alice', age: '30' })); // false
 * console.log(isPerson({ name: 'Alice' })); // false
 * console.log(isPerson({ name: 'Alice', age: 30, foo: 'bar' })); // true
 * ```
 *
 * Example:
 * ```ts
 * const isPerson = isShapedObject({
 *  name: isString,
 *  age: isNumber,
 * });
 *
 * console.log(isPerson({ name: 'Alice', age: 30 })); // true
 * console.log(isPerson({ name: 'Alice', age: 30, foo: 'bar' }, true)); // false
 * ```
 *
 * @param shape The shape of the object to check.
 * @returns A type guard for plain objects with the provided shape.
 */
export function isShapedObject<T extends PlainObject<Index, TypeGuard<any>>>(
  shape: T,
): (
  value: unknown,
  strict?: boolean,
) => value is { [K in keyof T]: GuardType<T[K]> } {
  return (
    value: unknown,
    strict = false,
  ): value is { [K in keyof T]: GuardType<T[K]> } => {
    if (!isPlainObject(value)) {
      return false;
    }

    for (const key of Object.getOwnPropertyNames(shape)) {
      if (!shape[key](value[key])) {
        return false;
      }
    }

    if (strict) {
      for (const key of Object.getOwnPropertyNames(value)) {
        if (!(key in shape)) {
          return false;
        }
      }
    }

    return true;
  };
}
