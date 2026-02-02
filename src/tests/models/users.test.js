// Faltarian test cuando se tengan mas validaciones de largo min y maximo por ejemplo.
// Tambien test de intentar meter otro tipo de dato en los campos y que de toThrow(DatabaseError)
// (opcional en este caso)
const { resetDatabase, closeDatabase } = require('../helpers/db');
const { createUser, destroyUser } = require('../factories/user.factory');
const { createGame, findGame } = require('../factories/game.factory');
const { createFavorite } = require('../factories/favorite.factory');
const { ValidationError, UniqueConstraintError } = require('sequelize');

beforeEach(async () => await resetDatabase());

afterAll(async () => await closeDatabase());

describe('crear usuarios probando rellenar todos los campos y solo rellenar algunos', () => {
  test('crear un usuario válido', async () => {
    const user = await createUser();
    expect(user.username).toBeDefined();
  });

  test('crear un usario sin username', async () => {
    await expect(createUser({ username: null })).rejects.toThrow(ValidationError);
  });

  test('crear un usuario sin email', async () => {
    await expect(createUser({ email: null })).rejects.toThrow(ValidationError);
  });

  test('crear un usuario sin password', async () => {
    await expect(createUser({ password: null })).rejects.toThrow(ValidationError);
  });
});

describe('validaciones username diferentes a dejar el campo en blanco', () => {
  test('crear un usuario valido con username en caracteres alfanumericos', async () => {
    const user = await createUser();

    expect(user.username).toBeDefined();
  });

  test('crear usuario invalido con username con mas caracteres que los alfanumericos', async () => {
    await expect(createUser({ username: 'user./5' })).rejects.toThrow(ValidationError);
  });

  test('crear usuarios validos con el mismo username', async () => {
    const user = await createUser({ username: 'sameuser' });
    expect(user.username).toBeDefined();
    const user2 = await createUser({ username: 'sameuser' });
    expect(user2.username).toBeDefined();
  });
});

describe('validaciones email diferentes a dejar el campo en blanco', () => {
  test('crear usuario valido con email con @', async () => {
    const user = await createUser();

    expect(user.username).toBeDefined();
  });

  test('crear usuario con email invalido sin @', async () => {
    await expect(createUser({ email: 'user1#email.com' })).rejects.toThrow(ValidationError);
  });

  test('crear un usuario invalido con email repetido', async () => {
    const user = await createUser({ email: 'user1@email.com' });
    expect(user.username).toBeDefined();

    await expect(createUser({ email: 'user1@email.com' })).rejects.toThrow(UniqueConstraintError);
  });
});

describe('validaciones a password diferentes a dejar el campo en blanco', () => {
  test('crear un usuario valido con una password con letra, numero y caracter especial', async () => {
    const user = await createUser();

    expect(user.username).toBeDefined();
  });

  test('crear un usuario invalido con un password sin numeros', async () => {
    await expect(createUser({ password: 'Password$' })).rejects.toThrow(ValidationError);
  });

  test('crear un usuario invalido con un password sin letras', async () => {
    await expect(createUser({ password: '1234567$' })).rejects.toThrow(ValidationError);
  });

  test('crear un usuario invalido con un password sin caracteres especiales', async () => {
    await expect(createUser({ password: 'Password2' })).rejects.toThrow(ValidationError);
  });

  test('crear dos usuarios diferentes validos con la misma password', async () => {
    // No hace falta overridear nada, dado que username y email usan una variable counter para cambiar
    // los inputs en cada llamada.
    const user = await createUser();
    expect(user.username).toBeDefined();
    const user2 = await createUser();
    expect(user2.username).toBeDefined();
  });
});

describe('comportamiento no esperado de borrado en cascada', () => {
  test('borrar un usuario NO borra un juego', async () => {
    const user = await createUser();
    const game = await createGame();

    await createFavorite(user.id, game.id);

    await destroyUser(user.id);

    await expect(findGame(game.id)).resolves.not.toBeNull();
  });
});
