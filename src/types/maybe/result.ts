import { toString } from '@/utils'
import { Option, Some, some, none } from './option'
import { Unit, unit } from '../unit'
import { ResultAsync, errAsync, okAsync } from './result-async'

export interface BaseResult<T, E>
  extends Iterable<T extends Iterable<infer U> ? U : never> {
  /**
   * Returns true if the result is an Ok value and narrows the type accordingly.
   *
   * @returns True if the result is an Ok value, false otherwise.
   * @example
   * ```ts
   * const result: Result<number, Error> = ok(1)
   *
   * if (result.isOk()) {
   *  result // Ok<number>
   * } else {
   *  result // Err<Error>
   * }
   * ```
   */
  isOk(): this is Ok<T>

  /**
   * Returns true if the result is an Ok value and the value satisfies the given
   * predicate function. If the result is an Err value, the function is ignored
   * and false is returned.
   *
   * @param fn The predicate function to apply to the value if the result is an Ok value.
   * @returns True if the result is an Ok value and the value satisfies the given predicate
   * function, false otherwise.
   * @example
   * ```ts
   * const result: Result<number, Error> = ok(1)
   * const isGreaterThanZero = result.isOkAnd(value => value > 0)
   *
   * if (isGreaterThanZero) {
   *  result // Ok<number>
   * } else {
   *  result // Err<Error>
   * }
   */
  isOkAnd<R extends T = T>(
    fn: ((value: T) => boolean) | ((value: T) => value is R),
  ): this is Ok<T>

  /**
   * Returns true if the result is an Err value and narrows the type accordingly.
   *
   * @returns True if the result is an Err value, false otherwise.
   * @example
   * ```ts
   * const result: Result<number, Error> = err(new Error('An error occurred'))
   *
   * if (result.isErr()) {
   *  result // Err<Error>
   * } else {
   *  result // Ok<number>
   * }
   * ```
   */
  isErr(): this is Err<E>

  /**
   * Transforms the result into a new result by applying the given function to
   * the value if the result is an Ok value. If the result is an Err value, the
   * function is ignored and the result is returned as is.
   *
   * @param fn The function to apply to the value if the result is an Ok value.
   * @returns A new result with the transformed value if the result is an Ok
   * value, otherwise the original result.
   * @example
   * ```ts
   * const okResult: Result<number, Error> = ok(1)
   * const errResult: Result<number, Error> = err(new Error('An error occurred'))
   *
   * okResult.map(value => value + 1) // Ok<number>
   * errResult.map(value => value + 1) // Err<Error>
   * ```
   */
  map<U>(fn: (value: T) => U): Result<U, E>

  /**
   * Transforms the result into a new result by applying the given function to
   * the value if the result is an Ok value. If the result is an Err value, the
   * function is ignored and the result is returned as is. The function must
   * return a new result.
   *
   * @param fn The function to apply to the value if the result is an Ok value.
   * @returns A new result with the transformed value if the result is an Ok
   * value, otherwise the original result.
   * @example
   * ```ts
   * const okResult: Result<number, Error> = ok(1)
   * const errResult: Result<number, Error> = err(new Error('An error occurred'))
   *
   * await okResult.mapAsync(value => ok(value + 1)) // Ok<number>
   * await errResult.mapAsync(value => ok(value + 1)) // Err<Error>
   * ```
   */
  mapAsync<U>(fn: (value: T) => Promise<U>): ResultAsync<U, E>

  /**
   * Transforms the result into a new result by applying the given function to
   * the error if the result is an Err value. If the result is an Ok value, the
   * function is ignored and the result is returned as is.
   *
   * @param fn The function to apply to the error if the result is an Err value.
   * @returns A new result with the transformed error if the result is an Err
   * value, otherwise the original result.
   * @example
   * ```ts
   * const okResult: Result<number, Error> = ok(1)
   * const errResult: Result<number, Error> = err(new Error('An error occurred'))
   *
   * okResult.mapErr(error => new Error('A new error occurred')) // Ok<number>
   * errResult.mapErr(error => new Error('A new error occurred')) // Err<Error>
   * ```
   */
  mapErr<U>(fn: (error: E) => U): Result<T, U>

  /**
   * Transforms the result into a new result by applying the given function to
   * the error if the result is an Err value. If the result is an Ok value, the
   * function is ignored and the result is returned as is. The function must
   * return a new result.
   *
   * @param fn The function to apply to the error if the result is an Err value.
   * @returns A new result with the transformed error if the result is an Err
   * value, otherwise the original result.
   * @example
   * ```ts
   * const okResult: Result<number, Error> = ok(1)
   * const errResult: Result<number, Error> = err(new Error('An error occurred'))
   *
   * await okResult.mapErrAsync(error => new Error('A new error occurred')) // Ok<number>
   * await errResult.mapErrAsync(error => new Error('A new error occurred')) // Err<Error>
   * ```
   */
  mapErrAsync<U>(fn: (error: E) => Promise<U>): ResultAsync<T, U>

  /**
   * Transforms the result into a new result by applying the given function to
   * the value if the result is an Ok value. If the result is an Err value, the
   * function is ignored and the result is returned as is. The function must
   * return a new result.
   *
   * @param fn The function to apply to the value if the result is an Ok value.
   * @returns A new result with the transformed value if the result is an Ok
   * value, otherwise the original result.
   * @example
   * ```ts
   * const okResult: Result<number, Error> = ok(1)
   * const errResult: Result<number, Error> = err(new Error('An error occurred'))
   *
   * okResult.andThen(value => ok(value + 1)) // Ok<number>
   * errResult.andThen(value => ok(value + 1)) // Err<Error>
   * ```
   */
  andThen<T2, E2>(fn: (value: T) => Result<T2, E2>): Result<T2, E | E2>

  /**
   * Transforms the result into a new result by applying the given function to
   * the value if the result is an Ok value. If the result is an Err value, the
   * function is ignored and the result is returned as is. The function must
   * return a promise that resolves to a new result.
   *
   * @param fn The function to apply to the value if the result is an Ok value.
   * @returns A new result with the transformed value if the result is an Ok
   * value, otherwise the original result.
   * @example
   * ```ts
   * const okResult: Result<number, Error> = ok(1)
   * const errResult: Result<number, Error> = err(new Error('An error occurred'))
   *
   * await okResult.andThenAsync(value => ok(value + 1)) // Ok<number>
   * await errResult.andThenAsync(value => ok(value + 1)) // Err<Error>
   * ```
   */
  andThenAsync<T2, E2>(
    fn: (value: T) => Promise<Result<T2, E2>>,
  ): ResultAsync<T2, E | E2>

  /**
   * Transforms the result into a new result by applying the given function to
   * the value if the result is an Err value. If the result is an Ok value, the
   * function is ignored and the result is returned as is. The function must
   * return a new result.
   *
   * @param fn The function to apply to the value if the result is an Err value.
   * @returns A new result with the transformed value if the result is an Err
   * value, otherwise the original result.
   * @example
   * ```ts
   * const okResult: Result<number, Error> = ok(1)
   * const errResult: Result<number, Error> = err(new Error('An error occurred'))
   *
   * okResult.orElse(value => ok(value + 1)) // ok(1)
   * errResult.orElse(value => ok(value + 1)) // ok(2)
   * ```
   */
  orElse<T2, E2>(fn: (error: E) => Result<T2, E2>): Result<T | T2, E2>

  /**
   * Transforms the result into a new result by applying the given function to
   * the value if the result is an Ok value. If the result is an Err value, the
   * function is ignored and the result is returned as is. The function must
   * return a promise that resolves to a new result.
   *
   * @param fn The function to apply to the value if the result is an Ok value.
   * @returns A new result with the transformed value if the result is an Ok
   * value, otherwise the original result.
   * @example
   * ```ts
   * const okResult: Result<number, Error> = ok(1)
   * const errResult: Result<number, Error> = err(new Error('An error occurred'))
   *
   * await okResult.orElseAsync(value => ok(value + 1)) // ok(1)
   * await errResult.orElseAsync(value => ok(value + 1)) // ok(2)
   * ```
   */
  orElseAsync<T2, E2>(
    fn: (error: E) => Promise<Result<T2, E2>>,
  ): ResultAsync<T | T2, E2>

  /**
   * Matches the result by calling the appropriate function based on the value
   * of the result. If the result is an Ok value, the `ok` function is called
   * with the value. If the result is an Err value, the `err` function is called
   * with the error. The branches must return the same type.
   *
   * @param matcher An object containing the `ok` and `err` functions to call
   * based on the value of the result.
   * @param matcher.ok The function to call if the result is an Ok value.
   * @param matcher.err The function to call if the result is an Err value.
   * @returns The result of the called function.
   * @example
   * ```ts
   * const okResult: Result<number, Error> = ok(1)
   * const errResult: Result<number, Error> = err(new Error('An error occurred'))
   *
   * okResult.match({
   *   ok: value => (value + 1).toString(),
   *   err: error => error.message,
   * }) // '2'
   *
   * errResult.match({
   *   ok: value => (value + 1).toString(),
   *   err: error => error.message,
   * }) // 'An error occurred'
   * ```
   */
  match<U>(matcher: { ok: (value: T) => U; err: (error: E) => U }): U

  /**
   * Converts the result into an Option by wrapping the value in a Some if the
   * result is an Ok value. If the result is an Err value, None is returned.
   *
   * @returns Some if the result is an Ok value, None otherwise.
   * @example
   * ```ts
   * const okResult: Result<number, Error> = ok(1)
   * const errResult: Result<number, Error> = err(new Error('An error occurred'))
   *
   * okResult.ok() // Some<number>
   * errResult.ok() // None
   * ```
   */
  ok(): Option<T>

  /**
   * Converts the result into an Option by wrapping the error in a Some if the
   * result is an Err value. If the result is an Ok value, None is returned.
   *
   * @returns Some if the result is an Err value, None otherwise.
   * @example
   * ```ts
   * const okResult: Result<number, Error> = ok(1)
   * const errResult: Result<number, Error> = err(new Error('An error occurred'))
   *
   * okResult.err() // None
   * errResult.err() // Some<Error>
   * ```
   */
  err(): Option<E>

  /**
   * Unwraps the result, returning the value if the result is an Ok value. If
   * the result is an Err value, the provided default value is returned.
   *
   * @param value The default value to return if the result is an Err value.
   * @returns The value if the result is an Ok value, otherwise the default
   * value.
   * @example
   * ```ts
   * const okResult: Result<number, Error> = ok(1)
   * const errResult: Result<number, Error> = err(new Error('An error occurred'))
   *
   * okResult.unwrapOr(0) // 1
   * errResult.unwrapOr(0) // 0
   * ```
   */
  unwrapOr<U>(value: U): T | U

  /**
   * Unwraps the result, returning the value if the result is an Ok value. If
   * the result is an Err value, the result of the provided function is returned.
   *
   * @param fn The function to call if the result is an Err value.
   * @returns The value if the result is an Ok value, otherwise the result of
   * the provided function.
   * @example
   * ```ts
   * const okResult: Result<number, Error> = ok(1)
   * const errResult: Result<number, Error> = err(new Error('An error occurred'))
   *
   * okResult.unwrapOrElse(() => 0) // 1
   * errResult.unwrapOrElse(() => 0) // 0
   * ```
   */
  unwrapOrElse<U>(fn: () => U): T | U

  /**
   * Unwraps the result, returning the error if the result is an Err value. If
   * the result is an Ok value, the provided default error is returned.
   *
   * @param error The default error to return if the result is an Ok value.
   * @returns The error if the result is an Err value, otherwise the default
   * error.
   * @example
   * ```ts
   * const okResult: Result<number, Error> = ok(1)
   * const errResult: Result<number, Error> = err(new Error('An error occurred'))
   *
   * okResult.unwrapErrOr(new Error('Default error')) // Default error
   * errResult.unwrapErrOr(new Error('Default error')) // An error occurred
   * ```
   */
  unwrapErrOr<U>(error: U): E | U

  /**
   * Unwraps the result, returning the error if the result is an Err value. If
   * the result is an Ok value, the result of the provided function is returned.
   *
   * @param fn The function to call if the result is an Ok value.
   * @returns The error if the result is an Err value, otherwise the result of
   * the provided function.
   * @example
   * ```ts
   * const okResult: Result<number, Error> = ok(1)
   * const errResult: Result<number, Error> = err(new Error('An error occurred'))
   *
   * okResult.unwrapErrOrElse(() => new Error('Default error')) // Default error
   * errResult.unwrapErrOrElse(() => new Error('Default error')) // An error occurred
   * ```
   */
  unwrapErrOrElse<U>(fn: () => U): E | U

  /**
   * WARN: This method is unsafe and can throw an error if the option is a `Err` value.
   * This method should only be used in tests. Use {@link unwrapOr} or {@link unwrapOrElse} instead to provide
   * a default value. If you are sure that the result is a `Ok` value, use the {@link Ok.prototype.inner} method instead.
   *
   * Unwraps the result and returns the value if it is a `Ok` value. If the option is a `Err` value,
   * an error is thrown.
   *
   * @returns The value if the option is a `Ok` value.
   * @throws An error if the option is a `Err` value.
   * @example
   * ```ts
   * const result: Result<number, Error> = ok(1)
   *
   * const value = result._unwrap() // 1
   * ```
   */
  _unwrap(): T

  /**
   * WARN: This method is unsafe and can throw an error if the option is a `Ok` value.
   * This method should only be used in tests. Use {@link unwrapErrOr} or {@link unwrapErrOrElse} instead to provide
   * a default value. If you are sure that the result is a `Err` value, use the {@link Err.prototype.inner} method instead.
   *
   * Unwraps the result and returns the error if it is a `Err` value. If the option is a `Ok` value,
   * an error is thrown.
   *
   * @returns The error if the option is a `Err` value.
   * @throws An error if the option is a `Ok` value.
   * @example
   * ```ts
   * const result: Result<number, Error> = err(new Error('An error occurred'))
   *
   * const error = result._unwrapErr() // An error occurred
   * ```
   */
  _unwrapErr(): E

  toString(): string

  /**
   * Converts the result to a JSON string. This method is called by `JSON.stringify`.
   *
   * @returns A JSON representation of the result. If the result is an Ok value, the value is returned.
   * If the result is an Err value, `null` is returned.
   * @example
   * ```ts
   * const okResult: Result<number, Error> = ok(1)
   * const errResult: Result<number, Error> = err(new Error('An error occurred'))
   *
   * JSON.stringify(okResult) // '1'
   * JSON.stringify(errResult) // 'null'
   */
  toJSON(): string
}

