import { Option, none, some } from '../option'
import { noneAsync, someAsync } from '../option-async'
import { Ok, Err } from '../result'

describe('Option', () => {
  describe('[Symbol.iterator]', () => {
    it('should return value for Some', () => {
      const option = some([1])

      const iterator = option[Symbol.iterator]()

      expect(iterator.next()).toEqual({ done: false, value: 1 })
      expect(iterator.next()).toEqual({ done: true, value: undefined })
    })

    it('should return undefined for None', () => {
      const option = none()

      const iterator = option[Symbol.iterator]()

      expect(iterator.next()).toEqual({ done: true, value: undefined })
    })

    it('should spread to the inner array for Some', () => {
      const option = some([1, 2, 3])

      expect([...option]).toEqual([1, 2, 3])
    })

    it('should spread to an empty array for None', () => {
      const option = none()

      expect([...option]).toEqual([])
    })
  })

  describe('isSome()', () => {
    it('should return true for Some', () => {
      const option = some(1)
      expect(option.isSome()).toBe(true)
    })

    it('should return false for None', () => {
      const option = none()
      expect(option.isSome()).toBe(false)
    })
  })

  describe('isNone()', () => {
    it('should return false for Some', () => {
      const option = some(1)
      expect(option.isNone()).toBe(false)
    })

    it('should return true for None', () => {
      const option = none()
      expect(option.isNone()).toBe(true)
    })
  })

  describe('map()', () => {
    it('should apply the function to the value for Some', () => {
      const option = some(1)
      const result = option.map((value) => value + 1)
      expect(result).toEqual(some(2))
    })

    it('should return None for None', () => {
      const option = none() as Option<number>
      const result = option.map((value) => value + 1)
      expect(result).toEqual(none())
    })
  })

  describe('andThen()', () => {
    it('should apply the function to the value for Some', () => {
      const option = some(1)
      const result = option.andThen((value) => some(value + 1))
      expect(result).toEqual(some(2))
    })

    it('should return None if the function returns None for Some', () => {
      const option = some(1)
      const result = option.andThen(() => none())
      expect(result).toEqual(none())
    })

    it('should return None for None', () => {
      const option = none() as Option<number>
      const result = option.andThen((value) => some(value + 1))
      expect(result).toEqual(none())
    })
  })

  describe('andThenAsync()', () => {
    it('should apply the function to the value for Some', async () => {
      const option = some(1)
      const result = await option.andThenAsync(async (value) =>
        Promise.resolve(some(value + 1)),
      )
      expect(result).toEqual(some(2))
    })

    it('should return None if the function returns None for Some', async () => {
      const option = some(1)
      const result = await option.andThenAsync(async () =>
        Promise.resolve(none()),
      )
      expect(result).toEqual(none())
    })

    it('should return None for None', async () => {
      const option = none() as Option<number>
      const result = await option.andThenAsync(async (value) =>
        Promise.resolve(some(value + 1)),
      )
      expect(result).toEqual(none())
    })
  })

  describe('match()', () => {
    it('should call the some function for Some', () => {
      const option = some(1)
      const result = option.match({
        some: (value) => value + 1,
        none: () => 0,
      })
      expect(result).toBe(2)
    })

    it('should call the none function for None', () => {
      const option = none() as Option<number>
      const result = option.match({
        some: (value) => value + 1,
        none: () => 0,
      })
      expect(result).toBe(0)
    })
  })

  describe('okOr()', () => {
    it('should construct a new Ok result for Some', () => {
      const option = some(1)
      const result = option.okOr('error')
      expect(result).toBeInstanceOf(Ok)
    })

    it('should construct a new Err result for None', () => {
      const option = none()
      const result = option.okOr('error')
      expect(result).toBeInstanceOf(Err)
      expect(result._unwrapErr()).toBe('error')
    })
  })

  describe('okOrElse()', () => {
    it('should construct a new Ok result for Some', () => {
      const option = some(1)
      const result = option.okOrElse(() => 'error')
      expect(result).toBeInstanceOf(Ok)
    })

    it('should construct a new Err result for None', () => {
      const option = none()
      const result = option.okOrElse(() => 'error')
      expect(result).toBeInstanceOf(Err)
      expect(result._unwrapErr()).toBe('error')
    })
  })

  describe('unwrapOr()', () => {
    it('should return the Some value for Some', () => {
      const option = some(1)
      const result = option.unwrapOr(0)
      expect(result).toBe(1)
    })

    it('should return the default value for None', () => {
      const option = none()
      const result = option.unwrapOr(0)
      expect(result).toBe(0)
    })
  })

  describe('unwrapOrElse()', () => {
    it('should return the Some value for Some', () => {
      const option = some(1)
      const result = option.unwrapOrElse(() => 0)
      expect(result).toBe(1)
    })

    it('should return the default value for None', () => {
      const option = none()
      const result = option.unwrapOrElse(() => 0)
      expect(result).toBe(0)
    })
  })

  describe('toString()', () => {
    it('should return the string representation for Some', () => {
      const option = some(1)
      expect(option.toString()).toBe('Some(1)')
    })

    it('should return the string representation for None', () => {
      const option = none()
      expect(option.toString()).toBe('None')
    })
  })

  describe('toJSON()', () => {
    it('should return the JSON representation for Some', () => {
      const option = some(1)
      expect(option.toJSON()).toBe('1')
    })

    it('should return the JSON representation for None', () => {
      const option = none()
      expect(option.toJSON()).toBe('null')
    })
  })
})

