/**
 * MYC UI Components Library
 * Barrel export file for clean component imports
 * 
 * Usage:
 * import { Button, Input, Table } from '@/ui';
 * 
 * This file will be updated as components are implemented
 */

// Types and theme configuration
export type * from './types';
export { designTokens, antdThemeConfig, cssVariables, injectCSSVariables } from './theme';
export { MYCThemeProvider } from './ThemeProvider';

// Component exports
export { Button } from './Button';
export { PageTitle, SectionTitle, BodyText, MutedText, Paragraph } from './Typography';
export { Input, InputPassword, InputEmail, InputTextArea } from './Input';
export { Select, CountrySelect, ProvinceSelect, CascadingCountryProvinceSelect, RoleSelect, locationAPI } from './Select';
export type { CountryOption, ProvinceOption } from './Select';
export { Tag, StatusTag, ActiveTag, InactiveTag, PendingTag, renderStatusTag } from './Tag';
export { Card } from './Card';
export type { CardProps } from './Card';
export { Modal, ConfirmModal } from './Modal';
export type { ModalProps } from './Modal';
export { Form, FormItem, LabeledInput, LabeledSelect, FormActions, useForm, FormProvider } from './Form';
export { Table, TableActions, ClickableNameColumn, StatusColumn, TableColumns, UserTable } from './Table';

// Re-export commonly used types for convenience
export type { 
  ButtonVariant,
  StatusVariant, 
  TypographyVariant,
  BaseComponentProps,
  RequiredFieldProps,
  ValidationProps,
  FormFieldConfig,
  TableActionConfig,
  StatusConfig,
  DesignTokens
} from './types';
