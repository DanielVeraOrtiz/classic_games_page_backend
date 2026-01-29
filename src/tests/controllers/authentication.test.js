// src/tests/controllers/characters.test.js
const request = require('supertest');
const app = require('../../app');
const { buildUser, createUser } = require('../factories/user.factory');
const { resetDatabase, closeDatabase } = require('../helpers/db');
const bcrypt = require('bcrypt');

beforeEach(async () => await resetDatabase());

afterAll(async () => await closeDatabase());

// Muy basico
// describe('POST /signup', () => {
//   test('crea un usuario y devuelve el jwt de este', async () => {
//     const response = await request(app.callback())
//       .post('/signup')
//       .send(buildUser())
//       .set('Accept', 'application/json')
//       .expect(201);
//     // .expect('Content-Type', /application\/json/);

//     expect(response.body.user).toBeDefined();
//     expect(response.body.access_token).toBeDefined();
//     expect(response.body.token_type).toBeDefined();
//   });
// });

describe('POST /signup', () => {
  test('crea un usuario y retorna credenciales JWT válidas', async () => {
    const response = await request(app.callback())
      .post('/signup')
      .send(buildUser())
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toMatchObject({
      user: expect.any(Object),
      access_token: expect.any(String),
      token_type: 'Bearer',
    });

    expect(response.body.access_token.split('.')).toHaveLength(3);

    expect(response.body.user).toMatchObject({
      id: expect.any(Number),
      username: expect.any(String),
      email: expect.any(String),
    });

    expect(response.body.user).not.toHaveProperty('password');
  });

  test('error por intentar crear un usuario con un email que ya existe', async () => {
    const user = await createUser();
    const response = await request(app.callback())
      .post('/signup')
      .send({
        username: user.username,
        email: user.email,
        password: user.password,
      })
      .expect(400);

    expect(response.text.toLowerCase()).toMatch(/email already exists/);
    expect(response.text.length).toBeGreaterThan(0);
  });

  test('error por intentar crear un usuario con email invalido', async () => {
    const response = await request(app.callback())
      .post('/signup')
      .send(buildUser({ email: 'emailinvalido' }))
      .expect(400);

    expect(response.text.toLowerCase()).toMatch(/email format/);
  });
});

describe('POST /login', () => {
  test('se loguea exitosamente', async () => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('Password1$', saltRounds);
    const user = await createUser({ password: hashedPassword });

    const response = await request(app.callback())
      .post('/login')
      .send({
        email: user.email,
        password: 'Password1$',
      })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toMatchObject({
      user: {
        id: expect.any(Number),
        username: expect.any(String),
        email: expect.any(String),
      },
      access_token: expect.any(String),
      token_type: 'Bearer',
    });

    expect(response.body.user).not.toHaveProperty('password');
    expect(response.body.access_token.split('.')).toHaveLength(3);
  });

  test('error por no proporcionar un email correcto', async () => {
    const response = await request(app.callback())
      .post('/login')
      .send({
        email: 'emailquenoexiste',
        password: 'nada que ver',
      })
      .expect(400)
      .expect('Content-Type', /text\/plain/);

    expect(response.text.toLowerCase()).toMatch(/incorrect email or password/);
  });

  test('error por no proporcionar un email', async () => {
    const response = await request(app.callback())
      .post('/login')
      .send({
        password: 'nada que ver',
      })
      .expect(400)
      .expect('Content-Type', /text\/plain/);

    // entra al catch haciendo findOne con undefined y bcrypt.compare con undefined
    expect(response.text.toLowerCase()).toMatch(/could not sign in/);
  });

  test('error por no proporcionar una password correcta', async () => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('Password1$', saltRounds);
    const user = await createUser({ password: hashedPassword });

    const response = await request(app.callback())
      .post('/login')
      .send({
        email: user.email,
        password: 'Password2$',
      })
      .expect(400)
      .expect('Content-Type', /text\/plain/);

    expect(response.text.toLowerCase()).toMatch(/incorrect email or password/);
  });

  test('error por no proporcionar una password', async () => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('Password1$', saltRounds);
    const user = await createUser({ password: hashedPassword });

    const response = await request(app.callback())
      .post('/login')
      .send({
        email: user.email,
      })
      .expect(400)
      .expect('Content-Type', /text\/plain/);

    expect(response.text.toLowerCase()).toMatch(/could not sign in/);
  });
});
