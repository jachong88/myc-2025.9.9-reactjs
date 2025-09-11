/**
 * User Types for MYC Studio Management System
 * Based on exact API documentation and backend DTOs
 */

// ============================================================================
// API Response Types - Matching Exact Backend Format
// ============================================================================

/**
 * User list item from API response (GET /users)
 * Matches UserListItemResponse from backend
 */
export interface UserListItem {
  id: string;        // ULID format
  name: string;
  email: string;
  phone: string | null;
  role: string;      // resolved role name
  country: string;   // resolved country name  
  province: string;  // resolved province name
  note: string | null;
}

/**
 * User entity from API response (for individual user operations)
 * Matches User entity structure from backend
 */
export interface User {
  id: string;         // ULID
  countryId: string;  // ULID
  provinceId: string; // ULID
  roleId: string;     // ULID
  name: string;
  email: string;
  phone: string | null;
  note: string | null;
}

/**
 * Pagination metadata from API responses
 * Matches the exact structure from docs/common/api/user/user-list.md
 */
export interface PaginationMeta {
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
}

// ============================================================================
// API Request Types - Matching Exact Backend Format
// ============================================================================

/**
 * Create user request payload (POST /users)
 * Matches the exact structure from docs/common/api/user/user-add.md
 */
export interface CreateUserRequest {
  name: string;
  email: string;
  phone?: string;
  roleId: string;    // ULID
  countryId: string; // ULID
  provinceId: string; // ULID
  note?: string;
}

/**
 * Update user request payload (PUT /users/{id})
 * Matches the exact structure from docs/common/api/user/user-update.md
 */
export interface UpdateUserRequest {
  name: string;
  email: string;
  phone?: string;
  roleId: string;    // ULID
  countryId: string; // ULID
  provinceId: string; // ULID
  note?: string;
}

/**
 * User list API parameters (GET /users)
 * Matches the exact parameters from docs/common/api/user/user-list.md
 */
export interface UserListParams {
  page?: number;        // Page number (default 0)
  size?: number;        // Page size (default 10)
  countryId?: string;   // Country ULID filter
  provinceId?: string;  // Province ULID filter
  name?: string;        // Name filter
  phone?: string;       // Phone filter
  email?: string;       // Email filter
  role?: string;        // Role filter
  deleted: boolean;     // Required: show deleted users
}

// ============================================================================
// API Response Wrappers - Matching Exact Backend Format
// ============================================================================

/**
 * Standard API response wrapper matching API specification
 * All API responses follow this structure
 */
export interface ApiResponse<T> {
  success: boolean;
  requestId: string;
  data: T | null;
  meta: object | null;
  error: {
    status: number;
    code: string;
    message: string;
    details?: object;
  } | null;
}

/**
 * User list API response (GET /users)
 * Data is a direct array of users, meta contains pagination info
 */
export interface UserListResponse {
  success: true;
  requestId: string;
  data: UserListItem[];
  meta: PaginationMeta;
  error: null;
}

/**
 * User create API response (POST /users)
 * Backend returns data: null for create operations per API spec
 */
export interface CreateUserResponse {
  success: true;
  requestId: string;
  data: null;
  meta: null;
  error: null;
}

/**
 * User get/update API response (GET /users/{id}, PUT /users/{id})
 */
export interface UserResponse {
  success: true;
  requestId: string;
  data: User;
  meta: null;
  error: null;
}

/**
 * User delete API response (DELETE /users/{id})
 */
export interface DeleteUserResponse {
  success: true;
  requestId: string;
  data: null;
  meta: null;
  error: null;
}

/**
 * Error response format matching API specification
 */
export interface UserErrorResponse {
  success: false;
  requestId: string;
  data: null;
  meta: null;
  error: {
    status: number;
    code: string;
    message: string;
    details?: object;
  };
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Fields that can be used for user sorting
 */
export type UserSortField = 'name' | 'email' | 'role' | 'country' | 'province';

/**
 * Sort order options
 */
export type SortOrder = 'asc' | 'desc';

/**
 * User form data for creating/editing users
 */
export interface UserFormData {
  name: string;
  email: string;
  phone?: string;
  roleId: string;
  countryId: string;
  provinceId: string;
  note?: string;
}

/**
 * User filter form data
 */
export interface UserFilterData {
  page?: number;
  size?: number;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  countryId?: string;
  provinceId?: string;
  deleted: boolean;
}

// ============================================================================
// Form State Types
// ============================================================================

/**
 * User table state for managing list display
 */
export interface UserTableState {
  selectedUsers: string[]; // Array of user IDs
  sortField: UserSortField;
  sortOrder: SortOrder;
  filters: UserFilterData;
}

/**
 * User list loading states
 */
export type UserListLoadingState = 'idle' | 'loading' | 'error' | 'success';

/**
 * User operation loading states
 */
export interface UserOperationState {
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  loading: boolean;
  error: string | null;
}
