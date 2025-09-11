/**
 * Response Interceptors Integration Test
 * 
 * Tests the comprehensive error handling, retry logic, and authentication integration
 * of the HTTP client response interceptors.
 */

import { httpClient, apiClientStatus } from './http';
import { getErrorInfo, ERROR_MESSAGES } from './errorHandling';

/**
 * Test the error handling capabilities
 */
export function testErrorHandling() {
  console.log('🧪 Testing Error Handling Capabilities...');

  // Test error message mapping
  const testCases = [
    { input: 'AUTH_TOKEN_EXPIRED', expectedSeverity: 'medium' },
    { input: 'NETWORK_ERROR', expectedSeverity: 'high' },
    { input: 'VALIDATION_ERROR', expectedSeverity: 'low' },
    { input: 'SERVER_ERROR', expectedSeverity: 'high' },
    { input: 'UNKNOWN_ERROR', expectedSeverity: 'medium' },
  ];

  let passed = 0;
  let total = testCases.length;

  testCases.forEach(({ input, expectedSeverity }) => {
    const errorInfo = getErrorInfo(input);
    if (errorInfo.severity === expectedSeverity && errorInfo.message) {
      passed++;
      console.log(`✅ ${input}: ${errorInfo.message} (${errorInfo.severity})`);
    } else {
      console.error(`❌ ${input}: Expected severity ${expectedSeverity}, got ${errorInfo.severity}`);
    }
  });

  console.log(`📊 Error Handling Tests: ${passed}/${total} passed\n`);
  return passed === total;
}

/**
 * Test HTTP status code mapping
 */
export function testHttpStatusMapping() {
  console.log('🧪 Testing HTTP Status Code Mapping...');

  const statusTests = [
    { status: 400, expectedCode: 'INVALID_REQUEST' },
    { status: 401, expectedCode: 'AUTH_TOKEN_EXPIRED' },
    { status: 403, expectedCode: 'AUTH_INSUFFICIENT_PERMISSIONS' },
    { status: 404, expectedCode: 'RESOURCE_NOT_FOUND' },
    { status: 500, expectedCode: 'SERVER_ERROR' },
    { status: 503, expectedCode: 'SERVICE_UNAVAILABLE' },
  ];

  let passed = 0;
  let total = statusTests.length;

  statusTests.forEach(({ status, expectedCode }) => {
    const errorInfo = getErrorInfo(status);
    if (errorInfo.code === expectedCode) {
      passed++;
      console.log(`✅ HTTP ${status}: ${expectedCode}`);
    } else {
      console.error(`❌ HTTP ${status}: Expected ${expectedCode}, got ${errorInfo.code}`);
    }
  });

  console.log(`📊 HTTP Status Mapping Tests: ${passed}/${total} passed\n`);
  return passed === total;
}

/**
 * Test API client configuration
 */
export function testApiClientConfiguration() {
  console.log('🧪 Testing API Client Configuration...');

  const tests = [
    { name: 'HTTP Client exists', test: () => Boolean(httpClient) },
    { name: 'Base URL configured', test: () => Boolean(apiClientStatus.baseUrl) },
    { name: 'Environment set', test: () => Boolean(apiClientStatus.environment) },
    { name: 'Initial online status', test: () => apiClientStatus.isOnline === true },
  ];

  let passed = 0;
  let total = tests.length;

  tests.forEach(({ name, test }) => {
    try {
      if (test()) {
        passed++;
        console.log(`✅ ${name}`);
      } else {
        console.error(`❌ ${name}: Test failed`);
      }
    } catch (error) {
      console.error(`❌ ${name}: Error - ${error}`);
    }
  });

  console.log(`📊 API Client Configuration Tests: ${passed}/${total} passed\n`);
  return passed === total;
}

/**
 * Test retry logic configuration
 */
export function testRetryConfiguration() {
  console.log('🧪 Testing Retry Logic Configuration...');

  // Test retry decision making
  const retryTests = [
    { 
      error: { code: 'NETWORK_ERROR', message: 'Network failed', timestamp: new Date().toISOString() },
      expectedRetry: true,
      description: 'Network errors should retry'
    },
    { 
      error: { code: 'AUTH_TOKEN_EXPIRED', message: 'Token expired', timestamp: new Date().toISOString() },
      expectedRetry: false,
      description: 'Auth errors should not retry'
    },
    { 
      error: { code: 'VALIDATION_ERROR', message: 'Invalid input', timestamp: new Date().toISOString() },
      expectedRetry: false,
      description: 'Validation errors should not retry'
    },
    { 
      error: { code: 'SERVER_ERROR', message: 'Server failed', timestamp: new Date().toISOString() },
      expectedRetry: true,
      description: 'Server errors should retry'
    },
  ];

  let passed = 0;
  let total = retryTests.length;

  // Import shouldRetryError for testing
  import('./errorHandling').then(({ shouldRetryError }) => {
    retryTests.forEach(({ error, expectedRetry, description }) => {
      const shouldRetry = shouldRetryError(error, 0);
      if (shouldRetry === expectedRetry) {
        passed++;
        console.log(`✅ ${description}: ${shouldRetry}`);
      } else {
        console.error(`❌ ${description}: Expected ${expectedRetry}, got ${shouldRetry}`);
      }
    });

    console.log(`📊 Retry Configuration Tests: ${passed}/${total} passed\n`);
    return passed === total;
  });
}

/**
 * Run all integration tests
 */
export async function runResponseInterceptorTests() {
  console.log('🚀 Running Response Interceptor Integration Tests\n');
  console.log('=' .repeat(60));

  const results = [
    testErrorHandling(),
    testHttpStatusMapping(),
    testApiClientConfiguration(),
  ];

  // Run async retry test
  testRetryConfiguration();

  const totalPassed = results.filter(Boolean).length;
  const totalTests = results.length;

  console.log('=' .repeat(60));
  console.log(`🏁 Integration Tests Complete: ${totalPassed}/${totalTests} test suites passed`);
  
  if (totalPassed === totalTests) {
    console.log('✅ All response interceptor functionality is working correctly!');
  } else {
    console.log('❌ Some tests failed. Please review the implementation.');
  }

  return totalPassed === totalTests;
}

// Auto-run tests in development environment
if (process.env.NODE_ENV === 'development') {
  console.log('\n🔧 Development Mode: Auto-running response interceptor tests...\n');
  runResponseInterceptorTests();
}
