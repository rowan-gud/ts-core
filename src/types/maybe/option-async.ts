import type { Option } from './option';

import { none, some } from './option';
import { err, ok } from './result';
import { ResultAsync } from './result-async';

export class OptionAsync<T> implements PromiseLike<Option<T>> {
  constructor(private readonly option: Promise<Option<T>>) {}

  public andThen<U>(
    fn: (value: T) => Option<U> | OptionAsync<U>,
  ): OptionAsync<U> {
    return new OptionAsync(
      this.option.then(async (option) => {
        if (option.isNone()) {
          return none();
        }

        const res = fn(option.inner());

        if (res instanceof OptionAsync) {
          return await res.option;
        }

        return res;
      }),
    );
  }

  public async isNone(): Promise<boolean> {
    return (await this.option).isNone();
  }

  public async isSome(): Promise<boolean> {
    return (await this.option).isSome();
  }

  public map<U>(fn: (value: T) => Promise<U> | U): OptionAsync<U> {
    return new OptionAsync(
      this.option.then(async (option) => {
        if (option.isNone()) {
          return none();
        }

        return some(await fn(option.inner()));
      }),
    );
  }

  public async match<U>(matcher: { none(): U; some(value: T): U }): Promise<U> {
    return (await this.option).match(matcher);
  }

  public okOr<E>(error: E): ResultAsync<T, E> {
    return new ResultAsync(
      this.option.then((option) => {
        if (option.isNone()) {
          return err(error);
        }

        return ok(option.inner());
      }),
    );
  }

  public okOrElse<E>(fn: () => E | Promise<E>): ResultAsync<T, E> {
    return new ResultAsync(
      this.option.then(async (option) => {
        if (option.isNone()) {
          return err(await fn());
        }

        return ok(option.inner());
      }),
    );
  }

  public then<F, R>(
    onfulfilled?: (value: Option<T>) => F | PromiseLike<F>,
    onrejected?: (reason: unknown) => PromiseLike<R> | R,
  ): PromiseLike<F | R> {
    return this.option.then(onfulfilled, onrejected);
  }

  public async unwrapOr<U>(value: U): Promise<T | U> {
    return (await this.option).unwrapOr(value);
  }

  public async unwrapOrElse<U>(fn: () => Promise<U> | U): Promise<T | U> {
    return await (await this.option).unwrapOrElse(fn);
  }
}

/**
 * Create a new `OptionAsync` with no value.
 *
 * @returns An `OptionAsync` with no value.
 */
export function noneAsync<T = never>(): OptionAsync<T> {
  return new OptionAsync(Promise.resolve(none())) as OptionAsync<T>;
}

/**
 * Create a new `OptionAsync` with the provided value.
 *
 * @param value The value to create the `OptionAsync` with.
 * @returns An `OptionAsync` with the provided value.
 */
export function someAsync<T>(value: Promise<T> | T): OptionAsync<T> {
  return new OptionAsync(Promise.resolve(value).then(some<T>));
}
