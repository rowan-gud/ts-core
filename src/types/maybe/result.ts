import { toString } from '@/utils';

import type { Unit } from '../unit';
import type { Option, Some } from './option';

import { unit } from '../unit';
import { none, some } from './option';
import { errAsync, okAsync, ResultAsync } from './result-async';

export interface BaseResult<T, E>
  extends Iterable<T extends Iterable<infer U> ? U : never> {
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
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _unwrap(): T;

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
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _unwrapErr(): E;

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
  andThen<T2, E2>(fn: (value: T) => Result<T2, E2>): Result<T2, E | E2>;

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
  ): ResultAsync<T2, E | E2>;

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
  err(): Option<E>;

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
  isErr(): this is Err<E>;

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
  isOk(): this is Ok<T>;

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
  ): this is Ok<R>;

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
  map<U>(fn: (value: T) => U): Result<U, E>;

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
  mapAsync<U>(fn: (value: T) => Promise<U>): ResultAsync<U, E>;

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
  mapErr<U>(fn: (error: E) => U): Result<T, U>;

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
  mapErrAsync<U>(fn: (error: E) => Promise<U>): ResultAsync<T, U>;

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
  match<U>(matcher: { err(error: E): U; ok(value: T): U }): U;

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
  ok(): Option<T>;

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
  orElse<T2, E2>(fn: (error: E) => Result<T2, E2>): Result<T | T2, E2>;

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
  ): ResultAsync<T | T2, E2>;

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
  toJSON(): string;

  toString(): string;

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
  unwrapErrOr<U>(error: U): E | U;

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
  unwrapErrOrElse<U>(fn: () => U): E | U;

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
  unwrapOr<U>(value: U): T | U;

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
  unwrapOrElse<U>(fn: () => U): T | U;
}

/**
 * A tagged union type representing a result that can be either an Ok value or an Err value.
 * This type is used to represent the result of an operation that can fail.
 */
export type Result<T, E> = Err<E> | Ok<T>;

type ArrayLike<T> = readonly T[] | T[];

type ErrType<T extends Result<any, any> | ResultAsyncLike<any, any>> =
  T extends Err<infer U>
    ? U
    : T extends ResultAsyncLike<any, infer U>
      ? U
      : never;
type ErrTypes<T extends ResultAsyncArray> = {
  [K in keyof T]: ErrType<T[K]>;
};
type OkType<T extends Result<any, any> | ResultAsyncLike<any, any>> =
  T extends Ok<infer U>
    ? U
    : T extends ResultAsyncLike<infer U, any>
      ? U
      : never;

type OkTypes<T extends ResultAsyncArray> = {
  [K in keyof T]: OkType<T[K]>;
};
type ResultArray<T = any, E = any> = ArrayLike<Result<T, E>>;
type ResultAsyncArray<T = any, E = any> = ArrayLike<
  Result<T, E> | ResultAsyncLike<T, E>
>;

type ResultAsyncLike<T, E> = Promise<Result<T, E>> | ResultAsync<T, E>;

export class Err<E> implements BaseResult<never, E> {
  public static new<E>(error: E): Err<E> {
    const result = new Err(error);
    Object.freeze(result);

    return result;
  }

