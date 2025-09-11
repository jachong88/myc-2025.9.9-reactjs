/**
 * API Type Definitions Test Suite
 * 
 * Comprehensive tests and examples demonstrating the usage of all API types.
 * Validates type safety and provides usage examples for developers.
 */

import type {
  // Core Response Types
  APIResponse,
  APIErrorResponse,
  ValidationError,
  ResponseMetadata,
  
  // CRUD Types
  CreateResponse,
  UpdateResponse,
  DeleteResponse,
  BulkResponse,
  BulkOperationSummary,
  BulkOperationResult,
  BulkOperationFailure,
  
  // Pagination Types
  PaginatedResponse,
  PaginationMetadata,
  PaginationParams,
  SortOrder,
  SortingInfo,
  FilterInfo,
  FilterOperator,
  SearchInfo,
  
  // Request Types
  BaseQueryParams,
  ListQueryParams,
  FilterParam,
  DateRangeFilter,
  BulkOperationRequest,
  BulkOperationType,
  BulkOperationOptions,
  
  // Metadata Types
  RateLimitInfo,
  CacheInfo,
  DeprecationWarning,
  APIVersionInfo,
  
  // Utility Types
  ResourceId,
  TimestampFields,
  AuditFields,
  SoftDeleteFields,
  
  // Legacy
  APIError,
} from './api';

// Sample domain types for testing
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

/**
 * Test Core Response Types
 */
export function testCoreResponseTypes() {
  console.log('🧪 Testing Core Response Types...');

  // Test APIResponse
  const successResponse: APIResponse<User> = {
    data: {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
    },
    success: true,
    timestamp: '2025-01-01T00:00:00Z',
    message: 'User retrieved successfully',
    requestId: 'req-123',
  };

  // Test APIErrorResponse
  const errorResponse: APIErrorResponse = {
    code: 'USER_NOT_FOUND',
    message: 'User with ID 123 not found',
    success: false,
    timestamp: '2025-01-01T00:00:00Z',
    requestId: 'req-124',
    errors: [
      {
        field: 'userId',
        code: 'NOT_FOUND',
        message: 'User ID does not exist',
        value: '123',
      }
    ],
  };

  // Test ResponseMetadata
  const metadata: ResponseMetadata = {
    processingTime: 150,
    rateLimit: {
      limit: 1000,
      remaining: 999,
      resetTime: 1735689600,
      windowSize: 3600,
    },
    cache: {
      hit: false,
      key: 'user:123',
      ttl: 300,
    },
  };

  console.log('✅ Core response types validated');
  return { successResponse, errorResponse, metadata };
}

/**
 * Test CRUD Operation Types
 */
export function testCRUDTypes() {
  console.log('🧪 Testing CRUD Operation Types...');

  // Test CreateResponse
  const createResponse: CreateResponse<User> = {
    data: {
      id: '124',
      email: 'new@example.com',
      name: 'New User',
      role: 'user',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
    },
    success: true,
    timestamp: '2025-01-01T00:00:00Z',
    statusCode: 201,
    location: '/api/users/124',
    message: 'User created successfully',
  };

  // Test UpdateResponse
  const updateResponse: UpdateResponse<User> = {
    data: {
      id: '124',
      email: 'updated@example.com',
      name: 'Updated User',
      role: 'user',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T01:00:00Z',
    },
    success: true,
    timestamp: '2025-01-01T01:00:00Z',
    statusCode: 200,
    updatedFields: ['email', 'name'],
    previousVersion: {
      email: 'new@example.com',
      name: 'New User',
    },
  };

  // Test DeleteResponse
  const deleteResponse: DeleteResponse = {
    data: null,
    success: true,
    timestamp: '2025-01-01T02:00:00Z',
    statusCode: 204,
    deleted: true,
    deletionType: 'soft',
  };

  // Test BulkResponse
  const bulkResponse: BulkResponse<Product> = {
    data: [
      { id: 1, name: 'Product 1', price: 10.99, category: 'A', inStock: true },
      { id: 2, name: 'Product 2', price: 15.99, category: 'B', inStock: false },
    ],
    success: true,
    timestamp: '2025-01-01T03:00:00Z',
    summary: {
      total: 3,
      successful: 2,
      failed: 1,
      skipped: 0,
      processingTime: 500,
    },
    failures: [
      {
        index: 2,
        id: 3,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid price',
          timestamp: '2025-01-01T03:00:00Z',
        },
        input: { name: 'Product 3', price: -5 },
      }
    ],
  };

  console.log('✅ CRUD operation types validated');
  return { createResponse, updateResponse, deleteResponse, bulkResponse };
}

