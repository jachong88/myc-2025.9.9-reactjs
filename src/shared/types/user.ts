/**
 * User domain types for the MYC Studio Management System
 * Based on API documentation from docs/common/api/user/
 */

// ============================================================================
// Core Domain Types
// ============================================================================

/**
 * User role enumeration - defines access levels and permissions
 */
export type UserRole = 'admin' | 'manager' | 'instructor' | 'student';

/**
 * User status enumeration - defines account activation state
 */
export type UserStatus = 'active' | 'inactive' | 'pending';

// ============================================================================
// Location Domain Types
// ============================================================================

/**
 * Country reference type
 */
export interface Country {
  id: number;
  name: string;
  code: string; // ISO country code (e.g., 'CA', 'US')
}

/**
 * Province/State reference type
 */
export interface Province {
  id: number;
  name: string;
  code: string; // Province/state code (e.g., 'ON', 'BC', 'CA')
  country_id: number;
}

// ============================================================================
// Core User Domain Types
// ============================================================================

/**
 * Core User interface representing a complete user entity
 */
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  country_id: number | null;
  province_id: number | null;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

/**
 * User entity with populated location references
 */
export interface UserWithLocation extends User {
  country: Country | null;
  province: Province | null;
}

/**
 * Minimal user information for lists and references
 */
export interface UserSummary {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

// ============================================================================
// API Request Types
// ============================================================================

/**
 * Parameters for creating a new user
 */
export interface CreateUserRequest {
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  status?: UserStatus; // Defaults to 'pending' if not specified
  country_id?: number | null;
  province_id?: number | null;
}

/**
 * Parameters for updating an existing user
 */
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string | null;
  role?: UserRole;
  status?: UserStatus;
  country_id?: number | null;
  province_id?: number | null;
}

/**
 * Parameters for user list/search queries
 */
export interface UserListParams {
  page?: number;
  per_page?: number;
  sort?: 'name' | 'email' | 'created_at' | 'updated_at';
  order?: 'asc' | 'desc';
  role?: UserRole | UserRole[];
  status?: UserStatus | UserStatus[];
  search?: string; // Search in name and email
  country_id?: number;
  province_id?: number;
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Standard paginated response structure
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

/**
 * Response for user list endpoint
 */
export interface UserListResponse extends PaginatedResponse<UserWithLocation> {}

/**
 * Response for single user endpoints (get, create, update)
 */
export interface UserResponse {
  data: UserWithLocation;
}

/**
 * Response for user deletion
 */
export interface UserDeleteResponse {
  success: boolean;
  message: string;
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
