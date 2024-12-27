/**
 * The `Unit` type is a type which has only one possible value. It is used to
 * represent the absence of any meaningful value. It is similar to the `void`
 * type in languages like C, C++, and Java.
 *
 * @see https://en.wikipedia.org/wiki/Unit_type
 * @example
 * ```ts
 * function doSomething(): void {
 *  const result: Result<Unit, Error> = ok()
 *
 *  // We don't actual care about the value, only if it was successful or not
 *  if (result.isErr()) {
 *   console.error(result.error)
 *  }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Unit {}

/**
 * Returns a value of type `Unit`. This is useful when you need to return a
 * value from a function that doesn't have a meaningful value to return.
 *
 * @returns A value of type `Unit`.
 * @example
 * ```ts
 * function doSomething(): Result<Unit, Error> {
 *  if (failure) {
 *    return err(new Error('Something went wrong'))
 *  }
 *
 *  return ok(unit())
 * }
 *
 * // NOTE: Since typescript doesn't have a built-in `Unit` type, we use an empty
 * // object `{}` as a workaround. You can technically assign any type to `Unit`
 * // which is what we want we just don't want to be able to do anything with it.
 * // eg:
 * // This should give an error since we expect to do something
 * // with a number type
 * const foo: number = unit()
 *
 * // This should be fine since we don't expect to do anything with `Unit`
 * const bar: Unit = 1
 * ```
 */
export function unit(): Unit {
  return Object.freeze({}) as Unit;
}
