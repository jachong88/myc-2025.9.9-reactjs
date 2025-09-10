/**
 * MYC Button Component
 * 
 * Standardized button component following MYC design system specifications.
 * Wraps Ant Design Button with consistent variants and styling.
 */

import React from 'react';
import { Button as AntButton } from 'antd';
import type { ButtonProps as AntButtonProps } from 'antd';
import type { ButtonVariant } from './types';

interface ButtonProps extends Omit<AntButtonProps, 'type' | 'danger' | 'variant'> {
  /**
   * Button variant following MYC design system
   * - primary: Main CTA (only one per page/form) - #1677ff
   * - default: Secondary actions (Cancel, Reset, Edit) - gray outline
   * - danger: Destructive actions (Delete, Disable) - #ff4d4f, must confirm
   * - link: Inline actions (View Details, navigation) - text-only
   */
  variant?: ButtonVariant;
}

/**
 * MYC Button component following design system specifications
 * 
 * Design System Rules:
 * - Only ONE primary button per page/form
 * - Destructive actions (danger) must always include confirmation
 * - Use link variant for inline/low-emphasis actions
 * 
 * @param variant Button style variant (default: 'default')
 * @param children Button content
 * @param props All other Ant Design Button props are supported
 * 
 * @example
 * ```tsx
 * // Primary button (only one per page)
 * <Button variant="primary">Save Changes</Button>
 * 
 * // Secondary actions
 * <Button variant="default">Cancel</Button>
 * <Button variant="default">Reset Form</Button>
 * 
 * // Destructive actions (use with confirmation)
 * <Button variant="danger">Delete User</Button>
 * 
 * // Inline actions
 * <Button variant="link">View Details</Button>
 * ```
 */
export function Button({
  variant = 'default',
  children,
  ...props
}: ButtonProps) {
  // Map variants to Ant Design props
  const variantProps = React.useMemo(() => {
    switch (variant) {
      case 'primary':
        return { type: 'primary' as const };
      case 'danger':
        return { type: 'primary' as const, danger: true };
      case 'link':
        return { type: 'link' as const };
      case 'default':
      default:
        return { type: 'default' as const };
    }
  }, [variant]);

  return (
    <AntButton {...variantProps} {...props}>
      {children}
    </AntButton>
  );
}

export default Button;
