/**
 * User Fixtures for MSW Mocks
 * 
 * Mock user data for testing different roles and scenarios
 */

import type { User } from '../../shared/types/domain';

export const mockUsers: Record<string, User> = {
  admin: {
    id: '01J9W2Y6ZC7YFQZB6F1V8D8RQP',
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+1-555-0101',
    role: 'admin',
    status: 'active',
    deleted: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    country: {
      id: '01J9WX1A24',
      name: 'Canada',
      code: 'CA'
    },
    province: {
      id: '01J9WPA124',
      name: 'Ontario',
      code: 'ON',
      countryId: '01J9WX1A24'
    }
  },
  teacher: {
    id: '01J9W2Y6ZC7YFQZB6F1V8D8RQQ',
    name: 'Teacher User',
    email: 'teacher@example.com',
    phone: '+1-555-0102',
    role: 'teacher',
    status: 'active',
    deleted: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    country: {
      id: '01J9WX1A23',
      name: 'Singapore',
      code: 'SG'
    },
    province: {
      id: '01J9WPA123',
      name: 'Central',
      code: 'SG-01',
      countryId: '01J9WX1A23'
    }
  },
  student: {
    id: '01J9W2Y6ZC7YFQZB6F1V8D8RQR',
    name: 'Student User',
    email: 'student@example.com',
    phone: '+1-555-0103',
    role: 'student',
    status: 'active',
    deleted: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    country: {
      id: '01J9WX1A24',
      name: 'Canada',
      code: 'CA'
    },
    province: {
      id: '01J9WPA125',
      name: 'British Columbia',
      code: 'BC',
      countryId: '01J9WX1A24'
    }
  }
};

// Firebase user mapping (no passwords needed)
export const mockFirebaseUsers: Record<string, { uid: string; email: string; displayName: string }> = {
  admin: { uid: 'firebase-uid-admin-001', email: 'admin@example.com', displayName: 'Admin User' },
  teacher: { uid: 'firebase-uid-teacher-001', email: 'teacher@example.com', displayName: 'Teacher User' },
  student: { uid: 'firebase-uid-student-001', email: 'student@example.com', displayName: 'Student User' },
  test: { uid: 'firebase-uid-test-001', email: 'test@example.com', displayName: 'Test User' }
};

// Helper to find user by email
export function findUserByEmail(email: string): User | null {
  const userEntry = Object.entries(mockUsers).find(([_, user]) => user.email === email);
  return userEntry ? userEntry[1] : null;
}

// Helper to find user by Firebase UID
export function findUserByFirebaseUid(uid: string): User | null {
  const firebaseEntry = Object.entries(mockFirebaseUsers).find(([_, fbUser]) => fbUser.uid === uid);
  if (firebaseEntry) {
    const userRole = firebaseEntry[0];
    return mockUsers[userRole] || null;
  }
  return null;
}

// Helper to create/update user from Firebase data
export function createFirebaseUser(firebaseUser: { uid: string; email: string; displayName: string }): User {
  // Try to find existing user by email
  let existingUser = findUserByEmail(firebaseUser.email);
  
  if (existingUser) {
    // Update existing user with Firebase data
    return {
      ...existingUser,
      id: firebaseUser.uid, // Use Firebase UID as user ID
      name: firebaseUser.displayName || existingUser.name,
      email: firebaseUser.email,
      updatedAt: new Date().toISOString()
    };
  }
  
  // Create new user from Firebase data
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || 'User',
    email: firebaseUser.email,
    role: 'student', // Default role for new Firebase users
    status: 'active',
    deleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
