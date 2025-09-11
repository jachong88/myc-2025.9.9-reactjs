# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a React application built with TypeScript and Vite. It's a minimal frontend project using React 19 with modern tooling including ESLint for linting and strict TypeScript configuration.

## Essential Development Commands

### Development Server

```bash
npm run dev
# Starts Vite development server with hot module replacement at http://localhost:5173
```

### Building

```bash
npm run build
# Compiles TypeScript and builds production bundle with Vite
```

### Linting

```bash
npm run lint
# Runs ESLint on all TypeScript/JavaScript files
```

### Preview Production Build

```bash
npm run preview
# Serves the production build locally for testing
```

## Architecture & Structure

### Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Linting**: ESLint with TypeScript support and React hooks/refresh plugins
- **Styling**: CSS modules (App.css, index.css)

### Project Structure

```
src/
├── main.tsx          # Application entry point with React root
├── App.tsx           # Main application component
├── App.css           # Component-specific styles
├── index.css         # Global styles
├── vite-env.d.ts     # Vite type declarations
└── assets/           # Static assets (images, icons)
    └── react.svg
```

### TypeScript Configuration

- **Strict mode enabled** with comprehensive linting rules
- **Project references** setup using separate configs for app and node environments
- **Modern ES2022** target with ESNext modules
- **Bundler module resolution** optimized for Vite
- **React JSX** transform enabled

### Key Configuration Files

- `vite.config.ts` - Vite bundler configuration with React plugin
- `eslint.config.js` - Modern ESLint flat config with TypeScript and React rules
- `tsconfig.json` - TypeScript project references configuration
- `tsconfig.app.json` - Main application TypeScript configuration

## Development Notes

### Code Standards

The project uses strict TypeScript configuration with:

- No unused locals or parameters allowed
- Strict type checking enabled
- No fallthrough cases in switch statements
- No unchecked side effect imports

### Hot Module Replacement

Vite provides fast HMR during development. Changes to `.tsx` files will automatically reload in the browser.

### Asset Handling

Static assets should be placed in the `src/assets/` directory for processing by Vite, or in the `public/` directory for direct serving.

### Key Workflow Files

- `C:\d\code-myc-2025.9.9-ai\docs\common\development-workflow.md` - Complete workflow documentation
- `C:\d\code-myc-2025.9.9-ai\docs\development\backlog.md` - Current task backlog and status tracking