export class Ok<T> implements BaseResult<T, never> {
  constructor(private value: T) {}

  [Symbol.iterator](): Iterator<T extends Iterable<infer U> ? U : never> {
    const obj = Object(this.value) as Iterable<any>

    if (Symbol.iterator in obj) {
      return obj[Symbol.iterator]()
    }

    return {
      next() {
        return { done: true, value: undefined! }
      },
    }
  }

  /**
   * Returns the value contained within the result. This method only works if the result is an `Ok` value.
   *
   * @returns The value contained within the result.
   * @example
   * ```ts
   * const opt: Option<number> = some(1)
   *
   * if (opt.isSome()) {
   *  opt.inner() // 1
   * }
   * ```
   */
  inner(): T {
    return this.value
  }

  isOk(): this is Ok<T> {
    return true
  }

  isOkAnd<R extends T = T>(
    fn: ((value: T) => boolean) | ((value: T) => value is R),
  ): this is Ok<R> {
    return fn(this.value)
  }

  isErr(): this is Err<never> {
    return false
  }

  map<U>(fn: (value: T) => U): Ok<U> {
    return ok(fn(this.value))
  }

  mapAsync<U>(fn: (value: T) => Promise<U>): ResultAsync<U, never> {
    return okAsync(fn(this.value))
  }

