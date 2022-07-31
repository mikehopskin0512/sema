import * as userService from '../../src/users/userService';

export default async function createUser(attributes = {}) {
  const user = await userService.create({
    username: 'Ada',
    password: 's3cr3t',
    firstName: 'Ada',
    lastName: 'Lovelace',
    identities: [
      {
        email: 'ada@example.com',
        provider: 'github',
        id: '123456',
      },
    ],
    terms: true,
    ...attributes,
  });
  return user;
}
