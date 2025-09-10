/**
 * MYC Card Component
 *
 * Thin wrapper around Ant Design Card with MYC design system defaults.
 * Defaults:
 * - bordered: true
 * - hoverable: true
 * - bodyStyle uses token-based spacing where possible
 */

import { Card as AntCard } from 'antd';
import type { CardProps as AntCardProps } from 'antd';
import { theme } from 'antd';

export interface CardProps extends AntCardProps {
  /**
   * Content padding inside card body (defaults to design token padding)
   */
  padding?: number;
}

export function Card({
  bordered = true,
  hoverable = true,
  padding,
  bodyStyle,
  children,
  ...props
}: CardProps) {
  const { token } = theme.useToken();
  const resolvedPadding = typeof padding === 'number' ? padding : token.padding;

  return (
    <AntCard
      bordered={bordered}
      hoverable={hoverable}
      bodyStyle={{ padding: resolvedPadding, ...(bodyStyle || {}) }}
      {...props}
    >
      {children}
    </AntCard>
  );
}

export default Card;

