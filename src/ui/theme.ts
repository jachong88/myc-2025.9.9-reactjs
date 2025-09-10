/**
 * MYC Design System Theme Configuration
 * Integrates MYC design tokens with Ant Design theme system
 */

import type { ThemeConfig } from 'antd';
import type { DesignTokens } from './types';

/**
 * MYC Design Tokens
 * Source of truth for all design system values
 */
export const designTokens: DesignTokens = {
  colors: {
    primary: '#1677ff',
    danger: '#ff4d4f', 
    success: '#52c41a',
    warning: '#faad14',
    info: '#1890ff',
    textPrimary: '#000000',
    textSecondary: '#8c8c8c',
    background: '#f0f2f5'
  },
  spacing: {
    xs: 4,
    sm: 8, 
    md: 16,
    lg: 24,
    xl: 32
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    fontSize: {
      base: 14
    }
  },
  borderRadius: {
    base: 8
  }
};

/**
 * Ant Design Theme Configuration
 * Maps MYC design tokens to Ant Design's token system
 */
export const antdThemeConfig: ThemeConfig = {
  token: {
    // Color tokens
    colorPrimary: designTokens.colors.primary,
    colorError: designTokens.colors.danger,
    colorSuccess: designTokens.colors.success, 
    colorWarning: designTokens.colors.warning,
    colorInfo: designTokens.colors.info,
    colorText: designTokens.colors.textPrimary,
    colorTextSecondary: designTokens.colors.textSecondary,
    colorBgLayout: designTokens.colors.background,
    
    // Typography tokens
    fontFamily: designTokens.typography.fontFamily,
    fontSize: designTokens.typography.fontSize.base,
    
    // Spacing tokens (mapped to Ant Design's spacing system)
    marginXS: designTokens.spacing.xs,
    marginSM: designTokens.spacing.sm,
    margin: designTokens.spacing.md,
    marginLG: designTokens.spacing.lg,
    marginXL: designTokens.spacing.xl,
    
    paddingXS: designTokens.spacing.xs,
    paddingSM: designTokens.spacing.sm,
    padding: designTokens.spacing.md,
    paddingLG: designTokens.spacing.lg,
    paddingXL: designTokens.spacing.xl,
    
    // Border radius
    borderRadius: designTokens.borderRadius.base,
    
    // Additional customizations for MYC brand
    controlHeight: 32,
    wireframe: false,
  },
  components: {
    // Button component customizations
    Button: {
      primaryColor: designTokens.colors.primary,
      dangerColor: designTokens.colors.danger,
      borderRadius: designTokens.borderRadius.base,
    },
    
    // Input component customizations
    Input: {
      borderRadius: designTokens.borderRadius.base,
      paddingInline: designTokens.spacing.sm,
    },
    
    // Table component customizations  
    Table: {
      borderRadius: designTokens.borderRadius.base,
      padding: designTokens.spacing.sm,
      paddingXS: designTokens.spacing.xs,
    },
    
    // Card component customizations
    Card: {
      borderRadius: designTokens.borderRadius.base,
      padding: designTokens.spacing.md,
    },
    
    // Modal component customizations
    Modal: {
      borderRadius: designTokens.borderRadius.base,
      padding: designTokens.spacing.lg,
    },
    
    // Typography component customizations
    Typography: {
      fontFamily: designTokens.typography.fontFamily,
      fontSize: designTokens.typography.fontSize.base,
    }
  }
};

/**
 * CSS Custom Properties for design tokens
 * Can be used in CSS files or styled components
 */
export const cssVariables = {
  // Colors
  '--myc-color-primary': designTokens.colors.primary,
  '--myc-color-danger': designTokens.colors.danger,
  '--myc-color-success': designTokens.colors.success,
  '--myc-color-warning': designTokens.colors.warning,
  '--myc-color-info': designTokens.colors.info,
  '--myc-color-text-primary': designTokens.colors.textPrimary,
  '--myc-color-text-secondary': designTokens.colors.textSecondary,
  '--myc-color-background': designTokens.colors.background,
  
  // Spacing
  '--myc-space-xs': `${designTokens.spacing.xs}px`,
  '--myc-space-sm': `${designTokens.spacing.sm}px`,
  '--myc-space-md': `${designTokens.spacing.md}px`,
  '--myc-space-lg': `${designTokens.spacing.lg}px`,
  '--myc-space-xl': `${designTokens.spacing.xl}px`,
  
  // Typography
  '--myc-font-family': designTokens.typography.fontFamily,
  '--myc-font-size-base': `${designTokens.typography.fontSize.base}px`,
  
  // Border radius
  '--myc-border-radius': `${designTokens.borderRadius.base}px`,
} as const;

/**
 * Helper function to inject CSS variables into document
 * Should be called in the main App component
 */
export const injectCSSVariables = () => {
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    (Object.entries as any)(cssVariables).forEach(([property, value]: [string, string]) => {
      root.style.setProperty(property, value);
    });
  }
};
