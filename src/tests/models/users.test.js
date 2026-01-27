// En ningun modelo exporto sequelize. Sin embargo, sequelize es la instancia de conexion.
// Por lo que esta bien asi.
const { sequelize, User } = require('../../models');

// Reset de la bdd. En SQL TRUNCATE es para remove todas las columnas rapidamente
beforeEach(async () => {
  await sequelize.truncate({ cascade: true });
});

// Cerrar la bdd
afterAll(async () => {
  await sequelize.close();
});

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
