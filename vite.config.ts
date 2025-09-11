/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    
    // Path aliases for cleaner imports
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@/components': path.resolve(__dirname, './src/shared/components'),
        '@/utils': path.resolve(__dirname, './src/shared/utils'),
        '@/types': path.resolve(__dirname, './src/shared/types'),
        '@/api': path.resolve(__dirname, './src/shared/api'),
        '@/stores': path.resolve(__dirname, './src/shared/stores'),
        '@/hooks': path.resolve(__dirname, './src/shared/hooks'),
      },
    },
    
    // Development server configuration
    server: {
      port: parseInt(env.VITE_DEV_SERVER_PORT || '5173'),
      host: env.VITE_DEV_SERVER_HOST || 'localhost',
      open: env.VITE_AUTO_OPEN_BROWSER === 'true',
      
      // Proxy configuration for API calls (when not using MSW)
      proxy: env.VITE_USE_MSW === 'true' ? undefined : {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        },
      },
    },
    
    // Build configuration
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      minify: mode === 'production',
      
      // Environment-specific build optimizations
      rollupOptions: {
        output: {
          // Chunk splitting for better caching
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['antd', '@ant-design/icons'],
            router: ['react-router-dom'],
            firebase: ['firebase/app', 'firebase/auth'],
          },
        },
      },
    },
    
    // Define global constants
    define: {
      __DEV__: JSON.stringify(mode === 'development'),
      __PROD__: JSON.stringify(mode === 'production'),
      __VERSION__: JSON.stringify(process.env.npm_package_version || '0.0.0'),
    },
    
    // Test configuration
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test-setup.ts'],
      globals: true,
      
      // Test-specific environment variables
      env: {
        VITE_ENV: 'test',
        VITE_USE_MSW: 'true',
        VITE_DEBUG_API: 'false',
        VITE_DEBUG_AUTH: 'false',
      },
    },
  }
})
