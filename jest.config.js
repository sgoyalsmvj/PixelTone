module.exports = {
  projects: [
    {
      displayName: 'shared-types',
      testMatch: ['<rootDir>/packages/shared-types/**/*.test.ts'],
      preset: 'ts-jest',
      testEnvironment: 'node',
    },
    {
      displayName: 'api-gateway',
      testMatch: ['<rootDir>/apps/api-gateway/**/*.test.ts'],
      preset: 'ts-jest',
      testEnvironment: 'node',
    },
    {
      displayName: 'nlp-service',
      testMatch: ['<rootDir>/apps/nlp-service/**/*.test.ts'],
      preset: 'ts-jest',
      testEnvironment: 'node',
    },
    {
      displayName: 'generation-service',
      testMatch: ['<rootDir>/apps/generation-service/**/*.test.ts'],
      preset: 'ts-jest',
      testEnvironment: 'node',
    },
    {
      displayName: 'frontend',
      testMatch: ['<rootDir>/apps/frontend/**/*.test.{ts,tsx}'],
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/apps/frontend/jest.setup.js'],
    },
  ],
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/.next/**',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
};