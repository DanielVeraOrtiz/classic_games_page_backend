const { createToken } = require('../../lib/auth/jwt');

describe.skip('probar que funciona con los datos a utilizar', () => {
  test('no lanza error con datos validos', () => {
    expect(createToken(['user'], 5, '24h')).toBeDefined();
  });

  test('no lanza errores con datos validos mas complejos', () => {
    expect(createToken(['user', 'admin'], 10, '100h')).toBeDefined();
  });

  test('no da error incluso con otro tipo de datos', () => {
    expect(createToken({ scope: 'user' }, 10, 24)).toBeDefined();
  });
});
