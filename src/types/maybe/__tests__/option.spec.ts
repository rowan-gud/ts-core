import { none, Option, some } from '../option';
import { noneAsync, someAsync } from '../option-async';
import { Err, Ok } from '../result';

describe('option', () => {
  describe('[Symbol.iterator]', () => {
    it('should return value for Some', () => {
      const option = some([1]);

      const iterator = option[Symbol.iterator]();

      expect(iterator.next()).toStrictEqual({ done: false, value: 1 });
      expect(iterator.next()).toStrictEqual({ done: true, value: undefined });
    });

    it('should return undefined for None', () => {
      const option = none();

      const iterator = option[Symbol.iterator]();

      expect(iterator.next()).toStrictEqual({ done: true, value: undefined });
    });

    it('should spread to the inner array for Some', () => {
      const option = some([1, 2, 3]);

      expect([...option]).toStrictEqual([1, 2, 3]);
    });

    it('should spread to an empty array for None', () => {
      const option = none();

      expect([...option]).toStrictEqual([]);
    });
  });

  describe('isSome()', () => {
    it('should return true for Some', () => {
      const option = some(1);

      expect(option.isSome()).toBe(true);
    });

    it('should return false for None', () => {
      const option = none();

      expect(option.isSome()).toBe(false);
    });
  });

  describe('isNone()', () => {
    it('should return false for Some', () => {
      const option = some(1);

      expect(option.isNone()).toBe(false);
    });

    it('should return true for None', () => {
      const option = none();

      expect(option.isNone()).toBe(true);
    });
  });

  describe('map()', () => {
    it('should apply the function to the value for Some', () => {
      const option = some(1);
      const result = option.map((value) => value + 1);

      expect(result).toStrictEqual(some(2));
    });

    it('should return None for None', () => {
      const option = none() as Option<number>;
      const result = option.map((value) => value + 1);

      expect(result).toStrictEqual(none());
    });
  });

  describe('andThen()', () => {
    it('should apply the function to the value for Some', () => {
      const option = some(1);
      const result = option.andThen((value) => some(value + 1));

      expect(result).toStrictEqual(some(2));
    });

    it('should return None if the function returns None for Some', () => {
      const option = some(1);
      const result = option.andThen(() => none());

      expect(result).toStrictEqual(none());
    });

    it('should return None for None', () => {
      const option = none() as Option<number>;
      const result = option.andThen((value) => some(value + 1));

      expect(result).toStrictEqual(none());
    });
  });

  describe('andThenAsync()', () => {
    it('should apply the function to the value for Some', async () => {
      const option = some(1);
      const result = await option.andThenAsync(
        async (value) => await Promise.resolve(some(value + 1)),
      );

      expect(result).toStrictEqual(some(2));
    });

    it('should return None if the function returns None for Some', async () => {
      const option = some(1);
      const result = await option.andThenAsync(
        async () => await Promise.resolve(none()),
      );

      expect(result).toStrictEqual(none());
    });

    it('should return None for None', async () => {
      const option = none() as Option<number>;
      const result = await option.andThenAsync(
        async (value) => await Promise.resolve(some(value + 1)),
      );

      expect(result).toStrictEqual(none());
    });
  });

  describe('match()', () => {
    it('should call the some function for Some', () => {
      const option = some(1);
      const result = option.match({
        none: () => 0,
        some: (value) => value + 1,
      });

      expect(result).toBe(2);
    });

    it('should call the none function for None', () => {
      const option = none() as Option<number>;
      const result = option.match({
        none: () => 0,
        some: (value) => value + 1,
      });

      expect(result).toBe(0);
    });
  });

  describe('okOr()', () => {
    it('should construct a new Ok result for Some', () => {
      const option = some(1);
      const result = option.okOr('error');

      expect(result).toBeInstanceOf(Ok);
    });

    it('should construct a new Err result for None', () => {
      const option = none();
      const result = option.okOr('error');

      expect(result).toBeInstanceOf(Err);
      expect(result._unwrapErr()).toBe('error');
    });
  });

  describe('okOrElse()', () => {
    it('should construct a new Ok result for Some', () => {
      const option = some(1);
      const result = option.okOrElse(() => 'error');

      expect(result).toBeInstanceOf(Ok);
    });

    it('should construct a new Err result for None', () => {
      const option = none();
      const result = option.okOrElse(() => 'error');

      expect(result).toBeInstanceOf(Err);
      expect(result._unwrapErr()).toBe('error');
    });
  });

  describe('unwrapOr()', () => {
    it('should return the Some value for Some', () => {
      const option = some(1);
      const result = option.unwrapOr(0);

      expect(result).toBe(1);
    });

    it('should return the default value for None', () => {
      const option = none();
      const result = option.unwrapOr(0);

      expect(result).toBe(0);
    });
  });

  describe('unwrapOrElse()', () => {
    it('should return the Some value for Some', () => {
      const option = some(1);
      const result = option.unwrapOrElse(() => 0);

      expect(result).toBe(1);
    });

    it('should return the default value for None', () => {
      const option = none();
      const result = option.unwrapOrElse(() => 0);

      expect(result).toBe(0);
    });
  });

  describe('toString()', () => {
    it('should return the string representation for Some', () => {
      const option = some(1);

      expect(option.toString()).toBe('Some(1)');
    });

    it('should return the string representation for None', () => {
      const option = none();

      expect(option.toString()).toBe('None');
    });
  });

  describe('toJSON()', () => {
    it('should return the JSON representation for Some', () => {
      const option = some(1);

      expect(option.toJSON()).toBe('1');
    });

    it('should return the JSON representation for None', () => {
      const option = none();

      expect(option.toJSON()).toBe('null');
    });
  });
});

