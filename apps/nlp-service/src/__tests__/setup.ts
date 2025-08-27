// Test setup file for NLP service
// This file runs before each test file

// Mock console methods to reduce noise in test output
global.console = {
  ...console,
  // Uncomment to silence console.log during tests
  // log: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  error: jest.fn(),
};

// Set test timeout
jest.setTimeout(10000);

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.NLP_SERVICE_PORT = '3002';