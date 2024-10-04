import { ok, err, Result } from '../result'
import { errAsync, okAsync } from '../result-async'

describe('Result', () => {
  describe('isOk()', () => {
    it('should return true for ok', () => {
      const result = ok(1)
      expect(result.isOk()).toBe(true)
    })

    it('should return false for err', () => {
      const result = err('error')
      expect(result.isOk()).toBe(false)
    })
  })

  describe('isErr()', () => {
    it('should return false for ok', () => {
      const result = ok(1)
      expect(result.isErr()).toBe(false)
    })

    it('should return true for err', () => {
      const result = err('error')
      expect(result.isErr()).toBe(true)
    })
  })

  describe('map()', () => {
    it('should apply the function to the value for ok', () => {
      const result = ok(1)
      const mappedResult = result.map((value) => value + 1)
      expect(mappedResult).toEqual(ok(2))
    })

    it('should return err for err', () => {
      const result = err('error') as Result<number, string>
      const mappedResult = result.map((value) => value + 1)
      expect(mappedResult).toEqual(err('error'))
    })
  })

  describe('mapAsync()', () => {
    it('should apply the function to the value for ok', async () => {
      const result = ok(1)
      const mappedResult = await result
        .mapAsync((value) => Promise.resolve(value + 1))
        .map((value) => value + 1)
      expect(mappedResult).toEqual(ok(3))
    })

    it('should return err for err', async () => {
      const result = err('error') as Result<number, string>
      const mappedResult = await result
        .mapAsync((value) => Promise.resolve(value + 1))
        .map((value) => value + 1)
      expect(mappedResult).toEqual(err('error'))
    })
  })

  describe('mapErr()', () => {
    it('should apply the function to the error for err', () => {
      const result = err('error')
      const mappedResult = result.mapErr((error) => error + '!')
      expect(mappedResult).toEqual(err('error!'))
    })

    it('should return ok for ok', () => {
      const result = ok(1) as Result<number, string>
      const mappedResult = result.mapErr((error) => error + '!')
      expect(mappedResult).toEqual(ok(1))
    })
  })

  describe('mapErrAsync()', () => {
    it('should apply the function to the error for err', async () => {
      const result = err('error') as Result<number, string>
      const mappedResult = await result
        .mapErrAsync((error) => Promise.resolve(error + '!'))
        .map((value) => value + 1)
      expect(mappedResult).toEqual(err('error!'))
    })

    it('should return ok for ok', async () => {
      const result = ok(1) as Result<number, string>
      const mappedResult = await result
        .mapErrAsync((error) => Promise.resolve(error + '!'))
        .map((value) => value + 1)
      expect(mappedResult).toEqual(ok(2))
    })
  })

  describe('andThen()', () => {
    it('should apply the function to the value for ok', () => {
      const result = ok(1)
      const mappedResult = result.andThen((value) => ok(value + 1))
      expect(mappedResult).toEqual(ok(2))
    })

    it('should return err if the function returns err for ok', () => {
      const result = ok(1)
      const mappedResult = result.andThen(() => err('error'))
      expect(mappedResult).toEqual(err('error'))
    })

    it('should return err for err', () => {
      const result = err('error') as Result<number, string>
      const mappedResult = result.andThen((value) => ok(value + 1))
      expect(mappedResult).toEqual(err('error'))
    })
  })

  describe('andThenAsync()', () => {
    it('should apply the function to the value for ok', async () => {
      const result = ok(1)
      const mappedResult = await result
        .andThenAsync((value) => Promise.resolve(ok(value + 1)))
        .map((value) => value + 1)
      expect(mappedResult).toEqual(ok(3))
    })

    it('should return err if the function returns err for ok', async () => {
      const result = ok(1) as Result<number, string>
      const mappedResult = await result
        .andThenAsync(
          () =>
            Promise.resolve(err('error')) as Promise<Result<number, string>>,
        )
        .map((value) => value + 1)
      expect(mappedResult).toEqual(err('error'))
    })

    it('should return err for err', async () => {
      const result = err('error') as Result<number, string>
      const mappedResult = await result
        .andThenAsync((value) => Promise.resolve(ok(value + 1)))
        .map((value) => value + 1)
      expect(mappedResult).toEqual(err('error'))
    })
  })

  describe('orElse()', () => {
    it('should return the result for ok', () => {
      const result = ok(1)
      const orElseResult = result.orElse(() => err('error'))
      expect(orElseResult).toEqual(ok(1))
    })

    it('should return the result of the function for err', () => {
      const result = err('error')
      const orElseResult = result.orElse(() => ok(1))
      expect(orElseResult).toEqual(ok(1))
    })
  })

  describe('orElseAsync()', () => {
    it('should return the result for ok', async () => {
      const result = ok(1)
      const orElseResult = await result.orElseAsync(() =>
        Promise.resolve(err('error')),
      )
      expect(orElseResult).toEqual(ok(1))
    })

    it('should return the result of the function for err', async () => {
      const result = err('error')
      const orElseResult = await result.orElseAsync(() =>
        Promise.resolve(ok(1)),
      )
      expect(orElseResult).toEqual(ok(1))
    })
  })

  describe('match()', () => {
    it('should call the ok function for ok', () => {
      const result = ok(1)
      const matchedResult = result.match({
        ok: (value) => value + 1,
        err: () => 0,
      })
      expect(matchedResult).toBe(2)
    })

    it('should call the err function for err', () => {
      const result = err('error') as Result<number, string>
      const matchedResult = result.match({
        ok: (value) => value + 1,
        err: () => 0,
      })
      expect(matchedResult).toBe(0)
    })
  })

  describe('unwrapOr()', () => {
    it('should return the ok value for ok', () => {
      const result = ok(1)
      const unwrappedValue = result.unwrapOr(0)
      expect(unwrappedValue).toBe(1)
    })

    it('should return the default value for err', () => {
      const result = err('error')
      const unwrappedValue = result.unwrapOr(0)
      expect(unwrappedValue).toBe(0)
    })
  })

  describe('unwrapOrElse()', () => {
    it('should return the ok value for ok', () => {
      const result = ok(1)
      const unwrappedValue = result.unwrapOrElse(() => 0)
      expect(unwrappedValue).toBe(1)
    })

    it('should return the value returned by the function for err', () => {
      const result = err('error')
      const unwrappedValue = result.unwrapOrElse(() => 0)
      expect(unwrappedValue).toBe(0)
    })
  })

  describe('unwrapErrOr()', () => {
    it('should return the error for err', () => {
      const result = err('error')
      const unwrappedError = result.unwrapErrOr('default error')
      expect(unwrappedError).toBe('error')
    })

    it('should return the default error for ok', () => {
      const result = ok(1)
      const unwrappedError = result.unwrapErrOr('default error')
      expect(unwrappedError).toBe('default error')
    })
  })

  describe('unwrapErrOrElse()', () => {
    it('should return the error for err', () => {
      const result = err('error')
      const unwrappedError = result.unwrapErrOrElse(() => 'default error')
      expect(unwrappedError).toBe('error')
    })

    it('should return the result of the function for ok', () => {
      const result = ok(1)
      const unwrappedError = result.unwrapErrOrElse(() => 'default error')
      expect(unwrappedError).toBe('default error')
    })
  })

  describe('toString()', () => {
    it('should return the string representation for ok', () => {
      const result = ok(1)
      expect(result.toString()).toBe('Ok(1)')
    })

    it('should return the string representation for err', () => {
      const result = err('error')
      expect(result.toString()).toBe('Err(error)')
    })
  })

  describe('toJSON()', () => {
    it('should return the JSON representation for ok', () => {
      const result = ok(1)
      expect(result.toJSON()).toBe('1')
    })

    it('should return the JSON representation for err', () => {
      const result = err('error')
      expect(result.toJSON()).toBe('null')
    })
  })
})