  mapErr<U>(_fn: (error: never) => U): Ok<T> {
    return this
  }

  mapErrAsync<U>(_fn: (error: never) => Promise<U>): ResultAsync<T, never> {
    return new ResultAsync(Promise.resolve(this))
  }

  andThen<T2, E2>(fn: (value: T) => Result<T2, E2>): Result<T2, E2> {
    return fn(this.value)
  }

  andThenAsync<T2, E2>(
    fn: (value: T) => Promise<Result<T2, E2>>,
  ): ResultAsync<T2, E2> {
    return new ResultAsync(fn(this.value))
  }

  orElse<T2, E2>(_fn: (error: never) => Result<T2, E2>): Result<T | T2, E2> {
    return this
  }

  orElseAsync<T2, E2>(
    _fn: (error: never) => Promise<Result<T2, E2>>,
  ): ResultAsync<T | T2, E2> {
    return new ResultAsync(Promise.resolve(this))
  }

  match<U>(matcher: { ok: (value: T) => U; err: (error: never) => U }): U {
    return matcher.ok(this.value)
  }

  ok(): Some<T> {
    return some(this.value)
  }

  err(): Option<never> {
    return none()
  }

  unwrapOr(_value: unknown): T {
    return this.value
  }

  unwrapOrElse(_fn: () => unknown): T {
    return this.value
  }

