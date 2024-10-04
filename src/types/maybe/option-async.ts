import { Option, none, some } from './option';
import { err, ok } from './result';
import { ResultAsync } from './result-async';

export class OptionAsync<T> implements PromiseLike<Option<T>> {
  constructor(private option: Promise<Option<T>>) {}

  async isSome(): Promise<boolean> {
    return (await this.option).isSome();
  }

  async isNone(): Promise<boolean> {
    return (await this.option).isNone();
  }

  map<U>(fn: (value: T) => U | Promise<U>): OptionAsync<U> {
    return new OptionAsync(
      this.option.then(async (option) => {
        if (option.isNone()) {
          return none();
        }

        return some(await fn(option.inner()));
      }),
    );
  }

  andThen<U>(fn: (value: T) => Option<U> | OptionAsync<U>): OptionAsync<U> {
    return new OptionAsync(
      this.option.then(async (option) => {
        if (option.isNone()) {
          return none();
        }

        const res = fn(option.inner());

        if (res instanceof OptionAsync) {
          return res.option;
        }

        return res;
      }),
    );
  }

  async match<U>(matcher: {
    some: (value: T) => U;
    none: () => U;
  }): Promise<U> {
    return (await this.option).match(matcher);
  }

  okOr<E>(error: E): ResultAsync<T, E> {
    return new ResultAsync(
      this.option.then((option) => {
        if (option.isNone()) {
          return err(error);
        }

        return ok(option.inner());
      }),
    );
  }

  okOrElse<E>(fn: () => E | Promise<E>): ResultAsync<T, E> {
    return new ResultAsync(
      this.option.then(async (option) => {
        if (option.isNone()) {
          return err(await fn());
        }

        return ok(option.inner());
      }),
    );
  }

  async unwrapOr<U>(value: U): Promise<T | U> {
    return (await this.option).unwrapOr(value);
  }

  async unwrapOrElse<U>(fn: () => U | Promise<U>): Promise<T | U> {
    return (await this.option).unwrapOrElse(fn);
  }

  then<F, R>(
    onfulfilled?: (value: Option<T>) => F | PromiseLike<F>,
    onrejected?: (reason: unknown) => R | PromiseLike<R>,
  ): PromiseLike<F | R> {
    return this.option.then(onfulfilled, onrejected);
  }
}

export function someAsync<T>(value: T | Promise<T>): OptionAsync<T> {
  return new OptionAsync(Promise.resolve(value).then(some<T>));
}

export function noneAsync<T = never>(): OptionAsync<T> {
  return new OptionAsync(Promise.resolve(none())) as OptionAsync<T>;
}
