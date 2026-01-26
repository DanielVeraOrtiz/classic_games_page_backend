// src/tests/models/user.test.js
const { User } = require('../models');

test('crea un usuario válido', async () => {
  const user = await User.create({
    username: 'Alice',
    email: 'a@b.com',
    password: 'MejorMambo1724$',
  });
  expect(user.username).toBe('Alice');
});

test('email inválido lanza error', async () => {
  await expect(
    User.create({ username: 'Bob', email: 'invalid', password: '123' }),
  ).rejects.toThrow();
});
