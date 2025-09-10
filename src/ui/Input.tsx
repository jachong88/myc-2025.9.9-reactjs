/**
 * MYC Input Components
 *
 * Standardized Input wrappers following MYC design system.
 * - Default allowClear behavior
 * - Email input convenience wrapper
 * - TextArea defaults: 500 char max, showCount, rows=3
 */

import { Input as AntInput } from 'antd';
import type { InputProps as AntInputProps } from 'antd';
import type { ComponentProps } from 'react';

type TextAreaProps = ComponentProps<typeof AntInput.TextArea>;

/**
 * Standard text input with allowClear enabled by default.
 * Note: Validation (required, pattern) should be defined in Form.Item rules.
 */
export function Input({
  allowClear = true,
  ...props
}: AntInputProps) {
  return <AntInput allowClear={allowClear} {...props} />;
}

/**
 * Password input with visibility toggle (AntD default behavior).
 */
export function InputPassword(props: AntInputProps) {
  return <AntInput.Password {...props} />;
}

/**
 * Email input convenience wrapper.
 * Sets type="email" and allowClear default true.
 * Note: Actual email validation should be handled in Form.Item rules.
 */
export function InputEmail({
  type = 'email',
  allowClear = true,
  ...props
}: AntInputProps) {
  return <AntInput type={type} allowClear={allowClear} {...props} />;
}

/**
 * TextArea with design-system defaults:
 * - maxLength: 500
 * - showCount: true
 * - rows: 3
 */
export function InputTextArea({
  maxLength = 500,
  showCount = true,
  rows = 3,
  ...props
}: TextAreaProps) {
  return <AntInput.TextArea maxLength={maxLength} showCount={showCount} rows={rows} {...props} />;
}

export default Input;

