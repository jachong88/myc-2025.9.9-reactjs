/**
 * User API Client
 * 
 * HTTP client functions for user management operations
 * Based on API documentation from docs/common/api/user/
 */

import { httpClient } from './http';
import type {
  UserListParams,
  UserListResponse,
  CreateUserRequest,
  UpdateUserRequest,
  CreateUserResponse,
  UserResponse,
  DeleteUserResponse,
} from '../types/user';

// Base path for user API endpoints
const BASE_PATH = '/users';

/**
 * User API operations
 * All operations use Firebase authentication automatically via httpClient
 */
export const userAPI = {
  /**
   * List users with filtering and pagination
   * GET /users
   * 
   * @param params Filter and pagination parameters
   * @returns Promise<UserListResponse> Paginated list of users
   */
  listUsers: async (params: UserListParams): Promise<UserListResponse> => {
    const response = await httpClient.get(BASE_PATH, { params });
    return response.data as UserListResponse;
  },

  /**
   * Create a new user
   * POST /users
   * 
   * @param data User creation data
   * @returns Promise<CreateUserResponse> Create confirmation (data: null)
   */
  createUser: async (data: CreateUserRequest): Promise<CreateUserResponse> => {
    const response = await httpClient.post(BASE_PATH, data);
    return response.data as CreateUserResponse;
  },

  /**
   * Get user by ID
   * GET /users/{id}
   * 
   * @param id User ULID
   * @returns Promise<UserResponse> User data
   */
  getUserById: async (id: string): Promise<UserResponse> => {
    const response = await httpClient.get(`${BASE_PATH}/${id}`);
    return response.data as UserResponse;
  },

  /**
   * Update existing user
   * PUT /users/{id}
   * 
   * @param id User ULID
   * @param data User update data
   * @returns Promise<UserResponse> Updated user data
   */
  updateUser: async (id: string, data: UpdateUserRequest): Promise<UserResponse> => {
    const response = await httpClient.put(`${BASE_PATH}/${id}`, data);
    return response.data as UserResponse;
  },

  /**
   * Delete user (soft delete)
   * DELETE /users/{id}
   * 
   * @param id User ULID
   * @returns Promise<DeleteUserResponse> Deletion confirmation
   */
  deleteUser: async (id: string): Promise<DeleteUserResponse> => {
    const response = await httpClient.delete(`${BASE_PATH}/${id}`);
    return response.data as DeleteUserResponse;
  },
};

/**
 * Export individual functions for convenience
 */
export const {
  listUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = userAPI;

/**
 * Export alias for backward compatibility
 */
export const userApi = userAPI;
