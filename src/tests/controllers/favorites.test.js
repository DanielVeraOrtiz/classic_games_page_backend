const app = require('../../app');
const request = require('supertest');
const { createToken } = require('../../lib/auth/jwt');
const { createUser } = require('../factories/user.factory');
const { resetDatabase, closeDatabase } = require('../helpers/db');
const { createGame, buildGame } = require('../factories/game.factory');
const { createFavorite } = require('../factories/favorite.factory');

beforeEach(async () => {
  await resetDatabase();
  const users = [];
  const games = [];

  for (let i = 0; i < 2; i++) {
    users.push(await createUser());
  }
  for (let i = 0; i < 2; i++) {
    games.push(await createGame({ id: i + 1 }));
  }

  await createFavorite(users[0].id, games[0].id);
  await createFavorite(users[0].id, games[1].id);
  await createFavorite(users[1].id, games[1].id);
});

afterAll(async () => await closeDatabase());

describe('GET /favorites/me', () => {
  test('obtener todos mis favoritos de la forma correcta', async () => {
    const token = createToken(['user'], 1, '24h');

    const response = await request(app.callback())
      .get('/favorites/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toHaveLength(2);
    response.body.forEach((favorite) => {
      expect(favorite).toMatchObject({
        id: expect.any(Number),
        user_id: 1,
        game_id: expect.any(Number),
        game: expect.any(Object),
      });
    });
  });

  test('error por obtener todos los favoritos de un usuario queno existe', async () => {
    const token = createToken(['user'], 99999, '24h');

    const response = await request(app.callback())
      .get('/favorites/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect('Content-Type', /text\/plain/);

    expect(response.text).toBeDefined();
  });
});

describe('GET /favorites/:gameid', () => {
  test('obtener un favorito de forma correcta', async () => {
    const token = createToken(['user'], 1, '24h');

    const response = await request(app.callback())
      .get('/favorites/1')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toMatchObject({
      id: expect.any(Number),
      user_id: expect.any(Number),
      game_id: expect.any(Number),
    });
  });

  test('error por buscar un favorito que no tiene un usuario', async () => {
    const token = createToken(['user'], 1, '24h');

    const response = await request(app.callback())
      .get('/favorites/3')
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.message).toBeDefined();
  });

  test('error por buscar el favorito de un usuario que no existe', async () => {
    const token = createToken(['user'], 10, '24h');

    const response = await request(app.callback())
      .get('/favorites/1')
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.message).toBeDefined();
  });

  test('error por mandar un dato de tipo incorrecto en la ruta', async () => {
    const token = createToken(['user'], 10, '24h');

    const response = await request(app.callback())
      .get('/favorites/d')
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toBeDefined();
    expect(response.body.name).toBe('SequelizeDatabaseError');
  });
});

describe('POST /favorites/', () => {
  test('crear un juego y favorito de forma correcta', async () => {
    const token = createToken(['user'], 1, '24h');
    const game = buildGame({ id: 100 });

    const favorite = {
      user_id: 1,
      game_id: game.id,
      ...game,
    };

    const response = await request(app.callback())
      .post('/favorites/')
      .set('Authorization', `Bearer ${token}`)
      .send(favorite)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toMatchObject({
      id: expect.any(Number),
      user_id: expect.any(Number),
      game_id: expect.any(Number),
    });
  });

  test('crear un favorito de un juego guardado en la bdd de forma correcta', async () => {
    const token = createToken(['user'], 1, '24h');

    const favorite = {
      user_id: 2,
      game_id: 1,
    };

    const response = await request(app.callback())
      .post('/favorites/')
      .set('Authorization', `Bearer ${token}`)
      .send(favorite)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toMatchObject({
      id: expect.any(Number),
      user_id: expect.any(Number),
      game_id: expect.any(Number),
    });
  });

  test('error por no mandar game_id', async () => {
    const token = createToken(['user'], 1, '24h');

    const favorite = {
      user_id: 2,
    };

    const response = await request(app.callback())
      .post('/favorites/')
      .set('Authorization', `Bearer ${token}`)
      .send(favorite)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toBeDefined();
  });
});

describe('DELETE /favorites/:id', () => {
  test('borrar un favorito deforma exitosa', async () => {
    const token = createToken(['user'], 1, '24h');

    const response = await request(app.callback())
      .delete('/favorites/1')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.text).toBe('1');
  });

  test('error al intentar borrar algo que no existe', async () => {
    const token = createToken(['user'], 1, '24h');

    const response = await request(app.callback())
      .delete('/favorites/3')
      .set('Authorization', `Bearer ${token}`)
      .expect(404);

    expect(response.body).toBeDefined();
  });

  test('error pasar en la ruta otro tipo de dato', async () => {
    const token = createToken(['user'], 1, '24h');

    const response = await request(app.callback())
      .delete('/favorites/d')
      .set('Authorization', `Bearer ${token}`)
      .expect(500);

    expect(response.body).toBeDefined();
  });
});
