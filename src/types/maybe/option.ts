/**
 * @file Defines the `Option` type and its associated methods.
 * @author Rowan Gudmundsson
 * @since 1.0.0
 */
import { toString } from '@/utils';

import type { Unit } from '../unit';
import type { Err, Ok, Result } from './result';

import { unit } from '../unit';
import { noneAsync, OptionAsync, someAsync } from './option-async';
import { err, ok } from './result';

export const OPTION_SYMBOL = Symbol('Option');

export interface BaseOption<T>
  extends Iterable<T extends Iterable<infer U> ? U : never> {
  readonly [OPTION_SYMBOL]: 'None' | 'Some';

  /**
   * WARN: This method is unsafe and can throw an error if the option is a `None` value.
   * This method should only be used in tests. Use {@link unwrapOr} or {@link unwrapOrElse} instead to provide
   * a default value. If you are sure that the option is a `Some` value, use the {@link Some.prototype.inner} method instead.
   *
   * Unwraps the option and returns the value if it is a `Some` value. If the option is a `None` value,
   * an error is thrown.
   *
   * @returns The value if the option is a `Some` value.
   * @throws An error if the option is a `None` value.
   * @example
   * ```ts
   * const someValue = some(1)
   * const noneValue = none()
   *
   * someValue._unwrap() // 1
   * noneValue._unwrap() // Error: Attempted to unwrap none option
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _unwrap(): T;

  /**
   * Transforms the option into a new option by applying the given function to
   * the value contained within the option if it is a `Some` value. If the option
   * is a `None` value, the function is not applied and a `None` value is returned.
   * The function must return an option.
   *
   * @param fn The function to apply to the value.
   * @returns A new option containing the transformed value if the option is a
   * `Some` value, otherwise a `None` value.
   * @example
   * ```ts
   * const someValue = some(1)
   * const noneValue = none()
   *
   * function good(value: number): Option<number> {
   *  return some(value + 1)
   * }
   *
   * function bad(value: number): Option<number> {
   * return none()
   * }
   *
   * someValue.andThen(good) // Some(2)
   * someValue.andThen(bad) // None
   * noneValue.andThen(good) // None
   * ```
   */
  andThen<U>(fn: (value: T) => Option<U>): Option<U>;

  /**
   * Transforms the option into a new option by applying the given function to
   * the value contained within the option if it is a `Some` value. If the option
   * is a `None` value, the function is not applied and a `None` value is returned.
   * The function must return a promise.
   *
   * @param fn The function to apply to the value.
   * @returns A new option containing the transformed value if the option
   * is a `Some` value, otherwise a `None` value.
   * @example
   * ```ts
   * const someValue = some(1)
   * const noneValue = none()
   *
   * async function good(value: number): Promise<Option<number>> {
   * return some(value + 1)
   * }
   *
   * async function bad(value: number): Promise<Option<number>> {
   * return none()
   * }
   *
   * await someValue.andThenAsync(good).andThen((v) => v + 1) // Some(3)
   * await someValue.andThenAsync(bad) // None
   * await noneValue.andThenAsync(good) // None
   * ```
   */
  andThenAsync<U>(fn: (value: T) => Promise<Option<U>>): OptionAsync<U>;

  /**
   * Returns true if the option is a `None` value and narrows the type accordingly.
   *
   * @returns True if the option is a `None` value, false otherwise.
   * @example
   * ```ts
   * const noneValue: Option<number> = none()
   *
   * if (noneValue.isNone()) {
   *  noneValue // None
   * } else {
   *  noneValue // Some<number>
   * }
   * ```
   */
  isNone(): this is None;

  /**
   * Returns true if the option is a `Some` value and narrows the type accordingly.
   *
   * @returns True if the option is a `Some` value, false otherwise.
   * @example
   * ```ts
   * const someValue: Option<number> = some(1)
   *
   * if (someValue.isSome()) {
   *  someValue // Some<number>
   * } else {
   *  someValue // None
   * }
   * ```
   */
  isSome(): this is Some<T>;

  /**
   * Transforms the option into a new option by applying the given function to
   * the value contained within the option if it is a `Some` value. If the option
   * is a `None` value, the function is not applied and a `None` value is returned.
   *
   * @param fn The function to apply to the value.
   * @returns A new option containing the transformed value if the option is a
   * `Some` value, otherwise a `None` value.
   * @example
   * ```ts
   * const someValue = some(1)
   * const noneValue = none()
   *
   * someValue.map((value) => value + 1) // Some(2)
   * noneValue.map((value) => value + 1) // None
   * ```
   */
  map<U>(fn: (value: T) => U): Option<U>;

  /**
   * Transforms the option into a new option by applying the given function to
   * the value contained within the option if it is a `Some` value. If the option
   * is a `None` value, the function is not applied and a `None` value is returned.
   * The function must return a promise.
   *
   * @param fn The function to apply to the value.
   * @returns A new option containing the transformed value if the option is a
   * `Some` value, otherwise a `None` value.
   * @example
   * ```ts
   * const someValue = some(1)
   * const noneValue = none()
   *
   * await someValue.mapAsync((value) => Promise.resolve(value + 1)) // Some(2)
   * await noneValue.mapAsync((value) => Promise.resolve(value + 1)) // None
   * ```
   */
  mapAsync<U>(fn: (value: T) => Promise<U>): OptionAsync<U>;

  /**
   * Matches the option against the given matcher object and returns the result. If the
   * option is a `Some` value, the `some` function is called with the value. If the option
   * is a `None` value, the `none` function is called.
   *
   * @param matcher The matcher object containing the `some` and `none` functions.
   * @param matcher.some The function to call if the option is a `Some` value.
   * @param matcher.none The function to call if the option is a `None` value.
   * @returns The result of the `some` or `none` function.
   * @example
   * ```ts
   * const someValue = some(1)
   * const noneValue = none()
   *
   * someValue.match({
   *  some: (value) => value + 1,
   *  none: () => 0,
   * }) // 2
   *
   * noneValue.match({
   *  some: (value) => value + 1,
   *  none: () => 0,
   * }) // 0
   * ```
   */
  match<U>(matcher: { none(): U; some(value: T): U }): U;

  /**
   * Transforms the option into a `Result` by either wrapping the value in an `Ok` if the
   * option is a `Some` value or an `Err` if the option is a `None` value. The error value
   * is provided as an argument.
   *
   * @param error The error value to use if the option is a `None` value.
   * @returns A {@link Result} containing the value if the option is a `Some` value, otherwise an `Err`.
   * @see Result for more information
   * @example
   * ```ts
   * const someValue = some(1)
   * const noneValue = none()
   *
   * someValue.okOr('error') // Ok(1)
   * noneValue.okOr('error') // Err('error')
   * ```
   */
  okOr<E>(error: E): Result<T, E>;

  /**
   * Transforms the option into a `Result` by either wrapping the value in an `Ok` if the
   * option is a `Some` value or an `Err` if the option is a `None` value. The error value
   * is provided by calling the given function.
   *
   * @param fn The function to call to get the error value if the option is a `None` value.
   * @returns A {@link Result} containing the value if the option is a `Some` value, otherwise an `Err`.
   * @see Result for more information
   * @example
   * ```ts
   * const someValue = some(1)
   * const noneValue = none()
   *
   * someValue.okOrElse(() => 'error') // Ok(1)
   * noneValue.okOrElse(() => 'error') // Err('error')
   * ```
   */
  okOrElse<E>(fn: () => E): Result<T, E>;

  /**
   * Returns a JSON representation of the option. This method is called by `JSON.stringify`.
   *
   * @returns A JSON representation of the option. If the option is a `Some` value, the value is returned.
   * If the option is a `None` value, `null` is returned.
   * @example
   * ```ts
   * const someValue = some(1)
   * const noneValue = none()
   *
   * JSON.stringify(someValue) // '1'
   * JSON.stringify(noneValue) // 'null'
   * ```
   */
  toJSON(): string;

  toString(): string;

  /**
   * Unwraps the option and returns the value if it is a `Some` value. If the option is a
   * `None` value, the provided value is returned instead.
   *
   * @param value The value to return if the option is a `None` value.
   * @returns The value if the option is a `Some` value, otherwise the provided value.
   * @example
   * ```ts
   * const someValue = some(1)
   * const noneValue = none()
   *
   * someValue.unwrapOr(0) // 1
   * noneValue.unwrapOr(0) // 0
   * ```
   */
  unwrapOr<U>(value: U): T | U;

  /**
   * Unwraps the option and returns the value if it is a `Some` value. If the option is a
   * `None` value, the value is computed by calling the provided function.
   *
   * @param fn The function to call to get the value if the option is a `None` value.
   * @returns The value if the option is a `Some` value, otherwise the value computed by the function.
   * @example
   * ```ts
   * const someValue = some(1)
   * const noneValue = none()
   *
   * someValue.unwrapOrElse(() => 0) // 1
   * noneValue.unwrapOrElse(() => 0) // 0
   * ```
   */
  unwrapOrElse<U>(fn: () => U): T | U;
}

