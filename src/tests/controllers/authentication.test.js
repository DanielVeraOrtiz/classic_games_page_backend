// src/tests/controllers/characters.test.js
const request = require('supertest');
const app = require('../../app');

describe('GET /show', () => {
  test('retorna la lista de personajes', async () => {
    const response = await request(app.callback()).get('/characters/show');
    console.log(response.text);
    console.log(await response.text);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(1);

    expect(response.body[0]).toMatchObject({
      name: 'Bart Simpson',
      age: 12,
      description: 'Ni idea',
    });
  });
});
