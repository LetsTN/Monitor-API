/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const { resolve } = require('path');
const root = resolve(__dirname);

module.exports = {
  rootDir: root,
	testMatch: ["<rootDir>/src/**/*.test.ts"], 
	testEnvironment: 'node',
	collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  clearMocks: true,
  preset: 'ts-jest',
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
    '@test/(.*)': '<rootDir>/test/$1',
  },
};