/**
 * A tagged union representing a value that may or may not be present. An `Option` is either a `Some` value
 * containing the value or a `None` value representing the absence of a value. This type is useful for handling
 * nullable values in a type-safe way.
 */
export type Option<T> = None | Some<T>;

export type Optional<T> = null | Option<T> | T | undefined;

export type OptionalAsync<T> = OptionAsync<T> | Promise<Optional<T>>;
type ArrayLike<T> = readonly T[] | T[];
type OptionArray<T = any> = ArrayLike<Option<T>>;

type OptionAsyncArray<T = any> = ArrayLike<Option<T> | OptionAsyncLike<T>>;

type OptionAsyncLike<T> = OptionAsync<T> | Promise<Option<T>>;

type SomeType<T extends Option<any> | OptionAsyncLike<any>> =
  T extends Some<infer U> ? U : T extends OptionAsyncLike<infer U> ? U : never;
type SomeTypes<T extends OptionAsyncArray> = {
  [K in keyof T]: SomeType<T[K]>;
};

export class None implements BaseOption<never> {
  public static new(): None {
    const opt = new None();
    Object.freeze(opt);

    return opt;
  }

  public readonly [OPTION_SYMBOL] = 'None' as const;

  private constructor() {}

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public _unwrap(): never {
    throw new Error('Attempted to unwrap none option');
  }

