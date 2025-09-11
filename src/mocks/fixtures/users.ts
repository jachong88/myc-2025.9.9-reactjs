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

export const mockCredentials: Record<string, { email: string; password: string }> = {
  admin: { email: 'admin@example.com', password: 'admin123' },
  teacher: { email: 'teacher@example.com', password: 'teacher123' },
  student: { email: 'student@example.com', password: 'student123' },
  test: { email: 'test@example.com', password: 'password123' } // Generic test user
};

// Helper to find user by email
export function findUserByEmail(email: string): User | null {
  const userEntry = Object.entries(mockUsers).find(([_, user]) => user.email === email);
  return userEntry ? userEntry[1] : null;
}

// Helper to validate credentials
export function validateCredentials(email: string, password: string): User | null {
  const credEntry = Object.entries(mockCredentials).find(([_, cred]) => cred.email === email && cred.password === password);
  if (credEntry) {
    const userRole = credEntry[0];
    return mockUsers[userRole] || null;
  }
  return null;
}