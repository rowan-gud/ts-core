/**
 * This is a very simple match with just literals. For a more in depth matching
 * library check out https://github.com/gvergnaud/ts-pattern!
 *
 * @param on The value to switch on
 * @param cases An object containing the case mapped to the value
 * @returns The matched case
 */
export function match<On extends number | string, R>(
  on: On,
  cases: {
    [K in On]: (matched: K) => R;
  },
): R {
  return cases[on](on);
}
