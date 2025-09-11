import { http, HttpResponse } from 'msw';
import type { 
  UserListParams, 
  UserListResponse, 
  UserResponse, 
  CreateUserRequest,
  UpdateUserRequest,
  UserListItem,
  User,
  PaginationMeta 
} from '../../shared/types/user';
import type { APIResponse } from '../../shared/types/api';

// Mock user data for testing
const mockUsers: UserListItem[] = [
  {
    id: '01234567890123456789012345',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-0101',
    role: 'USER',
    country: 'United States',
    province: 'California',
    note: null,
  },
  {
    id: '01234567890123456789012346',
    name: 'Jane Smith',
    email: 'jane.admin@example.com',
    phone: '+1-555-0102',
    role: 'ADMIN',
    country: 'United States',
    province: 'New York',
    note: null,
  },
  {
    id: '01234567890123456789012347',
    name: 'Bob Johnson',
    email: 'bob.moderator@example.com',
    phone: '+1-555-0103',
    role: 'MODERATOR',
    country: 'Canada',
    province: 'Ontario',
    note: null,
  },
  {
    id: '01234567890123456789012348',
    name: 'Alice Williams',
    email: 'alice.user@example.com',
    phone: '+1-555-0104',
    role: 'USER',
    country: 'United Kingdom',
    province: 'England',
    note: null,
  },
  {
    id: '01234567890123456789012349',
    name: 'Charlie Brown',
    email: 'charlie.dev@example.com',
    phone: '+1-555-0105',
    role: 'USER',
    country: 'Australia',
    province: 'New South Wales',
    note: null,
  },
];

// Helper function to filter users based on search parameters
function filterUsers(users: UserListItem[], params: UserListParams): UserListItem[] {
  return users.filter(user => {
    // Email filter
    if (params.email && !user.email.toLowerCase().includes(params.email.toLowerCase())) {
      return false;
    }
    
    // Name filter (matches the 'name' field in UserListItem)
    if (params.name && !user.name.toLowerCase().includes(params.name.toLowerCase())) {
      return false;
    }
    
    // Phone filter
    if (params.phone && user.phone && !user.phone.toLowerCase().includes(params.phone.toLowerCase())) {
      return false;
    }
    
    // Role filter
    if (params.role && user.role !== params.role) {
      return false;
    }
    
    // Note: Country and Province filters would need ULID resolution in real implementation
    // For now, we'll skip these filters in the mock
    
    return true;
  });
}

// Helper function to paginate results
function paginateResults(users: UserListItem[], page: number, size: number) {
  const totalItems = users.length;
  const totalPages = Math.ceil(totalItems / size);
  const startIndex = page * size;
  const endIndex = startIndex + size;
  const paginatedUsers = users.slice(startIndex, endIndex);
  
  const meta: PaginationMeta = {
    page,
    size,
    totalItems,
    totalPages,
    hasNext: page < totalPages - 1,
  };
  
  return { users: paginatedUsers, meta };
}