  private constructor(private readonly error: E) {}

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public _unwrap(): never {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw this.error;
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public _unwrapErr(): E {
    return this.error;
  }

  public andThen<T2, E2>(_fn: (value: never) => Result<T2, E2>): Err<E> {
    return this;
  }

  public andThenAsync<T2, E2>(
    _fn: (value: never) => Promise<Result<T2, E2>>,
  ): ResultAsync<never, E> {
    return new ResultAsync(Promise.resolve(this));
  }

  public err(): Some<E> {
    return some(this.error);
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
  public inner(): E {
    return this.error;
  }

  public isErr(): this is Err<E> {
    return true;
  }

  public isErrAnd(fn: (error: E) => boolean): this is Err<E> {
    return fn(this.error);
  }

  public isOk(): this is Ok<never> {
    return false;
  }

  public isOkAnd(_fn: (value: never) => boolean): this is Ok<never> {
    return false;
  }

  public map(_fn: (value: never) => unknown): Err<E> {
    return this;
  }

  public mapAsync<U>(_fn: (value: never) => Promise<U>): ResultAsync<never, E> {
    return new ResultAsync(Promise.resolve(this));
  }

  public mapErr<U>(fn: (error: E) => U): Err<U> {
    return err(fn(this.error));
  }

  public mapErrAsync<U>(fn: (error: E) => Promise<U>): ResultAsync<never, U> {
    return errAsync(fn(this.error));
  }

  public match<U>(matcher: { err(error: E): U; ok(value: never): U }): U {
    return matcher.err(this.error);
  }

  public ok(): Option<never> {
    return none();
  }

  public orElse<T2, E2>(fn: (error: E) => Result<T2, E2>): Result<T2, E2> {
    return fn(this.error);
  }

  public orElseAsync<T2, E2>(
    fn: (error: E) => Promise<Result<T2, E2>>,
  ): ResultAsync<T2, E2> {
    return new ResultAsync(fn(this.error));
  }

  public [Symbol.iterator](): Iterator<never> {
    return {
      next() {
        return { done: true, value: undefined };
      },
    };
  }

  public toJSON(): string {
    return 'null';
  }

  public toString(): string {
    return `Err(${toString(this.error)})`;
  }

  public unwrapErrOr(_error: unknown): E {
    return this.error;
  }

  public unwrapErrOrElse(_fn: () => unknown): E {
    return this.error;
  }

  public unwrapOr<U>(value: U): U {
    return value;
  }

  public unwrapOrElse<U>(fn: () => U): U {
    return fn();
  }
}
export class Ok<T> implements BaseResult<T, never> {
  public static new<T>(value: T): Ok<T> {
    const result = new Ok(value);
    Object.freeze(result);

    return result;
  }

  private constructor(private readonly value: T) {}

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public _unwrap(): T {
    return this.value;
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public _unwrapErr(): never {
    throw new Error('Tried unwrapping an Ok value as an error.');
  }

  public andThen<T2, E2>(fn: (value: T) => Result<T2, E2>): Result<T2, E2> {
    return fn(this.value);
  }

  public andThenAsync<T2, E2>(
    fn: (value: T) => Promise<Result<T2, E2>>,
  ): ResultAsync<T2, E2> {
    return new ResultAsync(fn(this.value));
  }

  public err(): Option<never> {
    return none();
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
  public inner(): T {
    return this.value;
  }

  public isErr(): this is Err<never> {
    return false;
  }

  public isOk(): this is Ok<T> {
    return true;
  }

  public isOkAnd<R extends T = T>(
    fn: ((value: T) => boolean) | ((value: T) => value is R),
  ): this is Ok<R> {
    return fn(this.value);
  }

  public map<U>(fn: (value: T) => U): Ok<U> {
    return ok(fn(this.value));
  }

  public mapAsync<U>(fn: (value: T) => Promise<U>): ResultAsync<U, never> {
    return okAsync(fn(this.value));
  }

  public mapErr(_fn: (error: never) => unknown): Ok<T> {
    return this;
  }

  public mapErrAsync<U>(
    _fn: (error: never) => Promise<U>,
  ): ResultAsync<T, never> {
    return new ResultAsync(Promise.resolve(this));
  }

  public match<U>(matcher: { err(error: never): U; ok(value: T): U }): U {
    return matcher.ok(this.value);
  }

  public ok(): Some<T> {
    return some(this.value);
  }

  public orElse<T2, E2>(
    _fn: (error: never) => Result<T2, E2>,
  ): Result<T | T2, E2> {
    return this;
  }

  public orElseAsync<T2, E2>(
    _fn: (error: never) => Promise<Result<T2, E2>>,
  ): ResultAsync<T | T2, E2> {
    return new ResultAsync(Promise.resolve(this));
  }

  public [Symbol.iterator](): Iterator<
    T extends Iterable<infer U> ? U : never
  > {
    const obj = Object(this.value) as Iterable<any>;

    if (Symbol.iterator in obj) {
      return obj[Symbol.iterator]() as Iterator<
        T extends Iterable<infer U> ? U : never
      >;
    }

    return {
      next() {
        return { done: true, value: undefined };
      },
    };
  }

  public toJSON(): string {
    return JSON.stringify(this.value);
  }

  public toString(): string {
    return `Ok(${toString(this.value)})`;
  }

  public unwrapErrOr<U>(error: U): U {
    return error;
  }

  public unwrapErrOrElse<U>(fn: () => U): U {
    return fn();
  }

  public unwrapOr(_value: unknown): T {
    return this.value;
  }

  public unwrapOrElse(_fn: () => unknown): T {
    return this.value;
  }
}

export function err(): Err<Unit>;
export function err<E>(error: E): Err<E>;
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
export function err(error: unknown = unit()) {
  return Err.new(error);
}

export function ok(): Ok<Unit>;
export function ok<T>(value: T): Ok<T>;
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
export function ok(value: unknown = unit()) {
  return Ok.new(value);
}

export namespace Result {
  /**
   * Create a new result by combining the provided results. If all results are Ok values, a new Ok
   * result is returned containing the values of the provided results. If any of the results are Err
   * values, the first Err value is returned.
   *
   * @param results The results to combine into a new result.
   * @returns A new Ok result if all results are Ok values, otherwise a new Err result.
   * @example
   * ```ts
   * const result: Result<number[], Error> = all(ok(1), ok(2), ok(3))
   * const result2: Result<number[], Error> = all(ok(1), err(new Error('An error occurred')), ok(3))
   *
   * result // Ok<number[]>
   * result2 // Err<Error>
   * ```
   */
  export function all<T extends ResultArray>(
    ...results: T
  ): Result<OkTypes<T>, ErrTypes<T>[number]> {
    const okValues = [];

    for (const result of results) {
      if (result.isErr()) {
        return result;
      }

      okValues.push(result.inner());
    }

    return ok(okValues as OkTypes<T>);
  }

  /**
   * Create a new result by combining the provided result promises. If all results are Ok values, a new Ok
   * result is returned containing the values of the provided results. If any of the results are Err
   * values, the first Err value is returned.
   *
   * @param results The results to combine into a new result.
   * @returns A new Ok result if all results are Ok values, otherwise a new Err result.
   * @example
   * ```ts
   * const result: ResultAsync<number[], Error> = allAsync(
   *   Promise.resolve(ok(1)),
   *   Promise.resolve(ok(2)),
   *   Promise.resolve(ok(3)),
   * )
   * const result2: ResultAsync<number[], Error> = allAsync(
   *   Promise.resolve(ok(1)),
   *   Promise.resolve(err(new Error('An error occurred'))),
   *   Promise.resolve(ok(3)),
   * )
   *
   * result // ResultAsync<[number, number, number], Error>
   * result2 // ResultAsync<[number, number, number], Error>
   * ```
   */
  export function allAsync<T extends ResultAsyncArray>(
    ...results: T
  ): ResultAsync<OkTypes<T>, ErrTypes<T>[number]> {
    return new ResultAsync(
      (async () => {
        const okValues = [];

        for (const result of results) {
          // eslint-disable-next-line no-await-in-loop
          const res = (await result) as Result<OkTypes<T>, ErrTypes<T>[number]>;

          if (res.isErr()) {
            return res;
          }

          okValues.push(res.inner());
        }

        return ok(okValues as OkTypes<T>);
      })(),
    );
  }

  /**
   * Create a new result by combining the provided results. If any of the results are Ok values, a new Ok
   * result is returned containing the first Ok value. If all results are Err values, a new Err result is
   * returned containing the errors of the provided results.
   *
   * @param results The results to combine into a new result.
   * @returns A new Ok result if any of the results are Ok values, otherwise a new Err result.
   * @example
   * ```ts
   * const result: Result<number, Error[]> = any(ok(1), ok(2), ok(3))
   * const result2: Result<number, Error[]> = any(ok(1), err(new Error('An error occurred')), ok(3))
   *
   * result // Ok<number> (1)
   * result2 // Ok<number> (1)
   * ```
   */
  export function any<T extends ResultArray>(
    ...results: T
  ): Result<OkTypes<T>[number], ErrTypes<T>> {
    const errValues = [];

    for (const result of results) {
      if (result.isOk()) {
        return result;
      }

      errValues.push(result.inner());
    }

    return err(errValues as ErrTypes<T>);
  }

  /**
   * Create a new result by combining the provided result promises. If any of the results are Ok values, a new Ok
   * result is returned containing the first Ok value. If all results are Err values, a new Err result is
   * returned containing the errors of the provided results.
   *
   * @param results The results to combine into a new result.
   * @returns A new Ok result if any of the results are Ok values, otherwise a new Err result.
   * @example
   * ```ts
   * const result: ResultAsync<number, Error[]> = anyAsync(
   *   Promise.resolve(ok(1)),
   *   Promise.resolve(ok(2)),
   *   Promise.resolve(ok(3)),
   * )
   * const result2: ResultAsync<number, Error[]> = anyAsync(
   *   Promise.resolve(ok(1)),
   *   Promise.resolve(err(new Error('An error occurred'))),
   *   Promise.resolve(ok(3)),
   * )
   *
   * result // Ok<number> (1)
   * result2 // Ok<number> (1)
   * ```
   */
  export function anyAsync<T extends ResultAsyncArray>(
    ...results: T
  ): ResultAsync<OkTypes<T>[number], ErrTypes<T>> {
    return new ResultAsync(
      (async () => {
        const errValues = [];

        for (const result of results) {
          // eslint-disable-next-line no-await-in-loop
          const res = (await result) as Result<OkTypes<T>[number], ErrTypes<T>>;

          if (res.isOk()) {
            return res;
          }

          errValues.push(res.inner());
        }

        return err(errValues as ErrTypes<T>);
      })(),
    );
  }

  /**
   * Create a new Ok result if the value is not null or undefined, otherwise create a new Err
   * result with the provided error.
   *
   * @param data The value to wrap in an Ok result if it is not null or undefined.
   * @param error The error to wrap in an Err result if the value is null or undefined.
   * @returns A new Ok result if the value is not null or undefined, otherwise a new Err result.
   * @example
   * ```ts
   * const result: Result<number, Error> = fromOr(1, new Error('Value is null or undefined'))
   *
   * result // Ok<number>
   * ```
   */
  export function fromOr<T, E>(
    data: null | Result<T, unknown> | T | undefined,
    error: E,
  ): Result<T, E> {
    if (data instanceof Ok) {
      return data;
    }

    if (data instanceof Err) {
      return err(error);
    }

    return data === null || data === undefined ? err(error) : ok(data);
  }

  /**
   * Create a new Ok result if the value resolves to something that is not null or undefined,
   * otherwise create a new Err result with the provided error.
   *
   * @param data The value to wrap in an Ok result if it is not null or undefined.
   * @param error The error to wrap in an Err result if the value is null or undefined.
   * @returns A new Ok result if the value is not null or undefined, otherwise a new Err result.
   * @example
   * ```ts
   * const result: ResultAsync<number, Error> = fromOrAsync(Promise.resolve(1), new Error('Value is null or undefined'))
   *
   * result // ResultAsync<number, Error>
   * ```
   */
  export function fromOrAsync<T, E>(
    data:
      | Promise<null | Result<T, unknown> | T | undefined>
      | ResultAsync<T, unknown>,
    error: E,
  ): ResultAsync<T, E> {
    if (data instanceof ResultAsync) {
      return data.mapErr(() => error);
    }

    return new ResultAsync(data.then((d) => fromOr(d, error)));
  }

  /**
   * Create a new Ok result if the value is not null or undefined, otherwise create a new Err
   * result by calling the provided function.
   *
   * @param data The value to wrap in an Ok result if it is not null or undefined.
   * @param error The function to call to create the error if the value is null or undefined.
   * @returns A new Ok result if the value is not null or undefined, otherwise a new Err result.
   * @example
   * ```ts
   * const result: Result<number, Error> = fromOrElse(1, () => new Error('Value is null or undefined'))
   *
   * result // Ok<number>
   * ```
   */
  export function fromOrElse<T, E>(
    data: null | Result<T, unknown> | T | undefined,
    error: () => Result<T, E>,
  ): Result<T, E> {
    if (data instanceof Ok) {
      return data;
    }

    if (data instanceof Err) {
      return error();
    }

    return data === null || data === undefined ? error() : ok(data);
  }

  /**
   * Create a new Ok result if the value resolves to something that is not null or undefined,
   * otherwise create a new Err result by calling the provided function.
   *
   * @param data The value to wrap in an Ok result if it is not null or undefined.
   * @param error The function to call to create the error if the value is null or undefined.
   * @returns A new Ok result if the value is not null or undefined, otherwise a new Err result.
   * @example
   * ```ts
   * const result: ResultAsync<number, Error> = fromOrElseAsync(Promise.resolve(1), () => new Error('Value is null or undefined'))
   *
   * result // ResultAsync<number, Error>
   * ```
   */
  export function fromOrElseAsync<T, E>(
    data:
      | Promise<null | Result<T, unknown> | T | undefined>
      | ResultAsync<T, unknown>,
    error: () => Result<T, E>,
  ): ResultAsync<T, E> {
    if (data instanceof ResultAsync) {
      return data.orElse(() => error());
    }

    return new ResultAsync(data.then((d) => fromOrElse(d, error)));
  }

  /**
   * Try to execute the provided function and wrap the result in an Ok value if it succeeds or
   * in an Err value containing that error if it throws an error.
   *
   * @param fn The function to execute and wrap in a result.
   * @returns A new Ok result if the function succeeds, otherwise a new Err result.
   * @example
   * ```ts
   * const result: Result<number, Error> = wrap(() => 1)
   *
   * result // Ok<number>
   * ```
   */
  export function wrap<T>(fn: () => T): Result<T, unknown> {
    try {
      return ok(fn());
    } catch (error) {
      return err(error);
    }
  }

  /**
   * Try to execute the provided async function and wrap the result in an Ok value if it succeeds or
   * in an Err value containing that error if it throws an error.
   *
   * @param fn The function to execute and wrap in a result.
   * @returns A new Ok result if the function succeeds, otherwise a new Err result.
   * @example
   * ```ts
   * const result: ResultAsync<number, Error> = wrapAsync(async () => 1) *
   *
   * result // ResultAsync<number>
   * ```
   */
  export function wrapAsync<T>(fn: () => Promise<T>): ResultAsync<T, unknown> {
    return new ResultAsync(
      (async () => {
        try {
          return ok(await fn());
        } catch (error) {
          return err(error);
        }
      })(),
    );
  }

  /**
   * Try to execute the provided function and wrap the result in an Ok value if it succeeds or
   * in an Err value of the provided error if it throws an error.
   *
   * @param fn The function to execute and wrap in a result.
   * @param error The error to wrap in an Err result if the function throws an error.
   * @returns A new Ok result if the function succeeds, otherwise a new Err result.
   * @example
   * ```ts
   * const result: Result<number, Error> = wrapOr(() => 1, new Error('An error occurred'))
   *
   * result // Ok<number>
   * ```
   */
  export function wrapOr<T, E>(fn: () => T, error: E): Result<T, E> {
    try {
      return ok(fn());
    } catch {
      return err(error);
    }
  }

  /**
   * Try to execute the provided async function and wrap the result in an Ok value if it succeeds or
   * in an Err value of the provided error if it throws an error.
   *
   * @param fn The function to execute and wrap in a result.
   * @param error The error to wrap in an Err result if the function throws an error.
   * @returns A new Ok result if the function succeeds, otherwise a new Err result.
   * @example
   * ```ts
   * const result: ResultAsync<number, Error> = wrapOrAsync(() => Promise.resolve(1), new Error('An error occurred'))
   *
   * result // ResultAsync<number, Error>
   * ```
   */
  export function wrapOrAsync<T, E>(
    fn: () => Promise<T> | T,
    error: E,
  ): ResultAsync<T, E> {
    return new ResultAsync(
      (async () => {
        try {
          return ok(await fn());
        } catch {
          return err(error);
        }
      })(),
    );
  }

  /**
   * Try to execute the provided function and wrap the result in an Ok value if it succeeds or
   * in an Err value created from calling the provided function with the error if it throws an error.
   *
   * @param fn The function to execute and wrap in a result.
   * @param error The function to call to create the error if the function throws an error.
   * @returns A new Ok result if the function succeeds, otherwise a new Err result.
   * @example
   * ```ts
   * const result: Result<number, Error> = wrapOrElse(() => 1, error => err(error))
   *
   * result // Ok<number>
   * ```
   */
  export function wrapOrElse<T, E>(
    fn: () => T,
    error: (error: unknown) => Result<T, E>,
  ): Result<T, E> {
    try {
      return ok(fn());
    } catch (e) {
      return error(e);
    }
  }

  /**
   * Try to execute the provided async function and wrap the result in an Ok value if it succeeds or
   * in an Err value created from calling the provided function with the error if it throws an error.
   *
   * @param fn The function to execute and wrap in a result.
   * @param error The function to call to create the error if the function throws an error.
   * @returns A new Ok result if the function succeeds, otherwise a new Err result.
   * @example
   * ```ts
   * const result: ResultAsync<number, Error> = wrapOrElseAsync(() => Promise.resolve(1), error => err(error))
   *
   * result // ResultAsync<number, Error>
   * ```
   */
  export function wrapOrElseAsync<T, E>(
    fn: () => Promise<T> | T,
    error: (error: unknown) => Result<T, E>,
  ): ResultAsync<T, E> {
    return new ResultAsync(
      (async () => {
        try {
          return ok(await fn());
        } catch (e) {
          return error(e);
        }
      })(),
    );
  }
}
