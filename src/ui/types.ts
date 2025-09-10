/**
 * Common TypeScript types and interfaces for MYC UI components
 * Provides base interfaces that extend Ant Design component props
 */

import type { ReactNode } from 'react';

/**
 * Common variant types used across components
 */
export type ButtonVariant = 'primary' | 'default' | 'danger' | 'link';
export type StatusVariant = 'active' | 'inactive' | 'pending';
export type SizeVariant = 'small' | 'middle' | 'large';

/**
 * Design system color tokens
 * Based on MYC design system specifications
 */
export interface ColorTokens {
  primary: '#1677ff';
  danger: '#ff4d4f';
  success: '#52c41a';
  warning: '#faad14';
  info: '#1890ff';
  textPrimary: '#000000';
  textSecondary: '#8c8c8c';
  background: '#f0f2f5';
}

/**
 * Design system spacing tokens
 * Based on MYC design system specifications
 */
export interface SpacingTokens {
  xs: 4;
  sm: 8;
  md: 16;
  lg: 24;
  xl: 32;
}

/**
 * Common component props that extend across all UI components
 */
export interface BaseComponentProps {
  children?: ReactNode;
  className?: string;
  'data-testid'?: string;
}

/**
 * Props for components that support required field indicators
 */
export interface RequiredFieldProps {
  required?: boolean;
}

/**
 * Props for components that support validation states
 */
export interface ValidationProps {
  status?: 'error' | 'warning' | 'success' | '';
  help?: string;
}

/**
 * Typography component variants
 */
export type TypographyVariant = 'page-title' | 'section-title' | 'body-text' | 'muted-text';

/**
 * Form field configuration for consistent form layouts
 */
export interface FormFieldConfig {
  name: string;
  label: string;
  required?: boolean;
  maxLength?: number;
  placeholder?: string;
  help?: string;
}

/**
 * Table column action configuration
 */
export interface TableActionConfig {
  label: string;
  variant: ButtonVariant;
  onClick: () => void;
  confirm?: {
    title: string;
    description?: string;
  };
}

/**
 * Status configuration for Tag components
 */
export interface StatusConfig {
  variant: StatusVariant;
  color: 'green' | 'red' | 'orange';
  label: string;
}

/**
 * Design token configuration
 */
export interface DesignTokens {
  colors: ColorTokens;
  spacing: SpacingTokens;
  typography: {
    fontFamily: 'Inter, sans-serif';
    fontSize: {
      base: 14;
    };
  };
  borderRadius: {
    base: 8;
  };
}