  unwrapErrOr<U>(error: U): U {
    return error
  }

  unwrapErrOrElse<U>(fn: () => U): U {
    return fn()
  }

  _unwrap(): T {
    return this.value
  }

  _unwrapErr(): never {
    throw new Error('Tried unwrapping an Ok value as an error.')
  }

  toString(): string {
    return `Ok(${toString(this.value)})`
  }

  toJSON(): string {
    return JSON.stringify(this.value)
  }
}

export class Err<E> implements BaseResult<never, E> {
  constructor(private error: E) {}

  [Symbol.iterator](): Iterator<never> {
    return {
      next() {
        return { done: true, value: undefined! }
      },
    }
  }

  /**
   * Returns the error contained within the result. This method only works if the result is an `Err` value.
   *
   * @returns The error contained within the result.
   * @example
   * ```ts
   * const opt: Result<number, Error> = err(new Error('An error occurred'))
   *
   * if (opt.isErr()) {
   *  opt.inner() // Error
   * }
   * ```
   */
  inner(): E {
    return this.error
  }

  isOk(): this is Ok<never> {
    return false
  }

  isOkAnd(_fn: (value: never) => boolean): this is Ok<never> {
    return false
  }

  isErr(): this is Err<E> {
    return true
  }

  isErrAnd(fn: (error: E) => boolean): this is Err<E> {
    return fn(this.error)
  }

