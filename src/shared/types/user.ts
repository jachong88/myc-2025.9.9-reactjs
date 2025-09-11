/**
 * User Types for MYC Studio Management System
 * Based on exact API documentation from docs/common/api/user/
 */

// ============================================================================
// API Response Types - Matching Exact Backend Format
// ============================================================================

/**
 * User list item from API response (GET /users)
 * Matches the exact structure from docs/common/api/user/user-list.md
 */
export interface UserListItem {
  id: string; // ULID format
  name: string;
  email: string;
  phone?: string;
  role: string;      // resolved role name
  country: string;   // resolved country name
  province: string;  // resolved province name
}

/**
 * User entity from API response (GET /users/{id})
 * Matches the exact structure from docs/common/api/user/user-get.md
 */
export interface User {
  name: string;
  email: string;
  phone?: string;
  role_id: string;    // ULID
  country_id: string; // ULID
  province_id: string; // ULID
  note?: string;
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
 * Standard API response wrapper
 * All API responses follow this structure
 */
export interface ApiResponse<T> {
  success: boolean;
  requestId: string;
  meta: PaginationMeta | null;
  data: T | null;
  error: null;
}

/**
 * User list API response (GET /users)
 */
export interface UserListResponse extends ApiResponse<UserListItem[]> {
  meta: PaginationMeta;
  data: UserListItem[];
}

/**
 * User CRUD API response (GET /users/{id}, POST /users, PUT /users/{id})
 */
export interface UserResponse extends ApiResponse<User> {
  meta: null;
  data: User | null;
}

/**
 * User delete API response (DELETE /users/{id})
 */
export interface DeleteUserResponse extends ApiResponse<null> {
  meta: null;
  data: null;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Fields that can be used for user sorting
 */
export type UserSortField = 'name' | 'email' | 'created_at' | 'updated_at';

/**
 * Sort order options
 */
export type SortOrder = 'asc' | 'desc';

/**
 * User creation form data (before submission)
 */
export type UserFormData = Omit<CreateUserRequest, 'status'> & {
  status: UserStatus;
};

/**
 * User update form data (all fields optional)
 */
export type UserUpdateFormData = Partial<UserFormData>;

/**
 * User table row data for displaying in lists
 */
export interface UserTableRow extends UserSummary {
  phone: string | null;
  country_name: string | null;
  province_name: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Validation Types
// ============================================================================

/**
 * User field validation constraints
 */
export interface UserValidationRules {
  name: {
    required: true;
    minLength: number;
    maxLength: number;
  };
  email: {
    required: true;
    format: 'email';
    maxLength: number;
  };
  phone: {
    required: false;
    format?: 'phone';
    maxLength: number;
  };
  role: {
    required: true;
    enum: UserRole[];
  };
  status: {
    required: true;
    enum: UserStatus[];
  };
}

/**
 * User validation error structure
 */
export interface UserValidationError {
  field: keyof CreateUserRequest | keyof UpdateUserRequest;
  message: string;
  code: string;
}

// ============================================================================
// Business Logic Types
// ============================================================================

/**
 * User permissions based on role
 */
export interface UserPermissions {
  canViewUsers: boolean;
  canCreateUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  canManageRoles: boolean;
  canViewReports: boolean;
}

/**
 * User activity status
 */
export interface UserActivity {
  isOnline: boolean;
  lastSeen: string | null; // ISO timestamp
  currentSession: string | null; // Session ID
}

/**
 * Complete user profile including activity and permissions
 */
export interface UserProfile extends UserWithLocation {
  permissions: UserPermissions;
  activity: UserActivity;
}
