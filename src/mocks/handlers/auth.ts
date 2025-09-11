/**
 * Authentication MSW Handlers
 * 
 * Mock API handlers for authentication endpoints following the documented API specifications
 */

import { http, HttpResponse } from 'msw';
import type { LoginCredentials, AuthResponse, User } from '../../shared/types/domain';
import { validateCredentials, findUserByEmail } from '../fixtures/users';
import { generateMockJWT, generateMockRefreshToken, decodeMockJWT, isMockJWTExpired } from '../utils/jwt';

// Store active refresh tokens in memory (for testing)
const activeRefreshTokens = new Set<string>();

/**
 * POST /auth/login - User login
 */
export const loginHandler = http.post('http://localhost:8080/api/auth/login', async ({ request }) => {
  try {
    const credentials = await request.json() as LoginCredentials;
    
    // Validate required fields
    if (!credentials.email || !credentials.password) {
      return HttpResponse.json(
        {
          success: false,
          data: null,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Email and password are required',
            details: {
              email: !credentials.email ? ['Email is required'] : [],
              password: !credentials.password ? ['Password is required'] : []
            }
          }
        },
        { status: 422 }
      );
    }

    // Validate credentials
    const user = validateCredentials(credentials.email, credentials.password);
    
    if (!user) {
      return HttpResponse.json(
        {
          success: false,
          data: null,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password'
          }
        },
        { status: 401 }
      );
    }

    // Generate tokens
    const accessToken = generateMockJWT(user, 3600); // 1 hour
    const refreshToken = generateMockRefreshToken();
    
    // Store refresh token
    activeRefreshTokens.add(refreshToken);

    const authResponse: AuthResponse = {
      user,
      accessToken,
      refreshToken,
      expiresIn: 3600
    };

    return HttpResponse.json(
      {
        success: true,
        data: authResponse,
        error: null
      },
      { 
        status: 200,
        headers: {
          'Set-Cookie': `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800` // 7 days
        }
      }
    );

  } catch (error) {
    return HttpResponse.json(
      {
        success: false,
        data: null,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred during login'
        }
      },
      { status: 500 }
    );
  }
});

/**
 * POST /auth/logout - User logout
 */
export const logoutHandler = http.post('http://localhost:8080/api/auth/logout', async ({ request }) => {
  try {
    // Get refresh token from cookie or request body
    const cookies = request.headers.get('cookie') || '';
    const refreshTokenMatch = cookies.match(/refreshToken=([^;]+)/);
    const refreshToken = refreshTokenMatch ? refreshTokenMatch[1] : null;

    // Remove refresh token from active tokens
    if (refreshToken) {
      activeRefreshTokens.delete(refreshToken);
    }

    return HttpResponse.json(
      {
        success: true,
        data: { message: 'Logged out successfully' },
        error: null
      },
      { 
        status: 200,
        headers: {
          'Set-Cookie': 'refreshToken=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0' // Clear cookie
        }
      }
    );

  } catch (error) {
    return HttpResponse.json(
      {
        success: false,
        data: null,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred during logout'
        }
      },
      { status: 500 }
    );
  }
});

/**
 * POST /auth/refresh - Refresh access token
 */
export const refreshHandler = http.post('http://localhost:8080/api/auth/refresh', async ({ request }) => {
  try {
    // Get refresh token from cookie or request body
    const cookies = request.headers.get('cookie') || '';
    const refreshTokenMatch = cookies.match(/refreshToken=([^;]+)/);
    let refreshToken = refreshTokenMatch ? refreshTokenMatch[1] : null;

    // If not in cookie, try request body
    if (!refreshToken) {
      try {
        const body = await request.json() as { refreshToken?: string };
        refreshToken = body.refreshToken || null;
      } catch {
        // Ignore JSON parse errors
      }
    }

    if (!refreshToken || !activeRefreshTokens.has(refreshToken)) {
      return HttpResponse.json(
        {
          success: false,
          data: null,
          error: {
            code: 'INVALID_REFRESH_TOKEN',
            message: 'Invalid or expired refresh token'
          }
        },
        { status: 401 }
      );
    }

    // For this mock, we'll generate a new access token for the admin user
    // In a real app, you'd decode the refresh token to get user info
    const user = findUserByEmail('admin@example.com'); // Default for mock
    
    if (!user) {
      return HttpResponse.json(
        {
          success: false,
          data: null,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User associated with token not found'
          }
        },
        { status: 401 }
      );
    }

    // Generate new access token
    const newAccessToken = generateMockJWT(user, 3600);

    return HttpResponse.json(
      {
        success: true,
        data: {
          accessToken: newAccessToken,
          expiresIn: 3600
        },
        error: null
      },
      { status: 200 }
    );

  } catch (error) {
    return HttpResponse.json(
      {
        success: false,
        data: null,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred during token refresh'
        }
      },
      { status: 500 }
    );
  }
});

/**
 * GET /auth/me - Get current user profile
 */
export const profileHandler = http.get('http://localhost:8080/api/auth/me', async ({ request }) => {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return HttpResponse.json(
        {
          success: false,
          data: null,
          error: {
            code: 'MISSING_TOKEN',
            message: 'Authorization token is required'
          }
        },
        { status: 401 }
      );
    }

    // Validate token
    if (isMockJWTExpired(token)) {
      return HttpResponse.json(
        {
          success: false,
          data: null,
          error: {
            code: 'TOKEN_EXPIRED',
            message: 'Access token has expired'
          }
        },
        { status: 401 }
      );
    }

    // Decode token to get user info
    const payload = decodeMockJWT(token);
    if (!payload || !payload.email) {
      return HttpResponse.json(
        {
          success: false,
          data: null,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Invalid access token'
          }
        },
        { status: 401 }
      );
    }

    // Find user by email from token
    const user = findUserByEmail(payload.email);
    if (!user) {
      return HttpResponse.json(
        {
          success: false,
          data: null,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found'
          }
        },
        { status: 404 }
      );
    }

    return HttpResponse.json(
      {
        success: true,
        data: user,
        error: null
      },
      { status: 200 }
    );

  } catch (error) {
    return HttpResponse.json(
      {
        success: false,
        data: null,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred while fetching profile'
        }
      },
      { status: 500 }
    );
  }
});

/**
 * OPTIONS handlers for CORS preflight requests
 */
const optionsHandler = http.options('http://localhost:8080/api/auth/*', () => {
  return new HttpResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Request-ID'
    }
  });
});

// Export all auth handlers
export const authHandlers = [
  loginHandler,
  logoutHandler,
  refreshHandler,
  profileHandler,
  optionsHandler
];
