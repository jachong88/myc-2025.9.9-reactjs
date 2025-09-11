/**
 * MYC API Type Definitions
 * 
 * Comprehensive type definitions for API requests and responses.
 * Provides consistent, standardized typing across the entire application.
 * 
 * Features:
 * - Standardized response envelopes
 * - CRUD operation types
 * - Advanced pagination and filtering
 * - Error handling with validation support
 * - Bulk operations and batch processing
 * - API metadata and versioning
 */

// ==========================================
// CORE API RESPONSE TYPES
// ==========================================

/**
 * Standard API Response Envelope
 * Wraps all successful API responses with consistent metadata
 */
export interface APIResponse<TData = any> {
  /** Response data payload */
  data: TData;
  /** Human-readable success message */
  message?: string;
  /** Request success status */
  success: true;
  /** Response timestamp in ISO format */
  timestamp: string;
  /** API version that handled the request */
  version?: string;
  /** Request tracking ID for debugging */
  requestId?: string;
  /** Response metadata */
  meta?: ResponseMetadata;
}

/**
 * Standard API Error Response
 * Wraps all error responses with consistent structure
 */
export interface APIErrorResponse {
  /** Error code for programmatic handling */
  code: string;
  /** Human-readable error message */
  message: string;
  /** Request failure status */
  success: false;
  /** Error timestamp in ISO format */
  timestamp: string;
  /** Additional error details */
  details?: Record<string, any>;
  /** Validation errors (for form submissions) */
  errors?: ValidationError[];
  /** Request tracking ID for debugging */
  requestId?: string;
  /** Suggested retry information */
  retryAfter?: number;
}

/**
 * Legacy API Error (for backward compatibility)
 * @deprecated Use APIErrorResponse instead
 */
export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  field?: string;
  timestamp?: string;
}

/**
 * Validation Error for Form Fields
 */
export interface ValidationError {
  /** Field name that failed validation */
  field: string;
  /** Validation error code */
  code: string;
  /** Human-readable error message */
  message: string;
  /** Field value that caused the error */
  value?: any;
  /** Additional validation context */
  context?: Record<string, any>;
}

/**
 * Response Metadata
 * Additional information about the API response
 */
export interface ResponseMetadata {
  /** Response processing time in milliseconds */
  processingTime?: number;
  /** Rate limiting information */
  rateLimit?: RateLimitInfo;
  /** Cache information */
  cache?: CacheInfo;
  /** Deprecation warnings */
  deprecation?: DeprecationWarning;
}

// ==========================================
// PAGINATION TYPES
// ==========================================

/**
 * Enhanced Paginated Response
 * Supports advanced pagination with metadata
 */
export interface PaginatedResponse<TData = any> extends APIResponse<TData[]> {
  /** Pagination metadata */
  pagination: PaginationMetadata;
  /** Sorting information */
  sorting?: SortingInfo;
  /** Applied filters */
  filters?: FilterInfo[];
  /** Search query information */
  search?: SearchInfo;
}

/**
 * Comprehensive Pagination Metadata
 */
export interface PaginationMetadata {
  /** Current page number (1-based) */
  page: number;
  /** Items per page */
  limit: number;
  /** Total number of items */
  total: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there is a next page */
  hasNext: boolean;
  /** Whether there is a previous page */
  hasPrevious: boolean;
  /** Start index of current page (0-based) */
  startIndex: number;
  /** End index of current page (0-based) */
  endIndex: number;
}

/**
 * Pagination Request Parameters
 */
export interface PaginationParams {
  /** Page number (1-based, default: 1) */
  page?: number;
  /** Items per page (default: 20, max: 100) */
  limit?: number;
  /** Field to sort by */
  sort?: string;
  /** Sort order */
  order?: SortOrder;
}

/**
 * Sort Order Options
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Sorting Information
 */
export interface SortingInfo {
  /** Field being sorted */
  field: string;
  /** Sort direction */
  order: SortOrder;
  /** Available sortable fields */
  availableFields?: string[];
}

/**
 * Filter Information
 */
export interface FilterInfo {
  /** Filter field name */
  field: string;
  /** Filter operator */
  operator: FilterOperator;
  /** Filter value */
  value: any;
  /** Human-readable filter label */
  label?: string;
}

/**
 * Filter Operators
 */
