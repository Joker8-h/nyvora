module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@nyvora/database(.*)$': '<rootDir>/../../../packages/database/src$1',
    '^@nyvora/types(.*)$': '<rootDir>/../../../packages/types/src$1',
    '^@nyvora/shared(.*)$': '<rootDir>/../../../packages/shared/src$1',
  },
};
