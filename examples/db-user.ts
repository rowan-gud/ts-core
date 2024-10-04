import { Result, ResultAsync, err, ok } from '../src';

interface User {
  id: number;
  name: string;
}

async function getUser({ id }: { id: number }): Promise<User> {
  return { id, name: 'Jane Doe' };
}

async function saveUser(user: User): Promise<void> {
  console.log('Saving user', user);
}

class UserImpl {
  static getById(id: number): ResultAsync<UserImpl, Error> {
    return new ResultAsync(
      getUser({ id })
        .then((user) => ok(new UserImpl(user)))
        .catch((error) => err(new Error(`failed to get user ${error}`))),
    );
  }

  constructor(private user: User) {}

  update(input: Partial<Omit<User, 'id'>>): Result<UserImpl, Error> {
    if (input.name === '') {
      return err(new Error('name cannot be empty'));
    }

    return ok(new UserImpl({ ...this.user, ...input }));
  }

  save(): ResultAsync<User, Error> {
    return new ResultAsync(
      saveUser(this.user)
        .then(() => ok(this.user))
        .catch((error) => err(new Error(`failed to save user ${error}`))),
    );
  }
}

async function main() {
  const user = await UserImpl.getById(123)
    .andThen((user) => user.update({ name: 'John Doe' }))
    .andThen((user) => user.save());

  if (user.isOk()) {
    console.log('Saved user', user.inner().name);
  } else {
    console.error(user.inner().message);
  }
}

void main();