export type FilterOperator = 
  | 'eq'        // equals
  | 'ne'        // not equals
  | 'gt'        // greater than
  | 'gte'       // greater than or equal
  | 'lt'        // less than
  | 'lte'       // less than or equal
  | 'in'        // in array
  | 'nin'       // not in array
  | 'contains'  // string contains
  | 'startsWith' // string starts with
  | 'endsWith'  // string ends with
  | 'regex';    // regex match

/**
 * Search Information
 */
export interface SearchInfo {
  /** Search query string */
  query: string;
  /** Fields being searched */
  fields?: string[];
  /** Search result statistics */
  stats?: {
    /** Number of matches found */
    matches: number;
    /** Search processing time in ms */
    processingTime: number;
  };
}

// ==========================================
// CRUD OPERATION TYPES
// ==========================================

/**
 * Standard Create Response
 * Response for resource creation operations
 */
export interface CreateResponse<TData = any> extends APIResponse<TData> {
  /** HTTP status code (typically 201) */
  statusCode: 201;
  /** Resource location URL */
  location?: string;
}

/**
 * Standard Update Response
 * Response for resource update operations
 */
export interface UpdateResponse<TData = any> extends APIResponse<TData> {
  /** HTTP status code (typically 200) */
  statusCode: 200;
  /** Fields that were actually updated */
  updatedFields?: string[];
  /** Previous version for comparison */
  previousVersion?: Partial<TData>;
}

/**
 * Standard Delete Response
 * Response for resource deletion operations
 */
export interface DeleteResponse extends APIResponse<null> {
  /** HTTP status code (typically 204) */
  statusCode: 204;
  /** Confirmation of deletion */
  deleted: true;
  /** Information about soft vs hard delete */
  deletionType?: 'soft' | 'hard';
}

/**
 * Bulk Operation Response
 * Response for operations affecting multiple resources
 */
export interface BulkResponse<TData = any> extends APIResponse<TData[]> {
  /** Operation results summary */
  summary: BulkOperationSummary;
  /** Individual operation results */
  results?: BulkOperationResult<TData>[];
  /** Failed operations */
  failures?: BulkOperationFailure[];
}

/**
 * Bulk Operation Summary
 */
export interface BulkOperationSummary {
  /** Total number of items processed */
  total: number;
  /** Number of successful operations */
  successful: number;
  /** Number of failed operations */
  failed: number;
  /** Number of skipped operations */
  skipped: number;
  /** Processing time in milliseconds */
  processingTime: number;
}

/**
 * Individual Bulk Operation Result
 */
export interface BulkOperationResult<TData = any> {
  /** Operation index in the batch */
  index: number;
  /** Operation status */
  status: 'success' | 'failed' | 'skipped';
  /** Resulting data (if successful) */
  data?: TData;
  /** Error information (if failed) */
  error?: APIError;
  /** Resource identifier */
  id?: string | number;
}

/**
 * Bulk Operation Failure
 */
export interface BulkOperationFailure {
  /** Operation index in the batch */
  index: number;
  /** Resource identifier */
  id?: string | number;
  /** Error details */
  error: APIError;
  /** Input data that caused the failure */
  input?: any;
}

// ==========================================
// REQUEST PARAMETER TYPES
// ==========================================

/**
 * Base Query Parameters
 * Common query parameters for API requests
 */
export interface BaseQueryParams {
  /** Include soft-deleted records */
  includeDeleted?: boolean;
  /** Fields to include in response */
  fields?: string[];
  /** Fields to exclude from response */
  exclude?: string[];
  /** Include related resources */
  include?: string[];
  /** Expand nested resources */
  expand?: string[];
}

/**
 * List Query Parameters
 * Parameters for list/search endpoints
 */
export interface ListQueryParams extends BaseQueryParams, PaginationParams {
  /** Search query string */
  search?: string;
  /** Search fields to query */
  searchFields?: string[];
  /** Filters to apply */
  filters?: FilterParam[];
  /** Date range filter */
  dateRange?: DateRangeFilter;
}

/**
 * Filter Parameter
 * Individual filter specification
 */
export interface FilterParam {
  /** Field to filter on */
  field: string;
  /** Filter operator */
  operator: FilterOperator;
  /** Filter value(s) */
  value: any;
}

/**
 * Date Range Filter
 */