/**
 * Test Pagination Types
 */
export function testPaginationTypes() {
  console.log('🧪 Testing Pagination Types...');

  // Test PaginatedResponse
  const paginatedResponse: PaginatedResponse<User> = {
    data: [
      {
        id: '1',
        email: 'user1@example.com',
        name: 'User One',
        role: 'user',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      },
      {
        id: '2',
        email: 'user2@example.com',
        name: 'User Two',
        role: 'admin',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      },
    ],
    success: true,
    timestamp: '2025-01-01T00:00:00Z',
    pagination: {
      page: 1,
      limit: 20,
      total: 150,
      totalPages: 8,
      hasNext: true,
      hasPrevious: false,
      startIndex: 0,
      endIndex: 19,
    },
    sorting: {
      field: 'createdAt',
      order: 'desc',
      availableFields: ['createdAt', 'name', 'email'],
    },
    filters: [
      {
        field: 'role',
        operator: 'eq',
        value: 'admin',
        label: 'Admin Users Only',
      },
    ],
    search: {
      query: 'john',
      fields: ['name', 'email'],
      stats: {
        matches: 2,
        processingTime: 45,
      },
    },
  };

  // Test ListQueryParams
  const queryParams: ListQueryParams = {
    page: 1,
    limit: 50,
    sort: 'name',
    order: 'asc',
    search: 'john',
    searchFields: ['name', 'email'],
    filters: [
      { field: 'role', operator: 'in', value: ['admin', 'user'] },
      { field: 'createdAt', operator: 'gte', value: '2024-01-01' },
    ],
    dateRange: {
      start: '2024-01-01T00:00:00Z',
      end: '2024-12-31T23:59:59Z',
      field: 'createdAt',
    },
    includeDeleted: false,
    fields: ['id', 'name', 'email', 'role'],
    include: ['profile', 'permissions'],
  };

  console.log('✅ Pagination types validated');
  return { paginatedResponse, queryParams };
}

/**
 * Test Request Types
 */
export function testRequestTypes() {
  console.log('🧪 Testing Request Types...');

  // Test BulkOperationRequest
  const bulkRequest: BulkOperationRequest<Partial<Product>> = {
    operation: 'update',
    items: [
      { id: 1, price: 12.99 },
      { id: 2, inStock: true },
      { id: 3, name: 'Updated Product 3' },
    ],
    options: {
      continueOnError: true,
      validateFirst: true,
      batchSize: 10,
      includeResults: true,
    },
  };

  // Test Filter Parameters
  const filterParams: FilterParam[] = [
    { field: 'status', operator: 'eq', value: 'active' },
    { field: 'price', operator: 'gte', value: 10 },
    { field: 'category', operator: 'in', value: ['electronics', 'books'] },
    { field: 'name', operator: 'contains', value: 'laptop' },
  ];

  console.log('✅ Request types validated');
  return { bulkRequest, filterParams };
}

/**
 * Test Metadata Types
 */
export function testMetadataTypes() {
  console.log('🧪 Testing Metadata Types...');

  const rateLimitInfo: RateLimitInfo = {
    limit: 5000,
    remaining: 4950,
    resetTime: 1735689600,
    windowSize: 3600,
  };

  const cacheInfo: CacheInfo = {
    hit: true,
    key: 'products:page:1:limit:20',
    ttl: 600,
    generatedAt: '2025-01-01T00:00:00Z',
  };

  const deprecationWarning: DeprecationWarning = {
    feature: 'Legacy User API v1',
    message: 'This API version is deprecated and will be removed',
    sunsetDate: '2025-06-01',
    migrationGuide: 'https://docs.example.com/migration/v2',
  };

  const versionInfo: APIVersionInfo = {
    version: '2.1.0',
    latest: '2.1.0',
    supported: ['2.0.0', '2.1.0'],
    releaseDate: '2024-12-01',
  };

  console.log('✅ Metadata types validated');
  return { rateLimitInfo, cacheInfo, deprecationWarning, versionInfo };
}