  map<U>(_fn: (value: never) => U): Err<E> {
    return this
  }

  mapAsync<U>(_fn: (value: never) => Promise<U>): ResultAsync<never, E> {
    return new ResultAsync(Promise.resolve(this))
  }

  mapErr<U>(fn: (error: E) => U): Err<U> {
    return err(fn(this.error))
  }

  mapErrAsync<U>(fn: (error: E) => Promise<U>): ResultAsync<never, U> {
    return errAsync(fn(this.error))
  }

  andThen<T2, E2>(_fn: (value: never) => Result<T2, E2>): Err<E> {
    return this
  }

  andThenAsync<T2, E2>(
    _fn: (value: never) => Promise<Result<T2, E2>>,
  ): ResultAsync<never, E> {
    return new ResultAsync(Promise.resolve(this))
  }

  orElse<T2, E2>(fn: (error: E) => Result<T2, E2>): Result<T2, E2> {
    return fn(this.error)
  }

  orElseAsync<T2, E2>(
    fn: (error: E) => Promise<Result<T2, E2>>,
  ): ResultAsync<T2, E2> {
    return new ResultAsync(fn(this.error))
  }

  match<U>(matcher: { ok: (value: never) => U; err: (error: E) => U }): U {
    return matcher.err(this.error)
  }

  ok(): Option<never> {
    return none()
  }

  err(): Some<E> {
    return some(this.error)
  }

  unwrapOr<U>(value: U): U {
    return value
  }

  unwrapOrElse<U>(fn: () => U): U {
    return fn()
  }

  unwrapErrOr(_error: unknown): E {
    return this.error
  }

  unwrapErrOrElse(_fn: () => unknown): E {
    return this.error
  }

  _unwrap(): never {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw this.error
  }

  _unwrapErr(): E {
    return this.error
  }

  toString(): string {
    return `Err(${toString(this.error)})`
  }

  toJSON(): string {
    return 'null'
  }
}

/**
 * Creates a new Ok result. This function is a shorthand for `new Ok(value)`.
 *
 * @param value The value to wrap in an Ok result.
 * @returns A new Ok result containing the provided value.
 * @example
 * ```ts
 * const result: Result<number, Error> = ok(1)
 * ```
 */
export function ok(): Ok<Unit>
export function ok<T>(value: T): Ok<T>
export function ok(value: unknown = unit()) {
  return new Ok(value)
}

/**
 * Creates a new Err result. This function is a shorthand for `new Err(error)`.
 *
 * @param error The error to wrap in an Err result.
 * @returns A new Err result containing the provided error.
 * @example
 * ```ts
 * const result: Result<number, Error> = err(new Error('An error occurred'))
 * ```
 */
export function err(): Err<Unit>
export function err<E>(error: E): Err<E>
export function err(error: unknown = unit()) {
  return new Err(error)
}

/**
 * A tagged union type representing a result that can be either an Ok value or an Err value.
 * This type is used to represent the result of an operation that can fail.
 */
export type Result<T, E> = Ok<T> | Err<E>

type ArrayLike<T> = Array<T> | ReadonlyArray<T>
type ResultAsyncLike<T, E> = Promise<Result<T, E>> | ResultAsync<T, E>

type ResultArray<T = any, E = any> = ArrayLike<Result<T, E>>
type ResultAsyncArray<T = any, E = any> = ArrayLike<
  ResultAsyncLike<T, E> | Result<T, E>