export interface DateRangeFilter {
  /** Start date (ISO string) */
  start?: string;
  /** End date (ISO string) */
  end?: string;
  /** Date field to filter on */
  field?: string;
}

/**
 * Bulk Operation Request
 */
export interface BulkOperationRequest<TData = any> {
  /** Operation type */
  operation: BulkOperationType;
  /** Items to process */
  items: TData[];
  /** Options for the bulk operation */
  options?: BulkOperationOptions;
}

/**
 * Bulk Operation Types
 */
export type BulkOperationType = 'create' | 'update' | 'delete' | 'upsert';

/**
 * Bulk Operation Options
 */
export interface BulkOperationOptions {
  /** Continue processing on individual failures */
  continueOnError?: boolean;
  /** Validate all items before processing */
  validateFirst?: boolean;
  /** Batch size for processing */
  batchSize?: number;
  /** Return detailed results for each item */
  includeResults?: boolean;
}

// ==========================================
// API METADATA TYPES
// ==========================================

/**
 * Rate Limiting Information
 */
export interface RateLimitInfo {
  /** Maximum requests allowed */
  limit: number;
  /** Remaining requests in current window */
  remaining: number;
  /** Time until rate limit resets (Unix timestamp) */
  resetTime: number;
  /** Rate limit window duration in seconds */
  windowSize: number;
}

/**
 * Cache Information
 */
export interface CacheInfo {
  /** Whether response was served from cache */
  hit: boolean;
  /** Cache key used */
  key?: string;
  /** Cache TTL in seconds */
  ttl?: number;
  /** Cache generation time */
  generatedAt?: string;
}

/**
 * Deprecation Warning
 */
export interface DeprecationWarning {
  /** Deprecated feature */
  feature: string;
  /** Deprecation message */
  message: string;
  /** Sunset date (when feature will be removed) */
  sunsetDate?: string;
  /** Migration guide URL */
  migrationGuide?: string;
}

/**
 * API Version Information
 */
export interface APIVersionInfo {
  /** Current API version */
  version: string;
  /** Latest available version */
  latest?: string;
  /** Supported versions */
  supported?: string[];
  /** Version release date */
  releaseDate?: string;
  /** Version deprecation date */
  deprecationDate?: string;
}

// ==========================================
// UTILITY TYPES
// ==========================================

/**
 * Resource Identifier
 * Flexible ID type for different resource types
 */
export type ResourceId = string | number;

/**
 * Timestamp Fields
 * Common timestamp fields for resources
 */
export interface TimestampFields {
  /** Creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
  /** Soft deletion timestamp */
  deletedAt?: string;
}

/**
 * Audit Fields
 * Common audit fields for resources
 */
export interface AuditFields extends TimestampFields {
  /** User who created the resource */
  createdBy?: string;
  /** User who last updated the resource */
  updatedBy?: string;
  /** User who deleted the resource */
  deletedBy?: string;
  /** Resource version for optimistic locking */
  version?: number;
}

/**
 * Soft Delete Fields
 */
export interface SoftDeleteFields {
  /** Whether resource is deleted */
  deleted: boolean;
  /** Deletion timestamp */
  deletedAt?: string;
  /** User who deleted the resource */
  deletedBy?: string;
}

// ==========================================
// LEGACY COMPATIBILITY
// ==========================================

/**
 * Environment Configuration Interface
 */
export interface EnvConfig {
  apiBaseUrl: string;
  apiTimeout: number;
  environment: string;
  useMockApi: boolean;
  debugApi: boolean;
  debugAuth: boolean;
}

/**
 * HTTP Request Configuration
 * Extended Axios request configuration
 */
export interface RequestConfig {
  skipAuth?: boolean;
  skipErrorHandling?: boolean;
  timeout?: number;
  retries?: number;
}

/**
 * Extended Axios Request Config with MYC-specific options
 * Extends the base Axios config with our custom authentication and error handling options
 */
declare module 'axios' {
  interface AxiosRequestConfig {
    skipAuth?: boolean;
    skipErrorHandling?: boolean;
    retries?: number;
    requestStartTime?: number;
  }
}

/**
 * API Client Status
 * Tracks the health and status of the API client
 */
export interface APIClientStatus {
  isOnline: boolean;
  lastRequestTime?: number;
  baseUrl: string;
  environment: string;
}
