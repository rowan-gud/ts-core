import type { Result } from './result';

import { OptionAsync } from './option-async';
import { err, ok } from './result';

export class ResultAsync<T, E> implements PromiseLike<Result<T, E>> {
  constructor(private readonly result: Promise<Result<T, E>>) {}

  public andThen<U>(
    fn: (value: T) => Promise<Result<U, E>> | Result<U, E> | ResultAsync<U, E>,
  ): ResultAsync<U, E> {
    return new ResultAsync(
      this.result.then(async (result) => {
        if (result.isErr()) {
          return result;
        }

        const res = fn(result.inner());

        if (res instanceof ResultAsync) {
          return await res.result;
        }

        return await res;
      }),
    );
  }

  public err(): OptionAsync<E> {
    return new OptionAsync(this.result.then((result) => result.err()));
  }

  public async isErr(): Promise<boolean> {
    return (await this.result).isErr();
  }

  public async isOk(): Promise<boolean> {
    return (await this.result).isOk();
  }

  public map<U>(fn: (value: T) => Promise<U> | U): ResultAsync<U, E> {
    return new ResultAsync(
      this.result.then(async (result) => {
        if (result.isErr()) {
          return result;
        }

        return ok(await fn(result.inner()));
      }),
    );
  }

  public mapErr<F>(fn: (error: E) => F | Promise<F>): ResultAsync<T, F> {
    return new ResultAsync(
      this.result.then(async (result) => {
        if (result.isOk()) {
          return result;
        }

        return err(await fn(result.inner()));
      }),
    );
  }

  public async match<U>(matcher: {
    err(error: E): U;
    ok(value: T): U;
  }): Promise<U> {
    return (await this.result).match(matcher);
  }

  public ok(): OptionAsync<T> {
    return new OptionAsync(this.result.then((result) => result.ok()));
  }

  public orElse<F>(
    fn: (error: E) => Result<T, F> | ResultAsync<T, F>,
  ): ResultAsync<T, F> {
    return new ResultAsync(
      this.result.then(async (result) => {
        if (result.isOk()) {
          return result;
        }

        const res = fn(result.inner());

        if (res instanceof ResultAsync) {
          return await res.result;
        }

        return res;
      }),
    );
  }

  public then<F, R>(
    onFulfilled: (value: Result<T, E>) => F | PromiseLike<F>,
    onRejected: (error: unknown) => PromiseLike<R> | R,
  ): Promise<F | R> {
    return this.result.then(onFulfilled, onRejected);
  }

  public async unwrapErrOr<U>(value: U): Promise<E | U> {
    return (await this.result).unwrapErrOr(value);
  }

  public async unwrapErrOrElse<U>(fn: () => U): Promise<E | U> {
    return (await this.result).unwrapErrOrElse(fn);
  }

  public async unwrapOr<U>(value: U): Promise<T | U> {
    return (await this.result).unwrapOr(value);
  }

  public async unwrapOrElse<U>(fn: () => U): Promise<T | U> {
    return (await this.result).unwrapOrElse(fn);
  }
}

/**
 * Construct a ResultAsync with an Err value.
 *
 * @param error The error value.
 * @returns A ResultAsync with an Err value.
 */
export function errAsync<T = never, E = unknown>(
  error: E | Promise<E>,
): ResultAsync<T, E> {
  return new ResultAsync(Promise.resolve(error).then(err<E>));
}

/**
 * Construct a ResultAsync with an Ok value.
 *
 * @param value The value to wrap in an Ok.
 * @returns A ResultAsync with an Ok value.
 */
export function okAsync<T = unknown, E = never>(
  value: Promise<T> | T,
): ResultAsync<T, E> {
  return new ResultAsync(Promise.resolve(value).then(ok<T>));
}