/**
 * Test Utility Types
 */
export function testUtilityTypes() {
  console.log('🧪 Testing Utility Types...');

  // Test ResourceId
  const stringId: ResourceId = 'user-123';
  const numberId: ResourceId = 456;

  // Test TimestampFields
  const timestampData: TimestampFields = {
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T01:00:00Z',
    deletedAt: '2025-01-01T02:00:00Z',
  };

  // Test AuditFields
  const auditData: AuditFields = {
    ...timestampData,
    createdBy: 'user-admin',
    updatedBy: 'user-admin',
    deletedBy: 'user-admin',
    version: 3,
  };

  // Test SoftDeleteFields
  const softDeleteData: SoftDeleteFields = {
    deleted: true,
    deletedAt: '2025-01-01T02:00:00Z',
    deletedBy: 'user-admin',
  };

  console.log('✅ Utility types validated');
  return { stringId, numberId, timestampData, auditData, softDeleteData };
}

/**
 * Run All API Type Tests
 */
export function runAPITypeTests() {
  console.log('🚀 Running Comprehensive API Type Tests\n');
  console.log('=' .repeat(60));

  const results = {
    core: testCoreResponseTypes(),
    crud: testCRUDTypes(),
    pagination: testPaginationTypes(),
    requests: testRequestTypes(),
    metadata: testMetadataTypes(),
    utilities: testUtilityTypes(),
  };

  console.log('=' .repeat(60));
  console.log('🏁 All API type tests completed successfully!');
  
  console.log('\n📋 API Type System Summary:');
  console.log('✅ Core response envelopes with metadata');
  console.log('✅ CRUD operation types with status codes');
  console.log('✅ Advanced pagination with sorting/filtering');
  console.log('✅ Comprehensive error handling');
  console.log('✅ Bulk operation support');
  console.log('✅ Request parameter types');
  console.log('✅ API metadata and versioning');
  console.log('✅ Utility types for common patterns');
  console.log('✅ Legacy compatibility maintained');

  console.log('\n🎯 Type System Benefits:');
  console.log('🔒 Full TypeScript type safety');
  console.log('📖 Self-documenting API contracts');
  console.log('🔄 Consistent response formats');
  console.log('⚡ Enhanced developer experience');
  console.log('🧪 Testable and maintainable');
  console.log('🔗 Frontend/backend contract alignment');

  return results;
}

/**
 * Usage Examples for Developers
 */
export function showUsageExamples() {
  console.log('\n📚 API Type Usage Examples:');
  
  console.log(`
// 1. Standard API Response
const userResponse: APIResponse<User> = await api.get('/users/123');
if (userResponse.success) {
  const user = userResponse.data; // Fully typed User object
}

// 2. Paginated List Response
const usersResponse: PaginatedResponse<User> = await api.get('/users', {
  params: queryParams
});
const users = usersResponse.data; // User[]
const pagination = usersResponse.pagination; // PaginationMetadata

// 3. CRUD Operations
const createResponse: CreateResponse<User> = await api.post('/users', userData);
const updateResponse: UpdateResponse<User> = await api.put('/users/123', updates);
const deleteResponse: DeleteResponse = await api.delete('/users/123');

// 4. Bulk Operations
const bulkRequest: BulkOperationRequest<User> = {
  operation: 'update',
  items: userUpdates,
  options: { continueOnError: true }
};
const bulkResponse: BulkResponse<User> = await api.post('/users/bulk', bulkRequest);

// 5. Error Handling
try {
  const response = await api.get('/users/invalid');
} catch (error: APIErrorResponse) {
  console.error(error.message);
  error.errors?.forEach(validationError => {
    console.error(\`\${validationError.field}: \${validationError.message}\`);
  });
}
`);
}

// Auto-run tests in development environment
if (process.env.NODE_ENV === 'development') {
  console.log('\n🔧 Development Mode: Auto-running API type tests...\n');
  runAPITypeTests();
  showUsageExamples();
}
