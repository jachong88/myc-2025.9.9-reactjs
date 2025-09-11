/**
 * Firebase Authentication MSW Handlers
 * 
 * Mock API handlers for Firebase authentication integration
 * Authentication is handled by Firebase, these handlers support profile management
 */

import { http, HttpResponse } from 'msw';
import type { User } from '../../shared/types/domain';
import { findUserByEmail, findUserByFirebaseUid, createFirebaseUser } from '../fixtures/users';

/**
 * POST /auth/sync-firebase-user - Sync Firebase user to backend
 * Optional endpoint for syncing Firebase user data with backend
 */
export const syncFirebaseUserHandler = http.post('http://localhost:8080/api/auth/sync-firebase-user', async ({ request }) => {
  try {
    const firebaseUser = await request.json() as {
      uid: string;
      email: string;
      displayName: string;
    };
    
    // Validate required fields
    if (!firebaseUser.uid || !firebaseUser.email) {
      return HttpResponse.json(
        {
          success: false,
          data: null,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Firebase UID and email are required'
          }
        },
        { status: 422 }
      );
    }

    // Create or update user based on Firebase data
    const user = createFirebaseUser(firebaseUser);

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
          message: 'An unexpected error occurred during Firebase user sync'
        }
      },
      { status: 500 }
    );
  }
});

/**
 * GET /auth/me - Get current user profile (Firebase authenticated)
 * In a real app, this would validate Firebase ID tokens
 */
export const profileHandler = http.get('http://localhost:8080/api/auth/me', async ({ request }) => {
  try {
    // Get authorization header (would contain Firebase ID token in real app)
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return HttpResponse.json(
        {
          success: false,
          data: null,
          error: {
            code: 'MISSING_TOKEN',
            message: 'Firebase ID token is required'
          }
        },
        { status: 401 }
      );
    }

    // For testing, return a mock user based on the token
    // In a real app, you'd verify the Firebase ID token
    const user = findUserByEmail('admin@example.com'); // Mock default user
    
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

// Export all Firebase auth handlers
export const authHandlers = [
  syncFirebaseUserHandler,
  profileHandler,
  optionsHandler
];

// Legacy handlers removed:
// - loginHandler: Now handled by Firebase signInWithPopup
// - logoutHandler: Now handled by Firebase signOut
// - refreshHandler: Now handled automatically by Firebase
