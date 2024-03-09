import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  moduleDirectories: ['node_modules', 'src'],
  modulePathIgnorePatterns: ['__tests__/mocks/*', '<rootDir>/.*/__mocks__'],
  setupFiles: [
    '<rootDir>/.jest/setEnvVars.ts',
    '<rootDir>/.jest/loggerMock.ts',
  ],
};
export default config;
