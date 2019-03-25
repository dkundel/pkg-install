module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  testPathIgnorePatterns: ['/node_modules/', 'lib/', 'types.ts'],
  roots: ['<rootDir>/src/'],
};
