/**
 * MYC Form Components
 *
 * Standardized Form wrappers following MYC design system:
 * - Default vertical layout
 * - LabeledInput helper for common form patterns
 * - Required field indicators
 * - Consistent validation styling
 */

import { Form as AntForm } from 'antd';
import type { FormProps as AntFormProps, FormItemProps } from 'antd';
import React from 'react';
import { Input, InputPassword, InputEmail, InputTextArea } from './Input';
import { Select, CountrySelect, ProvinceSelect, RoleSelect } from './Select';

/**
 * Standard Form component with vertical layout default
 */
export function Form({
  layout = 'vertical',
  children,
  ...props
}: AntFormProps & { children?: React.ReactNode }) {
  return (
    <AntForm
      layout={layout}
      {...props}
    >
      {children}
    </AntForm>
  );
}

/**
 * Form.Item re-export for convenience
 */
export const FormItem = AntForm.Item;

/**
 * LabeledInput - Common form pattern with label, validation, and required indicator
 */
export function LabeledInput({
  name,
  label,
  required = false,
  type = 'text',
  placeholder,
  rules = [],
  ...props
}: {
  name: string;
  label: string;
  required?: boolean;
  type?: 'text' | 'password' | 'email' | 'textarea';
  placeholder?: string;
  rules?: FormItemProps['rules'];
} & Omit<FormItemProps, 'name' | 'label' | 'required' | 'rules'>) {
  // Add required rule if needed
  const finalRules = required 
    ? [{ required: true, message: `${label} is required` }, ...(rules || [])]
    : rules;

  // Add email validation for email type
  const emailRules = type === 'email' 
    ? [{ type: 'email' as const, message: 'Please enter a valid email' }, ...(finalRules || [])]
    : finalRules;

  // Render appropriate input component
  const renderInput = () => {
    const inputProps = { placeholder: placeholder || `Enter ${label.toLowerCase()}` };
    
    switch (type) {
      case 'password':
        return <InputPassword {...inputProps} />;
      case 'email':
        return <InputEmail {...inputProps} />;
      case 'textarea':
        return <InputTextArea {...inputProps} />;
      case 'text':
      default:
        return <Input {...inputProps} />;
    }
  };

  return (
    <FormItem
      name={name}
      label={label}
      rules={emailRules}
      {...props}
    >
      {renderInput()}
    </FormItem>
  );
}

/**
 * LabeledSelect - Common form pattern for select fields
 */
export function LabeledSelect({
  name,
  label,
  required = false,
  type = 'basic',
  placeholder,
  options = [],
  rules = [],
  ...props
}: {
  name: string;
  label: string;
  required?: boolean;
  type?: 'basic' | 'role' | 'country' | 'province';
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  rules?: FormItemProps['rules'];
  country?: string; // for province select
} & Omit<FormItemProps, 'name' | 'label' | 'required' | 'rules'>) {
  // Add required rule if needed
  const finalRules = required 
    ? [{ required: true, message: `${label} is required` }, ...(rules || [])]
    : rules;

  // Render appropriate select component
  const renderSelect = () => {
    const selectProps = { 
      placeholder: placeholder || `Select ${label.toLowerCase()}`,
      style: { width: '100%' }
    };
    
    switch (type) {
      case 'role':
        return <RoleSelect {...selectProps} />;
      case 'country':
        return <CountrySelect {...selectProps} />;
      case 'province':
        return <ProvinceSelect {...selectProps} country={(props as any).country} />;
      case 'basic':
      default:
        return <Select options={options} {...selectProps} />;
    }
  };

  return (
    <FormItem
      name={name}
      label={label}
      rules={finalRules}
      {...props}
    >
      {renderSelect()}
    </FormItem>
  );
}

/**
 * FormActions - Standard form action buttons layout
 */
export function FormActions({ 
  children,
  align = 'left'
}: { 
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
}) {
  const justifyContent = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end'
  }[align];

  return (
    <div style={{ 
      display: 'flex', 
      gap: 8, 
      justifyContent,
      marginTop: 24 
    }}>
      {children}
    </div>
  );
}

// Re-export Form.useForm and other utilities
export const useForm = AntForm.useForm;
export const FormProvider = AntForm.Provider;

export default Form;
