module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/../tests/server'],
  // Permite que los tests (fuera de server/) resuelvan paquetes de server/node_modules (ej. supertest).
  modulePaths: ['<rootDir>/node_modules'],
  setupFiles: ['<rootDir>/../tests/server/jest.setup.js'],
  setupFilesAfterEnv: ['<rootDir>/../tests/server/jest.setupAfterEnv.js'],
  verbose: true,
};
