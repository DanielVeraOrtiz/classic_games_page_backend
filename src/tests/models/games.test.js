// Faltarian test cuando se tengan mas validaciones de largo min y maximo por ejemplo.
// Tambien test de intentar meter otro tipo de dato en los campos y que de toThrow(DatabaseError)
// (opcional en este caso)

const { createUser, findUser } = require('../factories/user.factory');
const { createGame, destroyGame } = require('../factories/game.factory');
const { createFavorite } = require('../factories/favorite.factory');
const { resetDatabase, closeDatabase } = require('../helpers/db');
const { ValidationError, UniqueConstraintError } = require('sequelize');

beforeEach(async () => await resetDatabase());

afterAll(async () => await closeDatabase());

describe.skip('testear la creacion correcta de un videojuego y que falle cuando falte un dato', () => {
  test('crear un juego valido', async () => {
    const game = await createGame();
    expect(game.title).toBeDefined();
  });

  test('error por faltar el title', async () => {
    await expect(createGame({ title: null })).rejects.toThrow(ValidationError);
  });

  test('error por faltar el imgUrl', async () => {
    await expect(createGame({ imgUrl: null })).rejects.toThrow(ValidationError);
  });

  test('error por faltar category', async () => {
    await expect(createGame({ category: null })).rejects.toThrow(ValidationError);
  });

  test('error por falta de id, dado que este se coloca no es autoincrement', async () => {
    await expect(createGame({ id: null })).rejects.toThrow(ValidationError);
  });
});

describe.skip('probar que no deja guardar dos juegos con el mismo id', () => {
  test('error al crear dos juegos con el mismo id', async () => {
    const game = await createGame({ id: 1 });
    expect(game.title).toBeDefined();
    await expect(createGame({ id: 1 })).rejects.toThrow(UniqueConstraintError);
  });
});

describe.skip('comportamiento no esperado de borrado en cascada', () => {
  test('borrar un juego No borra usuarios', async () => {
    const user = await createUser();
    const game = await createGame();

    await createFavorite(user.id, game.id);

    await destroyGame(game.id);

    await expect(findUser(user.id)).resolves.not.toBeNull();
  });
});