>

type OkType<T extends Result<any, any> | ResultAsyncLike<any, any>> =
  T extends Ok<infer U>
    ? U
    : T extends ResultAsyncLike<infer U, any>
      ? U
      : never
type ErrType<T extends Result<any, any> | ResultAsyncLike<any, any>> =
  T extends Err<infer U>
    ? U
    : T extends ResultAsyncLike<any, infer U>
      ? U
      : never

type OkTypes<T extends ResultAsyncArray> = {
  [K in keyof T]: OkType<T[K]>
}
type ErrTypes<T extends ResultAsyncArray> = {
  [K in keyof T]: ErrType<T[K]>
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Result {
  export function fromOr<T, E>(
    data: T | null | undefined,
    error: E,
  ): Result<T, E> {
    return data === null || data === undefined ? err(error) : ok(data)
  }

  export function fromOrAsync<T, E>(
    data: Promise<T | null | undefined>,
    error: E,
  ): ResultAsync<T, E> {
    return new ResultAsync(data.then((d) => fromOr(d, error)))
  }

  export function fromOrElse<T, E>(
    data: T | null | undefined,
    error: () => Result<T, E>,
  ): Result<T, E> {
    return data === null || data === undefined ? error() : ok(data)
  }

  export function fromOrElseAsync<T, E>(
    data: Promise<T | null | undefined>,
    error: () => Result<T, E>,
  ): ResultAsync<T, E> {
    return new ResultAsync(data.then((d) => fromOrElse(d, error)))
  }

  export function wrap<T>(fn: () => T): Result<T, unknown> {
    try {
      return ok(fn())
    } catch (error) {
      return err(error)
    }
  }

  export function wrapAsync<T>(fn: () => Promise<T>): ResultAsync<T, unknown> {
    return new ResultAsync(
      (async () => {
        try {
          return ok(await fn())
        } catch (error) {
          return err(error)
        }
      })(),
    )
  }

  export function wrapOr<T, E>(fn: () => T, error: E): Result<T, E> {
    try {
      return ok(fn())
    } catch {
      return err(error)
    }
  }

  export function wrapOrAsync<T, E>(
    fn: () => T | Promise<T>,
    error: E,
  ): ResultAsync<T, E> {
    return new ResultAsync(
      (async () => {
        try {
          return ok(await fn())
        } catch {
          return err(error)
        }
      })(),
    )
  }

  export function wrapOrElse<T, E>(
    fn: () => T,
    error: (error: unknown) => Result<T, E>,
  ): Result<T, E> {
    try {
      return ok(fn())
    } catch (e) {
      return error(e)
    }
  }

  export function wrapOrElseAsync<T, E>(
    fn: () => T | Promise<T>,
    error: (error: unknown) => Result<T, E>,
  ): ResultAsync<T, E> {
    return new ResultAsync(
      (async () => {
        try {
          return ok(await fn())
        } catch (e) {
          return error(e)
        }
      })(),
    )
  }

  export function all<T extends ResultArray>(
    ...results: T
  ): Result<OkTypes<T>, ErrTypes<T>[number]> {
    const okValues = []

    for (const result of results) {
      if (result.isErr()) {
        return result
      }

      okValues.push(result.inner())
    }

    return ok(okValues as OkTypes<T>)
  }

  export function allAsync<T extends ResultAsyncArray>(
    ...results: T
  ): ResultAsync<OkTypes<T>, ErrTypes<T>[number]> {
    return new ResultAsync(
      (async () => {
        const okValues = []

        for (const result of results) {
          const res = await result

          if (res.isErr()) {
            return result
          }

          okValues.push(res.inner())
        }

        return ok(okValues as OkTypes<T>)
      })(),
    )
  }

  export function any<T extends ResultArray>(
    ...results: T
  ): Result<OkTypes<T>[number], ErrTypes<T>> {
    const errValues = []

    for (const result of results) {
      if (result.isOk()) {
        return result
      }

      errValues.push(result.inner())
    }

    return err(errValues as ErrTypes<T>)
  }

  export function anyAsync<T extends ResultAsyncArray>(
    ...results: T
  ): ResultAsync<OkTypes<T>[number], ErrTypes<T>> {
    return new ResultAsync(
      (async () => {
        const errValues = []

        for (const result of results) {
          const res = await result

          if (res.isOk()) {
            return result
          }

          errValues.push(res.inner())
        }

        return err(errValues as ErrTypes<T>)
      })(),
    )
  }
}
