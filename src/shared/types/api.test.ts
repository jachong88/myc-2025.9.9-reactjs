/**
 * API Type Definitions Test Suite
 * 
 * Comprehensive tests validating type safety and structure of API types.
 */

import { describe, it, expect } from 'vitest';
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
  email: 'test@example.com';
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
function testCoreResponseTypes() {
  // This function would contain console.log based tests
  // but since we have proper Vitest tests above, we'll keep this minimal
  return { success: true };
}

describe('API Type Definitions', () => {
  describe('Core Response Types', () => {
    it('should support APIResponse structure', () => {
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

      expect(successResponse.data.id).toBe('123');
      expect(successResponse.success).toBe(true);
      expect(successResponse.data.role).toBe('user');
    });

    it('should support APIErrorResponse structure', () => {
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

      expect(errorResponse.success).toBe(false);
      expect(errorResponse.code).toBe('USER_NOT_FOUND');
      expect(errorResponse.errors).toHaveLength(1);
    });

    it('should support ResponseMetadata structure', () => {
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

      expect(metadata.processingTime).toBe(150);
      expect(metadata.rateLimit.limit).toBe(1000);
      expect(metadata.cache.hit).toBe(false);
    });
  });

  describe('CRUD Operation Types', () => {
    it('should support CreateResponse structure', () => {
      const createResponse: CreateResponse<User> = {
        data: {
          id: '124',
          email: 'test@example.com',
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

      expect(createResponse.statusCode).toBe(201);
      expect(createResponse.location).toBe('/api/users/124');
      expect(createResponse.data.id).toBe('124');
    });

    it('should support UpdateResponse structure', () => {
      const updateResponse: UpdateResponse<User> = {
        data: {
          id: '124',
          email: 'test@example.com',
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
          email: 'test@example.com',
          name: 'New User',
        },
      };

      expect(updateResponse.statusCode).toBe(200);
      expect(updateResponse.updatedFields).toContain('name');
      expect(updateResponse.previousVersion?.name).toBe('New User');
    });

    it('should support DeleteResponse structure', () => {
      const deleteResponse: DeleteResponse = {
        data: null,
        success: true,
        timestamp: '2025-01-01T02:00:00Z',
        statusCode: 204,
        deleted: true,
        deletionType: 'soft',
      };

      expect(deleteResponse.statusCode).toBe(204);
      expect(deleteResponse.deleted).toBe(true);
      expect(deleteResponse.deletionType).toBe('soft');
    });

    it('should support BulkResponse structure', () => {
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

      expect(bulkResponse.data).toHaveLength(2);
      expect(bulkResponse.summary.successful).toBe(2);
      expect(bulkResponse.failures).toHaveLength(1);
    });
  });

  describe('Pagination Types', () => {
    it('should support PaginatedResponse structure', () => {
      const paginatedResponse: PaginatedResponse<User> = {
        data: [
          {
            id: '1',
            email: 'test@example.com',
            name: 'User One',
            role: 'user',
            createdAt: '2025-01-01T00:00:00Z',
            updatedAt: '2025-01-01T00:00:00Z',
          },
          {
            id: '2',
            email: 'test@example.com',
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

      expect(paginatedResponse.data).toHaveLength(2);
      expect(paginatedResponse.pagination.total).toBe(150);
      expect(paginatedResponse.pagination.hasNext).toBe(true);
    });

    it('should support ListQueryParams structure', () => {
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

      expect(queryParams.page).toBe(1);
      expect(queryParams.limit).toBe(50);
      expect(queryParams.filters).toHaveLength(2);
    });
  });

  describe('Request Types', () => {
    it('should support BulkOperationRequest structure', () => {
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

      expect(bulkRequest.operation).toBe('update');
      expect(bulkRequest.items).toHaveLength(3);
      expect(bulkRequest.options?.continueOnError).toBe(true);
    });

    it('should support FilterParam structure', () => {
      const filterParams: FilterParam[] = [
        { field: 'status', operator: 'eq', value: 'active' },
        { field: 'price', operator: 'gte', value: 10 },
        { field: 'category', operator: 'in', value: ['electronics', 'books'] },
        { field: 'name', operator: 'contains', value: 'laptop' },
      ];

      expect(filterParams).toHaveLength(4);
      expect(filterParams[0].operator).toBe('eq');
      expect(filterParams[2].value).toEqual(['electronics', 'books']);
    });
  });

  describe('Metadata Types', () => {
    it('should support RateLimitInfo structure', () => {
      const rateLimitInfo: RateLimitInfo = {
        limit: 5000,
        remaining: 4950,
        resetTime: 1735689600,
        windowSize: 3600,
      };

      expect(rateLimitInfo.limit).toBe(5000);
      expect(rateLimitInfo.remaining).toBe(4950);
    });

    it('should support CacheInfo structure', () => {
      const cacheInfo: CacheInfo = {
        hit: true,
        key: 'products:page:1:limit:20',
        ttl: 600,
        generatedAt: '2025-01-01T00:00:00Z',
      };

      expect(cacheInfo.hit).toBe(true);
      expect(cacheInfo.ttl).toBe(600);
    });

    it('should support DeprecationWarning structure', () => {
      const deprecationWarning: DeprecationWarning = {
        feature: 'Legacy User API v1',
        message: 'This API version is deprecated and will be removed',
        sunsetDate: '2025-06-01',
        migrationGuide: 'https://docs.example.com/migration/v2',
      };

      expect(deprecationWarning.feature).toBe('Legacy User API v1');
      expect(deprecationWarning.sunsetDate).toBe('2025-06-01');
    });

    it('should support APIVersionInfo structure', () => {
      const versionInfo: APIVersionInfo = {
        version: '2.1.0',
        latest: '2.1.0',
        supported: ['2.0.0', '2.1.0'],
        releaseDate: '2024-12-01',
      };

      expect(versionInfo.version).toBe('2.1.0');
      expect(versionInfo.supported).toContain('2.1.0');
    });
  });

  describe('Utility Types', () => {
    it('should support ResourceId types', () => {
      const stringId: ResourceId = 'user-123';
      const numberId: ResourceId = 456;

      expect(typeof stringId).toBe('string');
      expect(typeof numberId).toBe('number');
    });

    it('should support TimestampFields structure', () => {
      const timestampData: TimestampFields = {
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T01:00:00Z',
        deletedAt: '2025-01-01T02:00:00Z',
      };

      expect(timestampData.createdAt).toBe('2025-01-01T00:00:00Z');
      expect(timestampData.updatedAt).toBe('2025-01-01T01:00:00Z');
    });

    it('should support AuditFields structure', () => {
      const auditData: AuditFields = {
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T01:00:00Z',
        deletedAt: '2025-01-01T02:00:00Z',
        createdBy: 'user-admin',
        updatedBy: 'user-admin',
        deletedBy: 'user-admin',
        version: 3,
      };

      expect(auditData.createdBy).toBe('user-admin');
      expect(auditData.version).toBe(3);
    });

    it('should support SoftDeleteFields structure', () => {
      const softDeleteData: SoftDeleteFields = {
        deleted: true,
        deletedAt: '2025-01-01T02:00:00Z',
        deletedBy: 'user-admin',
      };

      expect(softDeleteData.deleted).toBe(true);
      expect(softDeleteData.deletedBy).toBe('user-admin');
    });
  });

});