// MSW handlers for user endpoints
export const userHandlers = [
  // GET /api/users - List users with filtering and pagination
  http.get('*/api/users', ({ request }) => {
    const url = new URL(request.url);
    const searchParams: UserListParams = {
      page: Number(url.searchParams.get('page')) || 0,
      size: Number(url.searchParams.get('size')) || 10,
      email: url.searchParams.get('email') || undefined,
      name: url.searchParams.get('name') || undefined,
      phone: url.searchParams.get('phone') || undefined,
      role: url.searchParams.get('role') || undefined,
      countryId: url.searchParams.get('countryId') || undefined,
      provinceId: url.searchParams.get('provinceId') || undefined,
      deleted: url.searchParams.get('deleted') === 'true' || false,
    };

    // Simulate network delay
    const delay = Number(url.searchParams.get('_delay')) || 100;

    // Simulate error scenario
    const simulateError = url.searchParams.get('_error');
    if (simulateError === 'server') {
      return new HttpResponse(null, { 
        status: 500,
        statusText: 'Internal Server Error'
      });
    }
    
    if (simulateError === 'unauthorized') {
      return HttpResponse.json(
        { 
          success: false,
          requestId: `req_${Date.now()}_${Math.random().toString(36).substring(2)}`,
          data: null,
          meta: null,
          error: {
            status: 401,
            code: 'UNAUTHORIZED',
            message: 'Unauthorized access'
          }
        }, 
        { status: 401 }
      );
    }

    // Filter and paginate users
    const filteredUsers = filterUsers(mockUsers, searchParams);
    const paginatedResult = paginateResults(filteredUsers, searchParams.page || 0, searchParams.size || 10);

    const response: UserListResponse = {
      success: true,
      requestId: `req_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      data: paginatedResult.users,
      meta: paginatedResult.meta,
      error: null,
    };

    return HttpResponse.json(response, { 
      headers: { 'Content-Type': 'application/json' }
    });
  }),

  // GET /api/users/:id - Get single user
  http.get('*/api/users/:id', ({ params, request }) => {
    const userId = Number(params.id);
    const url = new URL(request.url);
    
    // Simulate error scenario
    const simulateError = url.searchParams.get('_error');
    if (simulateError === 'not_found') {
      return HttpResponse.json(
        { 
          success: false, 
          message: 'User not found',
          errorCode: 'USER_NOT_FOUND'
        } as APIResponse<null>, 
        { status: 404 }
      );
    }

    const user = mockUsers.find(u => u.id === userId);
    
    if (!user) {
      return HttpResponse.json(
        { 
          success: false, 
          message: 'User not found',
          errorCode: 'USER_NOT_FOUND'
        } as APIResponse<null>, 
        { status: 404 }
      );
    }

    // Convert to full User object (same as UserListItem for now)
    const fullUser: User = { ...user };

    const response: UserResponse = {
      success: true,
      message: 'User retrieved successfully',
      data: fullUser,
    };

    return HttpResponse.json(response);
  }),

  // POST /api/users - Create new user
  http.post('*/api/users', async ({ request }) => {
    const url = new URL(request.url);
    
    // Simulate error scenario
    const simulateError = url.searchParams.get('_error');
    if (simulateError === 'validation') {
      return HttpResponse.json(
        { 
          success: false, 
          message: 'Validation failed',
          errorCode: 'VALIDATION_ERROR'
        } as APIResponse<null>, 
        { status: 422 }
      );
    }

    try {
      const createUserData = await request.json() as CreateUserRequest;
      
      // Simulate email already exists error
      const emailExists = mockUsers.some(u => u.email === createUserData.email);
      if (emailExists) {
        return HttpResponse.json(
          { 
            success: false, 
            message: 'Email already exists',
            errorCode: 'EMAIL_ALREADY_EXISTS'
          } as APIResponse<null>, 
          { status: 409 }
        );
      }

      // Create new user
      const newUser: UserListItem = {
        id: Math.max(...mockUsers.map(u => u.id)) + 1,
        email: createUserData.email,
        firstName: createUserData.firstName,
        lastName: createUserData.lastName,
        phone: createUserData.phone || null,
        role: createUserData.role,
        country: createUserData.country || null,
        province: createUserData.province || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add to mock data (in real scenario, this would be persisted)
      mockUsers.push(newUser);

      const response: UserResponse = {
        success: true,
        message: 'User created successfully',
        data: newUser,
      };

      return HttpResponse.json(response, { status: 201 });
    } catch (error) {
      return HttpResponse.json(
        { 
          success: false, 
          message: 'Invalid request body',
          errorCode: 'INVALID_REQUEST'
        } as APIResponse<null>, 
        { status: 400 }
      );
    }
  }),

  // PUT /api/users/:id - Update user
  http.put('*/api/users/:id', async ({ params, request }) => {
    const userId = Number(params.id);
    const url = new URL(request.url);
    
    // Simulate error scenario
    const simulateError = url.searchParams.get('_error');
    if (simulateError === 'not_found') {
      return HttpResponse.json(
        { 
          success: false, 
          message: 'User not found',
          errorCode: 'USER_NOT_FOUND'
        } as APIResponse<null>, 
        { status: 404 }
      );
    }

    try {
      const updateUserData = await request.json() as UpdateUserRequest;
      
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        return HttpResponse.json(
          { 
            success: false, 
            message: 'User not found',
            errorCode: 'USER_NOT_FOUND'
          } as APIResponse<null>, 
          { status: 404 }
        );
      }

      // Update user
      const updatedUser: UserListItem = {
        ...mockUsers[userIndex],
        ...updateUserData,
        updatedAt: new Date().toISOString(),
      };

      mockUsers[userIndex] = updatedUser;

      const response: UserResponse = {
        success: true,
        message: 'User updated successfully',
        data: updatedUser,
      };

      return HttpResponse.json(response);
    } catch (error) {
      return HttpResponse.json(
        { 
          success: false, 
          message: 'Invalid request body',
          errorCode: 'INVALID_REQUEST'
        } as APIResponse<null>, 
        { status: 400 }
      );
    }
  }),

  // DELETE /api/users/:id - Delete user
  http.delete('*/api/users/:id', ({ params, request }) => {
    const userId = Number(params.id);
    const url = new URL(request.url);
    
    // Simulate error scenario
    const simulateError = url.searchParams.get('_error');
    if (simulateError === 'not_found') {
      return HttpResponse.json(
        { 
          success: false, 
          message: 'User not found',
          errorCode: 'USER_NOT_FOUND'
        } as APIResponse<null>, 
        { status: 404 }
      );
    }

    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return HttpResponse.json(
        { 
          success: false, 
          message: 'User not found',
          errorCode: 'USER_NOT_FOUND'
        } as APIResponse<null>, 
        { status: 404 }
      );
    }

    // Remove user from mock data
    mockUsers.splice(userIndex, 1);

    const response: APIResponse<null> = {
      success: true,
      message: 'User deleted successfully',
      data: null,
    };

    return HttpResponse.json(response);
  }),

  // OPTIONS /api/users/* - Handle preflight requests
  http.options('*/api/users/*', () => {
    return new HttpResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }),
];

export default userHandlers;
