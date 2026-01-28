export default {
  testEnvironment: 'node',

  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],

  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/app.js',
    '!src/migrations/**',
    '!src/seeders/**',
    '!src/config/**',
    '!src/models/index.js',
    '!src/tests/factories/**',
  ],

  coverageThreshold: {
    global: {
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80,
    },
  },
};
