/// <reference types="vite/client" />

/**
 * Environment Variables Type Definitions
 * Provides TypeScript support for all environment variables used in the application
 */
interface ImportMetaEnv {
  // API Configuration
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
  
  // Environment
  readonly VITE_ENV: 'development' | 'production' | 'test' | 'local'
  
  // Feature Flags
  readonly VITE_USE_MOCK_API: 'true' | 'false'
  readonly VITE_USE_MSW: 'true' | 'false'
  
  // Firebase Configuration
  readonly REACT_APP_FIREBASE_API_KEY: string
  readonly REACT_APP_FIREBASE_AUTH_DOMAIN: string
  readonly REACT_APP_FIREBASE_PROJECT_ID: string
  readonly REACT_APP_FIREBASE_STORAGE_BUCKET: string
  readonly REACT_APP_FIREBASE_MESSAGING_SENDER_ID: string
  readonly REACT_APP_FIREBASE_APP_ID: string
  
  // Debug Configuration
  readonly VITE_DEBUG_API: 'true' | 'false'
  readonly VITE_DEBUG_AUTH: 'true' | 'false'
  
  // Development Server Configuration
  readonly VITE_DEV_SERVER_PORT: string
  readonly VITE_DEV_SERVER_HOST: string
  readonly VITE_AUTO_OPEN_BROWSER: 'true' | 'false'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/**
 * Global Type Definitions
 * Provides TypeScript support for global constants defined in Vite config
 */
declare const __DEV__: boolean
declare const __PROD__: boolean
declare const __VERSION__: string