describe('namespace Option', () => {
  describe('from()', () => {
    it('should return Some for a non-nullish value', () => {
      expect(Option.from(1)).toStrictEqual(some(1));
    });

    it('should return None for a nullish value', () => {
      expect(Option.from(null)).toStrictEqual(none());
    });
  });

  describe('fromAsync()', () => {
    it('should return Some for a non-nullish value', async () => {
      await expect(Option.fromAsync(Promise.resolve(1))).resolves.toStrictEqual(
        some(1),
      );
    });

    it('should return None for a nullish value', async () => {
      await expect(
        Option.fromAsync(Promise.resolve(null)),
      ).resolves.toStrictEqual(none());
    });
  });

  describe('wrap()', () => {
    it('should return Some when the function resolves to a value', () => {
      expect(Option.wrap(() => 1)).toStrictEqual(some(1));
    });

    it('should return None when the function throws an error', () => {
      expect(
        Option.wrap(() => {
          throw new Error('error');
        }),
      ).toStrictEqual(none());
    });
  });

  describe('wrapAsync()', () => {
    it('should return Some when the function resolves to a value', async () => {
      await expect(
        Option.wrapAsync(() => Promise.resolve(1)),
      ).resolves.toStrictEqual(some(1));
    });

    it('should return None when the function rejects', async () => {
      await expect(
        Option.wrapAsync(() => Promise.reject(new Error('error'))),
      ).resolves.toStrictEqual(none());
    });
  });

  describe('all()', () => {
    it('should return Some when all values are Some', () => {
      expect(Option.all(some(1), some(2), some(3))).toStrictEqual(
        some([1, 2, 3]),
      );
    });

    it('should return None when any value is None', () => {
      expect(Option.all(some(1), none(), some(3))).toStrictEqual(none());
    });
  });

  describe('allAsync()', () => {
    it('should return Some when all values are Some', async () => {
      await expect(
        Option.allAsync(someAsync(1), some(2), Promise.resolve(some(3))),
      ).resolves.toStrictEqual(some([1, 2, 3]));
    });

    it('should return None when any value is None', async () => {
      await expect(
        Option.allAsync(someAsync(1), none(), some(3)),
      ).resolves.toStrictEqual(none());
    });
  });

  describe('any()', () => {
    it('should return Some when any value is Some', () => {
      expect(Option.any(some(1), none(), some(3))).toStrictEqual(some(1));
    });

    it('should return None when all values are None', () => {
      expect(Option.any(none(), none(), none())).toStrictEqual(none());
    });
  });

  describe('anyAsync()', () => {
    it('should return Some when any value is Some', async () => {
      await expect(
        Option.anyAsync(someAsync(1), Promise.resolve(none()), some(3)),
      ).resolves.toStrictEqual(some(1));
    });

    it('should return None when all values are None', async () => {
      await expect(
        Option.anyAsync(noneAsync(), none(), Promise.resolve(none())),
      ).resolves.toStrictEqual(none());
    });
  });
});