describe('namespace Option', () => {
  describe('from()', () => {
    it('should return Some for a non-nullish value', () => {
      expect(Option.from(1)).toEqual(some(1))
    })

    it('should return None for a nullish value', () => {
      expect(Option.from(null)).toEqual(none())
    })
  })

  describe('fromAsync()', () => {
    it('should return Some for a non-nullish value', async () => {
      expect(await Option.fromAsync(Promise.resolve(1))).toEqual(some(1))
    })

    it('should return None for a nullish value', async () => {
      expect(await Option.fromAsync(Promise.resolve(null))).toEqual(none())
    })
  })

  describe('wrap()', () => {
    it('should return Some when the function resolves to a value', () => {
      expect(Option.wrap(() => 1)).toEqual(some(1))
    })

    it('should return None when the function throws an error', () => {
      expect(
        Option.wrap(() => {
          throw new Error('error')
        }),
      ).toEqual(none())
    })
  })

  describe('wrapAsync()', () => {
    it('should return Some when the function resolves to a value', async () => {
      expect(await Option.wrapAsync(() => Promise.resolve(1))).toEqual(some(1))
    })

    it('should return None when the function rejects', async () => {
      expect(
        await Option.wrapAsync(() => Promise.reject(new Error('error'))),
      ).toEqual(none())
    })
  })

  describe('all()', () => {
    it('should return Some when all values are Some', () => {
      expect(Option.all(some(1), some(2), some(3))).toEqual(some([1, 2, 3]))
    })

    it('should return None when any value is None', () => {
      expect(Option.all(some(1), none(), some(3))).toEqual(none())
    })
  })

  describe('allAsync()', () => {
    it('should return Some when all values are Some', async () => {
      expect(
        await Option.allAsync(someAsync(1), some(2), Promise.resolve(some(3))),
      ).toEqual(some([1, 2, 3]))
    })

    it('should return None when any value is None', async () => {
      expect(await Option.allAsync(someAsync(1), none(), some(3))).toEqual(
        none(),
      )
    })
  })

  describe('any()', () => {
    it('should return Some when any value is Some', () => {
      expect(Option.any(some(1), none(), some(3))).toEqual(some(1))
    })

    it('should return None when all values are None', () => {
      expect(Option.any(none(), none(), none())).toEqual(none())
    })
  })

  describe('anyAsync()', () => {
    it('should return Some when any value is Some', async () => {
      expect(
        await Option.anyAsync(someAsync(1), Promise.resolve(none()), some(3)),
      ).toEqual(some(1))
    })

    it('should return None when all values are None', async () => {
      expect(
        await Option.anyAsync(noneAsync(), none(), Promise.resolve(none())),
      ).toEqual(none())
    })
  })
})
