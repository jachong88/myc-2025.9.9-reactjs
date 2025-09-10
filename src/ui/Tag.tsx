/**
 * MYC Tag Components
 *
 * Standardized Tag wrappers following MYC design system.
 * Provides status indicators with consistent colors:
 * - Active: Green (#52c41a)
 * - Inactive: Red (#ff4d4f)
 * - Pending: Orange (#faad14)
 */

import { Tag as AntTag } from 'antd';
import type { TagProps as AntTagProps } from 'antd';
import type { StatusVariant } from './types';

/**
 * Standard Tag component with consistent defaults
 */
export function Tag(props: AntTagProps) {
  return <AntTag {...props} />;
}

/**
 * Status Tag component with predefined variants
 * Uses MYC design system colors
 */
export function StatusTag({
  status,
  children,
  ...props
}: Omit<AntTagProps, 'color'> & {
  status: StatusVariant;
  children?: React.ReactNode;
}) {
  const statusConfig = {
    active: { color: 'green', text: 'Active' },
    inactive: { color: 'red', text: 'Inactive' },
    pending: { color: 'orange', text: 'Pending' }
  } as const;

  const config = statusConfig[status];
  const displayText = children || config.text;

  return (
    <Tag color={config.color} {...props}>
      {displayText}
    </Tag>
  );
}

/**
 * Active Status Tag - Green (#52c41a)
 * For active users, enabled features, etc.
 */
export function ActiveTag({
  children = 'Active',
  ...props
}: Omit<AntTagProps, 'color'>) {
  return (
    <Tag color="green" {...props}>
      {children}
    </Tag>
  );
}

/**
 * Inactive Status Tag - Red (#ff4d4f)
 * For inactive users, disabled features, etc.
 */
export function InactiveTag({
  children = 'Inactive',
  ...props
}: Omit<AntTagProps, 'color'>) {
  return (
    <Tag color="red" {...props}>
      {children}
    </Tag>
  );
}

/**
 * Pending Status Tag - Orange (#faad14)
 * For pending approvals, processing states, etc.
 */
export function PendingTag({
  children = 'Pending',
  ...props
}: Omit<AntTagProps, 'color'>) {
  return (
    <Tag color="orange" {...props}>
      {children}
    </Tag>
  );
}

/**
 * Utility function to render status tag based on string value
 * Useful for dynamic rendering from API data
 */
export function renderStatusTag(
  status: string, 
  props?: Omit<AntTagProps, 'color'>
): React.ReactElement {
  const normalizedStatus = status.toLowerCase() as StatusVariant;
  
  switch (normalizedStatus) {
    case 'active':
      return <ActiveTag {...props} />;
    case 'inactive':
      return <InactiveTag {...props} />;
    case 'pending':
      return <PendingTag {...props} />;
    default:
      // Fallback for unknown status
      return <Tag {...props}>{status}</Tag>;
  }
}

export default Tag;
