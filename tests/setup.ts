// Test setup configuration
import { config } from 'dotenv';

// Load environment variables for testing
config({ path: '.env.test' });

// Global test configuration
beforeAll(() => {
  // Setup test database or mock services
  console.log('Setting up test environment...');
});

afterAll(() => {
  // Cleanup test resources
  console.log('Cleaning up test environment...');
});

// Mock console methods to reduce noise in tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeEach(() => {
  console.log = jest.fn();
  console.error = jest.fn();
});

afterEach(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
}); 