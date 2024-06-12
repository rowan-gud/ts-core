import { OptionAsync } from './option-async'
import { Result, err, ok } from './result'

export class ResultAsync<T, E> implements PromiseLike<Result<T, E>> {
  constructor(private result: Promise<Result<T, E>>) {}

  async isOk(): Promise<boolean> {
    return (await this.result).isOk()
  }

  async isErr(): Promise<boolean> {
    return (await this.result).isErr()
  }

  map<U>(fn: (value: T) => U | Promise<U>): ResultAsync<U, E> {
    return new ResultAsync(
      this.result.then(async (result) => {
        if (result.isErr()) {
          return result
        }

        return ok(await fn(result.inner()))
      }),
    )
  }

  mapErr<F>(fn: (error: E) => F | Promise<F>): ResultAsync<T, F> {
    return new ResultAsync(
      this.result.then(async (result) => {
        if (result.isOk()) {
          return result
        }

        return err(await fn(result.inner()))
      }),
    )
  }

  andThen<U>(
    fn: (value: T) => Result<U, E> | Promise<Result<U, E>> | ResultAsync<U, E>,
  ): ResultAsync<U, E> {
    return new ResultAsync(
      this.result.then(async (result) => {
        if (result.isErr()) {
          return result
        }

        const res = fn(result.inner())

        if (res instanceof ResultAsync) {
          return res.result
        }

        return res
      }),
    )
  }

  async match<U>(matcher: {
    ok: (value: T) => U
    err: (error: E) => U
  }): Promise<U> {
    return (await this.result).match(matcher)
  }

  ok(): OptionAsync<T> {
    return new OptionAsync(this.result.then((result) => result.ok()))
  }

  err(): OptionAsync<E> {
    return new OptionAsync(this.result.then((result) => result.err()))
  }

  async unwrapOr<U>(value: U): Promise<T | U> {
    return (await this.result).unwrapOr(value)
  }

  async unwrapOrElse<U>(fn: () => U): Promise<T | U> {
    return (await this.result).unwrapOrElse(fn)
  }

  async unwrapErrOr<U>(value: U): Promise<E | U> {
    return (await this.result).unwrapErrOr(value)
  }

  async unwrapErrOrElse<U>(fn: () => U): Promise<E | U> {
    return (await this.result).unwrapErrOrElse(fn)
  }

  then<F, R>(
    onFulfilled: (value: Result<T, E>) => F | PromiseLike<F>,
    onRejected: (error: unknown) => R | PromiseLike<R>,
  ): Promise<F | R> {
    return this.result.then(onFulfilled, onRejected)
  }
}

export function okAsync<T = unknown, E = never>(
  value: T | Promise<T>,
): ResultAsync<T, E> {
  return new ResultAsync(Promise.resolve(value).then(ok<T>))
}

export function errAsync<T = never, E = unknown>(
  error: E | Promise<E>,
): ResultAsync<T, E> {
  return new ResultAsync(Promise.resolve(error).then(err<E>))
}
