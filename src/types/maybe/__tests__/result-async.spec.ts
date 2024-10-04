import { ok } from '../result';
import { ResultAsync, errAsync, okAsync } from '../result-async';

describe('ResultAsync', () => {
  describe('isOk()', () => {
    it('should return true if the result is ok', async () => {
      const result = okAsync(1);
      expect(await result.isOk()).toBe(true);
    });

    it('should return false if the result is err', async () => {
      const result = errAsync('some error');
      expect(await result.isOk()).toBe(false);
    });
  });

  describe('isErr()', () => {
    it('should return true if the result is err', async () => {
      const result = errAsync('some error');
      expect(await result.isErr()).toBe(true);
    });

    it('should return false if the result is ok', async () => {
      const result = okAsync(1);
      expect(await result.isErr()).toBe(false);
    });
  });

  describe('map()', () => {
    it('should return a new ResultAsync with the value mapped if the result is ok', async () => {
      const result = okAsync(1);
      const newResult = await result.map((value) => value + 1);
      expect(newResult._unwrap()).toBe(2);
    });

    it('should return a new ResultAsync with the error if the result is err', async () => {
      const result: ResultAsync<number, string> = errAsync('some error');
      const newResult = await result.map((value) => value + 1);
      expect(newResult._unwrapErr()).toBe('some error');
    });

    it('should chain multiple maps', async () => {
      const result = okAsync(1);
      const newResult = await result
        .map((value) => value + 1)
        .map((value) => value * 2);
      expect(newResult._unwrap()).toBe(4);
    });
  });

  describe('mapErr()', () => {
    it('should return a new ResultAsync with the error mapped if the result is err', async () => {
      const result = errAsync('some error');
      const newResult = await result.mapErr((error) => error + '!');
      expect(newResult._unwrapErr()).toBe('some error!');
    });

    it('should return a new ResultAsync with the value if the result is ok', async () => {
      const result: ResultAsync<number, string> = okAsync(1);
      const newResult = await result.mapErr((error) => error + '!');
      expect(newResult._unwrap()).toBe(1);
    });

    it('should chain multiple mapErrs', async () => {
      const result = errAsync('some error');
      const newResult = await result
        .mapErr((error) => error + '!')
        .mapErr((error) => error + '?');
      expect(newResult._unwrapErr()).toBe('some error!?');
    });
  });

  describe('andThen()', () => {
    it('should return the result of the mapper function', async () => {
      const result = await okAsync(1).andThen((value) => okAsync(value + 1));
      expect(result._unwrap()).toBe(2);
    });

    it('should return none if the result is err', async () => {
      const initial: ResultAsync<number, string> = errAsync('some error');

      const result = await initial.andThen((value) => okAsync(value + 1));
      expect(result._unwrapErr()).toBe('some error');
    });

    it('should chain multiple andThen calls', async () => {
      const result = await okAsync(1)
        .andThen((value) => ok(value + 1))
        .andThen((value) => okAsync(value * 2));
      expect(result._unwrap()).toBe(4);
    });
  });

  describe('match()', () => {
    it('should call the ok function if the result is ok', async () => {
      const result = okAsync(1);
      const value = await result.match({
        ok: (value) => value + 1,
        err: () => 0,
      });
      expect(value).toBe(2);
    });

    it('should call the err function if the result is err', async () => {
      const result = errAsync('some error');
      const value = await result.match({
        ok: () => '0',
        err: (error) => error + '!',
      });
      expect(value).toBe('some error!');
    });
  });

  describe('ok()', () => {
    it('should return an OptionAsync with an Some option when the result is Ok', async () => {
      const result = okAsync(1);

      const option = await result.ok();
      expect(option.isSome()).toBe(true);
      expect(option._unwrap()).toBe(1);
    });

    it('should return an OptionAsync with a None option when the result is Err', async () => {
      const result = errAsync('some error');

      const option = await result.ok();
      expect(option.isNone()).toBe(true);
    });
  });

  describe('err()', () => {
    it('should return an OptionAsync with an Some option when the result is Err', async () => {
      const result = errAsync('some error');

      const option = await result.err();
      expect(option.isSome()).toBe(true);
      expect(option._unwrap()).toBe('some error');
    });

    it('should return an OptionAsync with a None option when the result is Ok', async () => {
      const result = okAsync(1);

      const option = await result.err();
      expect(option.isNone()).toBe(true);
    });
  });

  describe('unwrapOr()', () => {
    it('should return the value if the result is Ok', async () => {
      const result = okAsync(1);
      const value = await result.unwrapOr(0);
      expect(value).toBe(1);
    });

    it('should return the default value if the result is Err', async () => {
      const result = errAsync('some error');
      const value = await result.unwrapOr(0);
      expect(value).toBe(0);
    });
  });

  describe('unwrapOrElse()', () => {
    it('should return the value if the result is Ok', async () => {
      const result = okAsync(1);
      const value = await result.unwrapOrElse(() => 0);
      expect(value).toBe(1);
    });

    it('should return the default value if the result is Err', async () => {
      const result: ResultAsync<string, string> = errAsync('some error');
      const value = await result.unwrapOrElse(() => 0);
      expect(value).toBe(0);
    });
  });

  describe('unwrapErrOr()', () => {
    it('should return the error if the result is Err', async () => {
      const result = errAsync('some error');
      const error = await result.unwrapErrOr('default error');
      expect(error).toBe('some error');
    });

    it('should return the default error if the result is Ok', async () => {
      const result: ResultAsync<number, string> = okAsync(1);
      const error = await result.unwrapErrOr('default error');
      expect(error).toBe('default error');
    });
  });

  describe('unwrapErrOrElse()', () => {
    it('should return the error if the result is Err', async () => {
      const result = errAsync('some error');
      const error = await result.unwrapErrOrElse(() => 'default error');
      expect(error).toBe('some error');
    });

    it('should return the default error if the result is Ok', async () => {
      const result: ResultAsync<number, string> = okAsync(1);
      const error = await result.unwrapErrOrElse(() => 'default error');
      expect(error).toBe('default error');
    });
  });
});