describe('namespace Result', () => {
  describe('from()', () => {
    it('should return ok for a truthy value', () => {
      const result = Result.fromOr(1, 'error')
      expect(result).toEqual(ok(1))
    })

    it('should return err for a falsy value', () => {
      const result = Result.fromOr(null, 'error')
      expect(result).toEqual(err('error'))
    })
  })

  describe('fromAsync()', () => {
    it('should return ok for a truthy value', async () => {
      const result = await Result.fromOrAsync(Promise.resolve(1), 'error')
      expect(result).toEqual(ok(1))
    })

    it('should return err for a falsy value', async () => {
      const result = await Result.fromOrAsync(Promise.resolve(null), 'error')
      expect(result).toEqual(err('error'))
    })
  })

  describe('fromOrElse()', () => {
    it('should return ok for a truthy value', () => {
      const result = Result.fromOrElse(1, () => err('error'))
      expect(result).toEqual(ok(1))
    })

    it('should return err for a falsy value', () => {
      const result = Result.fromOrElse(null, () => err('error'))
      expect(result).toEqual(err('error'))
    })
  })

  describe('fromOrElseAsync()', () => {
    it('should return ok for a truthy value', async () => {
      const result = await Result.fromOrElseAsync(Promise.resolve(1), () =>
        err('error'),
      )
      expect(result).toEqual(ok(1))
    })

    it('should return err for a falsy value', async () => {
      const result = await Result.fromOrElseAsync(Promise.resolve(null), () =>
        err('error'),
      )
      expect(result).toEqual(err('error'))
    })
  })

  describe('wrap()', () => {
    it('should return ok for a non-throwing function', () => {
      const result = Result.wrap(() => 1)
      expect(result).toEqual(ok(1))
    })

    it('should return err for a throwing function', () => {
      const result = Result.wrap(() => {
        throw new Error('error')
      })
      expect(result).toStrictEqual(err(new Error('error')))
    })
  })

  describe('wrapAsync()', () => {
    it('should return ok for a non-throwing function', async () => {
      const result = await Result.wrapAsync(() => Promise.resolve(1))
      expect(result).toEqual(ok(1))
    })
    it('should return err for a throwing function', async () => {
      const result = await Result.wrapAsync(() => {
        return new Promise(() => {
          throw new Error('error')
        })
      })
      expect(result).toStrictEqual(err(new Error('error')))
    })
  })

  describe('wrapOr()', () => {
    it('should return ok for a non-throwing function', () => {
      const result = Result.wrapOr(() => 1, 'error')
      expect(result).toEqual(ok(1))
    })

    it('should return err for a throwing function', () => {
      const result = Result.wrapOr(() => {
        throw new Error('error')
      }, 'error')
      expect(result).toEqual(err('error'))
    })
  })

  describe('wrapOrAsync()', () => {
    it('should return ok for a non-throwing function', async () => {
      const result = await Result.wrapOrAsync(() => Promise.resolve(1), 'error')
      expect(result).toEqual(ok(1))
    })

    it('should return err for a throwing function', async () => {
      const result = await Result.wrapOrAsync(() => {
        return new Promise(() => {
          throw new Error('error')
        })
      }, 'error')
      expect(result).toEqual(err('error'))
    })
  })

  describe('wrapOrElse()', () => {
    it('should return ok for a non-throwing function', () => {
      const result = Result.wrapOrElse(
        () => 1,
        () => err('error'),
      )
      expect(result).toEqual(ok(1))
    })

    it('should return err for a throwing function', () => {
      const result = Result.wrapOrElse(
        () => {
          throw new Error('error')
        },
        () => err('error'),
      )
      expect(result).toEqual(err('error'))
    })
  })

  describe('wrapOrElseAsync()', () => {
    it('should return ok for a non-throwing function', async () => {
      const result = await Result.wrapOrElseAsync(
        () => Promise.resolve(1),
        () => err('error'),
      )
      expect(result).toEqual(ok(1))
    })

    it('should return err for a throwing function', async () => {
      const result = await Result.wrapOrElseAsync(
        () => {
          return new Promise(() => {
            throw new Error('error')
          })
        },
        () => err('error'),
      )
      expect(result).toEqual(err('error'))
    })
  })

  describe('all()', () => {
    it('should return ok for an array of ok values', () => {
      const result = Result.all(ok(1), ok(2), ok(3))
      expect(result).toEqual(ok([1, 2, 3]))
    })

    it('should return err for an array with an err value', () => {
      const result = Result.all(ok(1), err('error'), ok(3))
      expect(result).toEqual(err('error'))
    })
  })

  describe('allAsync()', () => {
    it('should return ok for an array of ok values', async () => {
      const result = await Result.allAsync(
        Promise.resolve(ok(1)),
        ok(2),
        okAsync(3),
      )
      expect(result).toEqual(ok([1, 2, 3]))
    })

    it('should return err for an array with an err value', async () => {
      const result = await Result.allAsync(
        Promise.resolve(ok(1)),
        err('error'),
        okAsync(3),
      )
      expect(result).toEqual(err('error'))
    })
  })

  describe('any()', () => {
    it('should return ok for an array with an ok value', () => {
      const result = Result.any(ok(1), err('error'), ok(3))
      expect(result).toEqual(ok(1))
    })

    it('should return err for an array with an err value', () => {
      const result = Result.any(err('error'), err('error'), err('error'))
      expect(result).toEqual(err(['error', 'error', 'error']))
    })
  })

  describe('anyAsync()', () => {
    it('should return ok for an array with an ok value', async () => {
      const result = await Result.anyAsync(
        Promise.resolve(ok(1)),
        err('error'),
        okAsync(3),
      )
      expect(result).toEqual(ok(1))
    })

    it('should return err for an array with an err value', async () => {
      const result = await Result.anyAsync(
        Promise.resolve(err('error')),
        err('error'),
        errAsync('error'),
      )
      expect(result).toEqual(err(['error', 'error', 'error']))
    })
  })
})
