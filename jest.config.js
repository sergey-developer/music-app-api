/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const { pathsToModuleNameMapper } = require('ts-jest')

const { compilerOptions } = require('./tsconfig')

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  modulePathIgnorePatterns: [
    '<rootDir>/node_modules',
    '<rootDir>/config',
    '<rootDir>/__tests__/fakeData',
    '<rootDir>/__tests__/utils',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}
