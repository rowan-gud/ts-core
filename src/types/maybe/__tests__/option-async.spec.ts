import { someAsync, noneAsync, OptionAsync } from '../option-async'
import { some, none } from '../option'

describe('class OptionAsync', () => {
  describe('isSome()', () => {
    it('should return true if the option is some', async () => {
      const option = someAsync(1)
      expect(await option.isSome()).toBe(true)
    })

    it('should return false if the option is none', async () => {
      const option = noneAsync()
      expect(await option.isSome()).toBe(false)
    })
  })

  describe('isNone()', () => {
    it('should return true if the option is none', async () => {
      const option = noneAsync()
      expect(await option.isNone()).toBe(true)
    })

    it('should return false if the option is some', async () => {
      const option = someAsync(1)
      expect(await option.isNone()).toBe(false)
    })
  })

  describe('map()', () => {
    it('should return a new some option with the value transformed by the mapper function', async () => {
      const option = someAsync(1)
      const result = await option.map((value) => value + 1)
      expect(result).toEqual(some(2))
    })

    it('should return a new none option if the option is none', async () => {
      const option: OptionAsync<number> = noneAsync()
      const result = await option.map((value) => value + 1)
      expect(result).toEqual(none())
    })

    it('should chain multiple map calls', async () => {
      const option = someAsync(1)
      const result = await option
        .map((value) => value + 1)
        .map((value) => value * 2)
      expect(result).toEqual(some(4))
    })
  })

  describe('andThen()', () => {
    it('should return the result of the mapper function', async () => {
      const option = someAsync(1)
      const result = await option.andThen(() => someAsync(2))
      expect(result).toEqual(some(2))
    })

    it('should return none if the option is none', async () => {
      const option = noneAsync()
      const result = await option.andThen(() => someAsync(2))
      expect(result).toEqual(none())
    })

    it('should chain multiple andThen calls', async () => {
      const option = someAsync(1)
      const result = await option
        .andThen((x) => some(x + 2))
        .andThen((x) => someAsync(x * 3))
      expect(result).toEqual(some(9))
    })
  })

  describe('match()', () => {
    it('should call the some function if the option is some', async () => {
      const option = someAsync(1)
      const result = await option.match({
        some: (value) => value + 1,
        none: () => 0,
      })
      expect(result).toBe(2)
    })

    it('should call the none function if the option is none', async () => {
      const option: OptionAsync<number> = noneAsync()
      const result = await option.match({
        some: (value) => value + 1,
        none: () => 0,
      })
      expect(result).toBe(0)
    })
  })

  describe('okOr()', () => {
    it('should return a ResultAsync with an Ok result if the option is some', async () => {
      const option = someAsync(1)
      const result = await option.okOr(0)
      expect(result.isOk()).toBe(true)
      expect(result._unwrap()).toBe(1)
    })

    it('should return a ResultAsync with an Err result if the option is none', async () => {
      const option = noneAsync()
      const result = await option.okOr('some error')
      expect(result.isErr()).toBe(true)
      expect(result._unwrapErr()).toBe('some error')
    })
  })

  describe('okOrElse()', () => {
    it('should return a ResultAsync with an Ok result if the option is some', async () => {
      const option = someAsync(1)
      const result = await option.okOrElse(() => 'some error')
      expect(result.isOk()).toBe(true)
      expect(result._unwrap()).toBe(1)
    })

    it('should return a ResultAsync with an Err result if the option is none', async () => {
      const option = noneAsync()
      const result = await option.okOrElse(() => 'some error')
      expect(result.isErr()).toBe(true)
      expect(result._unwrapErr()).toBe('some error')
    })
  })

  describe('unwrapOr()', () => {
    it('should return the value if the option is some', async () => {
      const option = someAsync(1)
      const result = await option.unwrapOr(0)
      expect(result).toBe(1)
    })

    it('should return the default value if the option is none', async () => {
      const option = noneAsync()
      const result = await option.unwrapOr(0)
      expect(result).toBe(0)
    })
  })
})
