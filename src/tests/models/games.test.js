const { createGame } = require('../factories/game.factory');
const { resetDatabase, closeDatabase } = require('../helpers/db');

beforeEach(resetDatabase);

afterAll(closeDatabase);

describe('testear la creacion correcta de un videojuego y que falle cuando falte un dato', () => {
  test('crear un juego valido', async () => {
    const game = await createGame();
    expect(game.title).toBeDefined();
  });

  test('error por faltar el title', async () => {
    await expect(createGame({ title: null })).rejects.toThrow();
  });

  test('error por faltar el imgUrl', async () => {
    await expect(createGame({ imgUrl: null })).rejects.toThrow();
  });

  test('error por faltar category', async () => {
    await expect(createGame({ category: null })).rejects.toThrow();
  });

  test('error por falta de id, dado que este se coloca no es autoincrement', async () => {
    await expect(createGame({ id: null })).rejects.toThrow();
  });
});

describe('probar que no deja guardar dos juegos con el mismo id', () => {
  test('error al crear dos juegos con el mismo id', async () => {
    const game = await createGame({ id: 1 });
    expect(game.title).toBeDefined();
    await expect(createGame({ id: 1 })).rejects.toThrow();
  });
});
