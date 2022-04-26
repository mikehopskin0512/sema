import * as userService from '../../src/users/userService';

export async function createUser(attributes = {}) {
  const user = await userService.create({
    username: 'Ada',
    password: 's3cr3t',
    firstName: 'Ada',
    lastName: 'Lovelace',
    identities: [{
      email: 'ada@example.com',
      provider: 'github'
    }],
    terms: true,
    ...attributes
  });
  return user;
}
