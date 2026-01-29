const app = require('../../app');
const request = require('supertest');
const { createToken } = require('../../lib/auth/jwt');
const { createUser } = require('../factories/user.factory');
const { resetDatabase, closeDatabase } = require('../helpers/db');

beforeEach(async () => {
  await resetDatabase();

  for (let i = 0; i < 5; i++) {
    await createUser();
  }
});

afterAll(async () => await closeDatabase());

describe.skip('GET /users/', () => {
  test('obtiene todos los usuarios de forma exitosa', async () => {
    const token = createToken(['user', 'admin'], 1, '24h');

    const response = await request(app.callback())
      .get('/users/')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toHaveLength(5);
    response.body.forEach((u) => {
      expect(u).toMatchObject({
        id: expect.any(Number),
        username: expect.any(String),
        email: expect.any(String),
      });
    });
  });

  test('error por no mandar token', async () => {
    const response = await request(app.callback())
      .get('/users/')
      .expect(401)
      .expect('Content-Type', /text\/plain/);

    expect(response.text.toLowerCase()).toMatch(/error/);
  });

  test('error por mandar un token incorrecto', async () => {
    const response = await request(app.callback())
      .get('/users/')
      .set('Authorization', 'Bearer tokencualquiera')
      .expect(401)
      .expect('Content-Type', /text\/plain/);

    expect(response.text.toLowerCase()).toMatch(/error/);
  });

  test('error por no tener scope de admin', async () => {
    const token = createToken(['user'], 1, '24h');

    const response = await request(app.callback())
      .get('/users/')
      .set('Authorization', `Bearer ${token}`)
      .expect(403)
      .expect('Content-Type', /text\/plain/);

    expect(response.text).toBeDefined();
  });
});

describe.skip('GET users/:id', () => {
  test('obtengo el usuario de id 3', async () => {
    const token = createToken(['user', 'admin'], 1, '24h');

    const response = await request(app.callback())
      .get('/users/3')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toMatchObject({
      id: expect.any(Number),
      username: expect.any(String),
      email: expect.any(String),
      password: expect.any(String),
    });
  });

  test('error por no mandar token', async () => {
    const response = await request(app.callback())
      .get('/users/3')
      .expect(401)
      .expect('Content-Type', /text\/plain/);

    expect(response.text.toLowerCase()).toMatch(/error/);
  });

  test('error por mandar un token incorrecto', async () => {
    const response = await request(app.callback())
      .get('/users/3')
      .set('Authorization', 'Bearer tokencualquiera')
      .expect(401)
      .expect('Content-Type', /text\/plain/);

    expect(response.text.toLowerCase()).toMatch(/error/);
  });

  test('error por no tener scope de admin', async () => {
    const token = createToken(['user'], 1, '24h');

    const response = await request(app.callback())
      .get('/users/3')
      .set('Authorization', `Bearer ${token}`)
      .expect(403)
      .expect('Content-Type', /text\/plain/);

    expect(response.text).toBeDefined();
  });

  test('error por mandar a la ruta equivocada', async () => {
    const token = createToken(['user', 'admin'], 1, '24h');

    const response = await request(app.callback())
      .get('/users/d')
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toBeDefined();
    expect(response.body.name).toMatch(/error/i);
  });
});

describe.skip('GET /users/auth/me', () => {
  test('obtengo los datos del usuario con token valido', async () => {
    const token = createToken(['user'], 1, '24h');

    const response = await request(app.callback())
      .get('/users/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toMatchObject({
      user: {
        id: expect.any(Number),
        username: expect.any(String),
        email: expect.any(String),
      },
      id: expect.any(String),
      scope: expect.any(Array),
    });
  });

  // Sabemos que por koa hay authentication error por token malo, asi que dejemoslo fuera
  // probemos con token bueno, pero de un usuario con id que no existe

  test('error por token valido, pero con usuario no existente', async () => {
    const token = createToken(['user'], 10, '24h');

    const response = await request(app.callback())
      .get('/users/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(400);

    expect(response.text.toLowerCase).toBeDefined();
  });
});
