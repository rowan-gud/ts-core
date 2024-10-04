# Ts Core

## Description

This is a project designed to provide a foundation for a more rigid type
system in TypeScript. It is designed to be similar to the type system in
Rust, but abiding by the limitations of TypeScript.

## Installation

```bash
npm install @ellefe/ts-core
```

## Usage

### Result

The `Result` type is a type that represents either a successful value or an
error. It is similar to the `Result` type in Rust. The `Result` type has two
variants: `Ok` and `Err`. The `Ok` variant contains the successful value, and
the `Err` variant contains the error value.

This type is useful for denoting that an operation may fail and returning
additional information about the failure. For example, a function that
parses a string into a number may return an error if the string is not a
valid number.

There are a number of different methods available on the `Result` type that
allow for chaining operations on the result.

#### Basic Usage - Result

```TypeScript
function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return err('Cannot divide by zero');
  }

  return ok(a / b);
}

const result = divide(10, 2); // Ok: 5
const error = divide(10, 0); // Err: Cannot divide by zero
```

#### Chaining - Result

```TypeScript
function multiply(a: number, b: number): number {
  return a * b;
}

const result = divide(10, 2)
  .map((result) => multiply(result, 2)); // Ok: 10
const error = divide(10, 0)
  .map((result) => multiply(result, 2)); // Err: Cannot divide by zero
```

#### Async Chaining - Result

```TypeScript
const user = await UserImpl.getById(123)
  .andThen((user) => user.update({ name: 'John Doe' }))
  .andThen((user) => user.save())

if (user.isOk()) {
  console.log('Saved user', user.inner().name)
} else {
  console.error(user.inner().message)
}
```

> For more complete examples see the [examples](https://github.com/rowan-gud/ts-core/tree/main/examples) directory.

### Option

The `Option` type is a type that represents either a value or no value. It is
similar to the `Option` type in Rust. The `Option` type has two variants:
`Some` and `None`. The `Some` variant contains the value, and the `None`
variant contains no value.

This type is useful for denoting that an operation may or may not return a
value and no other information is relevant. For example, a function that
returns the first element of an array may return `None` if the array is empty.

Just like the result type, there are a number of different methods available
on the `Option` type that allow for chaining operations on the option.

#### Basic Usage - Option

```TypeScript
const someValue = some(10); // Some: 10
const noneValue = none(); // None
```

#### Chaining - Option

```TypeScript
const someValue = some(10)
  .map((value) => value * 2); // Some: 20
const noneValue = none()
  .map((value) => value * 2); // None
```

#### Async Chaining - Option

```TypeScript
const user = await UserImpl.getById(123)
  .ok()
  .map((user) => user.name)
  .map((name) => name.toUpperCase())
```
