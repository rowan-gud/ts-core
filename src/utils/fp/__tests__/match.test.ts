import { match } from '../match';

describe('match()', () => {
  it('should pick the correct case', () => {
    type Foo = 'a' | 'b' | 'c';

    const foo = match('a' as Foo, {
      a: () => 1,
      b: () => 2,
      c: () => 3,
    });

    expect(foo).toBe(1);
  });
});
