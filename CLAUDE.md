# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production (TypeScript + Vite)
- `npm run preview` - Preview production build

### Testing

- `npm run test` - Run tests in watch mode with Vitest
- `npm run test:run` - Run all tests once
- To run a single test file: `npx vitest run path/to/test.file.test.ts`

### Code Quality

- `npm run lint` - Lint code with ESLint (TypeScript + React rules)

## Architecture Overview

### Technology Stack

- **Frontend**: React 19 + TypeScript + Vite
- **UI Framework**: Ant Design (antd) with custom theme provider
- **State Management**: Zustand for authentication and global state
- **Routing**: React Router v7 with nested layouts
- **HTTP Client**: Axios with comprehensive interceptors and retry logic
- **Testing**: Vitest + Testing Library + jsdom
- **Authentication**: JWT tokens with automatic refresh and role-based access control

### Directory Structure

```
src/
├── app/                    # App-level configuration and routing
│   ├── layout/            # Layout components (AppLayout, Header, Sidebar)
│   └── routes.tsx         # React Router configuration with protection
├── features/              # Feature-based modules
│   ├── auth/             # Authentication pages and components
│   └── dashboard/        # Dashboard feature
├── shared/               # Shared utilities and components
│   ├── api/             # HTTP client, auth API, error handling
│   ├── components/      # Reusable components (Page, ErrorBoundary, routing)
│   ├── hooks/           # Custom React hooks
│   ├── stores/          # Zustand stores (authStore)
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions (JWT, etc.)
└── ui/                  # Design system components (Button, Typography, ThemeProvider)
```

### Key Architecture Patterns

#### Authentication Flow

- JWT-based authentication with access tokens stored in memory
- Refresh tokens handled via httpOnly cookies
- Automatic token refresh on 401 responses
- Role-based access control (admin, teacher, student)
- Protected routes with `ProtectedRoute` component
- Auto-logout functionality with configurable warning time

#### State Management

- Zustand store (`authStore`) manages authentication state
- Store includes actions for login, logout, token refresh, and profile updates
- Role checking helpers (`hasRole`, `isAdmin`, `canAccess`)
- Persistent authentication state restoration on app initialization

#### HTTP Client Architecture

- Centralized Axios instance with request/response interceptors
- Automatic authentication header injection
- Comprehensive error handling with retry logic (3 retries with exponential backoff)
- Request timing and debugging capabilities
- API client status tracking for online/offline detection
- Environment-based configuration (VITE_API_BASE_URL, etc.)

#### Component Organization

- Feature-based folder structure for scalability
- Shared components in `shared/components/` for reusability
- UI components in `ui/` for design system consistency
- Layout components handle navigation and structure
- Error boundaries at app and route levels

#### Routing Strategy

- React Router v7 with createBrowserRouter
- Nested routing with shared `RootLayout`
- Protected routes with role requirements
- Route-aware active menu highlighting
- Centralized logout modal management

### Development Notes

#### Testing Setup

- Vitest configured with jsdom environment
- Test setup file at `src/test-setup.ts`
- Integration tests for authentication and HTTP client
- Component tests using Testing Library

#### Backend Integration

- API base URL: `http://localhost:8080/api` (configurable via VITE_API_BASE_URL)
- Expected backend endpoints: `/auth/login`, `/auth/logout`, `/auth/refresh`, `/auth/profile`
- Tests may fail if backend is not running (network errors expected)

#### Type Safety

- Strict TypeScript configuration
- Domain types defined in `shared/types/`
- API response typing with generic `APIResponse<T>`
- Comprehensive error type definitions

### Common Patterns

#### Error Handling

- Normalized error objects with consistent structure
- User-facing error notifications via `showErrorNotification`
- Detailed error logging with context
- HTTP status-specific error handling (401, 403, 429, 5xx)

#### Component Development

- Use `Page` component wrapper for consistent layout
- Error boundaries for component-level error isolation
- Ant Design components with MYC theme provider
- TypeScript interfaces for all component props

#### always
show contect before creating/editing files.
ask for permission before creating/editing files