  public andThen<U>(_fn: (value: never) => Option<U>): None {
    return this;
  }

  public andThenAsync<U>(
    _fn: (value: never) => Promise<Option<U>>,
  ): OptionAsync<U> {
    return noneAsync();
  }

  public isNone(): this is None {
    return true;
  }

  public isSome(): this is Some<never> {
    return false;
  }

  public map(_fn: (value: never) => unknown): None {
    return this;
  }

  public mapAsync<U>(_fn: (value: never) => Promise<U>): OptionAsync<U> {
    return noneAsync();
  }

  public match<U>(matcher: { none(): U; some(value: never): U }): U {
    return matcher.none();
  }

  public okOr<E>(error: E): Err<E> {
    return err(error);
  }

  public okOrElse<E>(fn: () => E): Err<E> {
    return err(fn());
  }

  public [Symbol.iterator](): Iterator<never, never, any> {
    return {
      next() {
        return { done: true, value: undefined as never };
      },
    };
  }

  public toJSON(): string {
    return 'null';
  }

  public toString(): string {
    return 'None';
  }

  public unwrapOr<U>(value: U): U {
    return value;
  }

  public unwrapOrElse<U>(fn: () => U): U {
    return fn();
  }
}
export class Some<T> implements BaseOption<T> {
  public static new<T>(value: T): Some<T> {
    const opt = new Some(value);
    Object.freeze(opt);

    return opt;
  }

  public readonly [OPTION_SYMBOL] = 'Some' as const;

  private constructor(private readonly value: T) {}

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public _unwrap(): T {
    return this.value;
  }

  public andThen<U>(fn: (value: T) => Option<U>): Option<U> {
    return fn(this.value);
  }

