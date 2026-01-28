const { createUser, destroyUser, findUser } = require('../factories/user.factory');
const { createGame, destroyGame, findGame } = require('../factories/game.factory');
const { createFavorite, findFavorite, destroyFavorite } = require('../factories/favorite.factory');
const { resetDatabase, closeDatabase } = require('../helpers/db');
const { ValidationError, UniqueConstraintError, ForeignKeyConstraintError } = require('sequelize');

beforeEach(async () => await resetDatabase());

afterAll(async () => await closeDatabase());

describe.skip('creacion de valida de favorito y errores por campos sin rellenar', () => {
  test('creacion valida de favorito', async () => {
    const user = await createUser();
    const game = await createGame();

    const favorite = await createFavorite(user.id, game.id);
    expect(favorite.user_id).toBe(user.id);
    expect(favorite.game_id).toBe(game.id);
  });

  test('error por falta de user id', async () => {
    const game = await createGame();
    await expect(createFavorite(null, game.id)).rejects.toThrow(ValidationError);
  });

  test('error por falta de game id', async () => {
    const user = await createUser();
    await expect(createFavorite(user.id, null)).rejects.toThrow(ValidationError);
  });
});

describe.skip('error por no usar ids de user y games verdaderos, probar asociaciones', () => {
  test('error por user id que no existe en la bdd', async () => {
    const game = await createGame();
    await expect(createFavorite(1, game.id)).rejects.toThrow(ForeignKeyConstraintError);
  });

  test('error por game id que no existe en la bdd', async () => {
    const user = await createUser();
    await expect(createFavorite(user.id, 1)).rejects.toThrow(ForeignKeyConstraintError);
  });
});

describe.skip('probar que las multiplicidades con game y user funcione bien', () => {
  test('error por guardar dos veces el mismo par de user y games ids', async () => {
    const user = await createUser();
    const game = await createGame();
    const favorite = await createFavorite(user.id, game.id);
    expect(favorite.user_id).toBe(user.id);
    await expect(createFavorite(user.id, game.id)).rejects.toThrow(UniqueConstraintError);
  });

  test('un usuario puede tener muchos favoritos diferentes', async () => {
    const user = await createUser();
    const game1 = await createGame();
    const game2 = await createGame();

    const favorite_user_game1 = await createFavorite(user.id, game1.id);
    expect(favorite_user_game1.user_id).toBe(user.id);
    const favorite_user_game2 = await createFavorite(user.id, game2.id);
    expect(favorite_user_game2.user_id).toBe(user.id);
  });

  test('un juego puede ser favorito de muchos', async () => {
    const user1 = await createUser();
    const user2 = await createUser();
    const game = await createGame();

    const favorite_game_user1 = await createFavorite(user1.id, game.id);
    expect(favorite_game_user1.game_id).toBe(game.id);
    const favorite_game_user2 = await createFavorite(user2.id, game.id);
    expect(favorite_game_user2.game_id).toBe(game.id);
  });
});

describe.skip('probar los delete en cascada', () => {
  test('borrar un usuario borra sus favoritos', async () => {
    const user = await createUser();
    const game = await createGame();

    const favorite = await createFavorite(user.id, game.id);
    expect(favorite.user_id).toBe(user.id);
    const isDestroyed = await destroyUser(user.id);
    expect(isDestroyed).toBe(1);

    await expect(findFavorite(favorite.id)).resolves.toBeNull();
  });

  test('borrar un juego borra sus favoritos', async () => {
    const user = await createUser();
    const game = await createGame();

    const favorite = await createFavorite(user.id, game.id);
    expect(favorite.user_id).toBe(user.id);
    const isDestroyed = await destroyGame(game.id);
    expect(isDestroyed).toBe(1);

    await expect(findFavorite(favorite.id)).resolves.toBeNull();
  });

  test('borrar un favorito no borra usuario y juego', async () => {
    const user = await createUser();
    const game = await createGame();

    const favorite = await createFavorite(user.id, game.id);
    expect(favorite.user_id).toBe(user.id);
    const isDestroyed = await destroyFavorite(favorite.id);
    expect(isDestroyed).toBe(1);

    await expect(findUser(user.id)).resolves.not.toBeNull();
    await expect(findGame(game.id)).resolves.not.toBeNull();
  });
});
