/**
 * MYC Domain Type Definitions
 * 
 * Core domain entities and business logic types
 * Used throughout the application for consistent data structures
 */

/**
 * User Entity
 * Represents a user in the MYC Studio Management System
 */
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: Country;
  province?: Province;
  role: UserRole;
  status: UserStatus;
  deleted: boolean;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * User Role Type
 */
export type UserRole = 'admin' | 'teacher' | 'student';

/**
 * User Role Constants
 */
export const UserRoles = {
  ADMIN: 'admin' as const,
  TEACHER: 'teacher' as const,
  STUDENT: 'student' as const,
} as const;

/**
 * User Status Type
 */
export type UserStatus = 'active' | 'inactive' | 'pending';

/**
 * User Status Constants
 */
export const UserStatuses = {
  ACTIVE: 'active' as const,
  INACTIVE: 'inactive' as const,
  PENDING: 'pending' as const,
} as const;

/**
 * Country Entity
 */
export interface Country {
  id: string;
  name: string;
  code: string; // ISO country code (e.g., 'CA', 'US')
}

/**
 * Province/State Entity
 */
export interface Province {
  id: string;
  name: string;
  code: string; // Province/state code (e.g., 'ON', 'CA')
  countryId: string;
}

/**
 * Login Credentials Interface
 * Updated for Firebase Google Authentication
 */
export interface LoginCredentials {
  // For Firebase Google Auth - no credentials needed, just trigger login
  rememberMe?: boolean;
}

/**
 * User Creation Request
 */
export interface CreateUserRequest {
  name: string;
  email: string;
  phone?: string;
  countryId?: string;
  provinceId?: string;
  roleId: string;
  note?: string;
}

/**
 * User Update Request
 */
export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  status?: UserStatus;
  deleted?: boolean;
}

/**
 * Authentication Response from Server
 */
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string; // May not be returned if using httpOnly cookies
  expiresIn: number; // Access token expiration in seconds
}

/**
 * User Profile Update Request
 */
export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
  countryId?: string;
  provinceId?: string;
}

/**
 * Password Change Request
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