  public andThenAsync<U>(fn: (value: T) => Promise<Option<U>>): OptionAsync<U> {
    return new OptionAsync(fn(this.value));
  }

  /**
   * Returns the value contained within the option. This method only works if the option is a `Some` value.
   *
   * @returns The value contained within the option.
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

  public isNone(): this is None {
    return false;
  }

  public isSome(): this is Some<T> {
    return true;
  }

  public map<U>(fn: (value: T) => U): Some<U> {
    return some(fn(this.value));
  }

  public mapAsync<U>(fn: (value: T) => Promise<U>): OptionAsync<U> {
    return someAsync(fn(this.value));
  }

  public match<U>(matcher: { none(): U; some(value: T): U }): U {
    return matcher.some(this.value);
  }

  public okOr(_error: unknown): Ok<T> {
    return ok(this.value);
  }

  public okOrElse(_fn: () => unknown): Ok<T> {
    return ok(this.value);
  }

  /**
   * Returns an iterator that yields the value contained within the option. This method only works if the
   * option is a `Some` value and the value is an iterable.
   *
   * @returns An iterator that yields the value contained within the option.
   * @example
   * ```ts
   * const option: Option<number[]> = some([1, 2, 3])
   * const iterator = option[Symbol.iterator]()
   *
   * iterator.next() // { done: false, value: 1 }
   * iterator.next() // { done: false, value: 2 }
   * iterator.next() // { done: false, value: 3 }
   * iterator.next() // { done: true, value: undefined }
   * ```
   */
  public [Symbol.iterator](): Iterator<
    T extends Iterable<infer U> ? U : never
  > {
    const obj = Object(this.value) as Iterable<
      T extends Iterable<infer U> ? U : never
    >;

    if (Symbol.iterator in obj) {
      return obj[Symbol.iterator]();
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
    return `Some(${toString(this.value)})`;
  }

  public unwrapOr(_value: unknown): T {
    return this.value;
  }

  public unwrapOrElse(_fn: () => unknown): T {
    return this.value;
  }
}

/**
 * Creates a new `None` option. This function is a shorthand for `new None()`.
 *
 * @returns A new {@link None} option.
 * @example
 * ```ts
 * const option: Option<number> = none()
 * ```
 */
export function none(): None {
  return None.new();
}

export function some(): Some<Unit>;
export function some<T>(value: T): Some<T>;
/**
 * Creates a new `Some` option containing the given value. This function is a shorthand for `new Some(value)`.
 *
 * @param value The value to create the `Some` option with.
 * @returns A new {@link Some} option containing the value.
 * @example
 * ```ts
 * const option: Option<number> = some(1)
 * ```
 */
export function some(value: unknown = unit()) {
  return Some.new(value);
}

export namespace Option {
  /**
   * Create an `Option` from an array of options. If all the options are `Some` values, a `Some` value containing
   * an array of the values is returned. If any of the options are `None` values, a `None` value is returned.
   *
   * @param options The array of options to create the `Option` from.
   * @returns A new {@link Some} containing an array of the values if all the options are `Some` values, otherwise a {@link None} value.
   */
  export function all<T extends OptionArray>(
    ...options: T
  ): Option<SomeTypes<T>> {
    const someValues = [];

    for (const option of options) {
      if (option.isNone()) {
        return none();
      }

      someValues.push(option.inner());
    }

    return some(someValues as SomeTypes<T>);
  }

  /**
   * Create an `Option` from an array of promises which resolve to options. If all the options are `Some` values, a `Some` value
   * containing an array of the values is returned. If any of the options are `None` values, a `None` value is returned.
   *
   * @param options The array of promises to create the `Option` from.
   * @returns A new {@link OptionAsync} wrapping the promise.
   */
  export function allAsync<T extends OptionAsyncArray>(
    ...options: T
  ): OptionAsync<SomeTypes<T>> {
    return new OptionAsync(
      (async () => {
        const someValues = [];

        for (const option of options) {
          // eslint-disable-next-line no-await-in-loop
          const opt = await option;

          if (opt.isNone()) {
            return none();
          }

          someValues.push(opt.inner());
        }

        return some(someValues as SomeTypes<T>);
      })(),
    );
  }

