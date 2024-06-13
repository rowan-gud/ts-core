import { Result, ok, err } from '../src'

function add(a: number, b: number): number {
  return a + b
}

function subtract(a: number, b: number): number {
  return a - b
}

function multiply(a: number, b: number): number {
  return a * b
}

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return err('cannot divide by zero')
  }

  return ok(a / b)
}

function main() {
  const result = ok(1)
    .map((value) => add(value, 1)) // ok(2)
    .map((value) => subtract(value, 2)) // ok(0)
    .andThen((value) => divide(3, value)) // err('cannot divide by zero')
    .map((value) => multiply(value, 4)) // err('cannot divide by zero')

  if (result.isOk()) {
    console.log('Result:', result.inner())
  } else {
    console.error('Error:', result.inner())
  }
}

main()