  /**
   * Create an `Option` from a list of options. If any of the options are `Some` values, a `Some` value containing
   * the first value is returned. If all the options are `None` values, a `None` value is returned.
   *
   * @param options The list of options to create the `Option` from.
   * @returns A new {@link Some} containing the first value if any of the options are `Some` values, otherwise a {@link None} value.
   */
  export function any<T extends OptionArray>(
    ...options: T
  ): Option<SomeTypes<T>[number]> {
    for (const option of options) {
      if (option.isSome()) {
        return option;
      }
    }

    return none();
  }

  /**
   * Create an `Option` from a list of promises which resolve to options. If any of the options are `Some` values, a `Some` value
   * containing the first value is returned. If all the options are `None` values, a `None` value is returned.
   *
   * @param options The list of promises to create the `Option` from.
   * @returns A new {@link OptionAsync} wrapping the promise.
   */
  export function anyAsync<T extends OptionAsyncArray>(
    ...options: T
  ): OptionAsync<SomeTypes<T>[number]> {
    return new OptionAsync(
      (async () => {
        for (const option of options) {
          // eslint-disable-next-line no-await-in-loop
          const opt = (await option) as Option<SomeTypes<T>[number]>;

          if (opt.isSome()) {
            return opt;
          }
        }

        return none();
      })(),
    );
  }

  /**
   * Create an `Option` from a nullable value. If the value is `null` or `undefined`, a `None` value is returned.
   * Otherwise, a `Some` value containing the value is returned.
   *
   * @param value The value to create the `Option` from.
   * @returns A new {@link Some} containing the value if it is not `null` or `undefined`, otherwise a {@link None} value.
   */
  export function from<T>(value: null | Option<T> | T | undefined): Option<T> {
    if (isOption(value)) {
      return value[OPTION_SYMBOL] === 'Some' ? value : none();
    }

    return value === undefined || value === null ? none() : some(value);
  }

  /**
   * Create an `Option` from a promise which resolves to a nullable value. If the value is `null` or `undefined`,
   * a `None` value is returned. Otherwise, a `Some` value containing the value is returned.
   *
   * @param value The promise to create the `Option` from.
   * @returns A new {@link OptionAsync} wrapping the promise.
   */
  export function fromAsync<T>(
    value: OptionAsync<T> | Promise<null | Option<T> | T | undefined>,
  ): OptionAsync<T> {
    if (isOption(value)) {
      return value;
    }

    return new OptionAsync(value.then((v) => from(v)));
  }

  /**
   * Check if the given value is an `Option`. This function returns `true` if the value is an instance of `Some` or `None`.
   *
   * @param value The value to check.
   * @returns `true` if the value is an `Option`, `false` otherwise.
   */
  export function isOption<T = unknown>(
    value: unknown,
  ): value is Option<T> | OptionAsync<T> {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    return Object.hasOwnProperty.call(value, OPTION_SYMBOL);
  }

  /**
   * Create an `Option` from a function which may throw an error. If the function throws an error, a `None` value
   * is returned. Otherwise, a `Some` value containing the value is returned.
   *
   * @param fn The function to create the `Option` from.
   * @returns A new {@link Some} containing the value if the function does not throw an error, otherwise a {@link None} value.
   */
  export function wrap<T>(fn: () => null | T | undefined): Option<T> {
    try {
      const value = fn();

      return from(value);
    } catch {
      return none();
    }
  }

  /**
   * Create an `Option` from a function which returns a promise that may reject. If the promise rejects, a `None` value
   * is returned. Otherwise, a `Some` value containing the value is returned.
   *
   * @param fn The function to create the `Option` from.
   * @returns A new {@link OptionAsync} wrapping the promise.
   */
  export function wrapAsync<T>(fn: () => Promise<T>): OptionAsync<T> {
    return new OptionAsync(
      fn()
        .then(some<T>)
        .catch(none),
    );
  }
}
