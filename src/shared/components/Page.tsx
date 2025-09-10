/**
 * MYC Page Component
 * 
 * Consistent wrapper for all application pages.
 * Provides standardized title display and optional action area.
 * Follows MYC design system specifications.
 */

import React from 'react';
import { PageTitle } from '../../ui/Typography';
import { designTokens } from '../../ui/theme';

interface PageProps {
  /** Page title to display */
  title: string;
  /** Optional extra actions/buttons to display next to title */
  extra?: React.ReactNode;
  /** Page content */
  children: React.ReactNode;
  /** Additional styling for the page wrapper */
  style?: React.CSSProperties;
}

/**
 * Page Component
 * 
 * Provides consistent layout and typography for all pages.
 * Uses MYC design tokens for spacing and follows the design system pattern.
 */
export function Page({ title, extra, children, style }: PageProps) {
  const pageStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: `${designTokens.spacing.lg}px`,
    width: '100%',
    ...style,
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: designTokens.spacing.md,
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    color: designTokens.colors.textPrimary,
  };

  return (
    <div style={pageStyle}>
      {/* Page Header with Title and Optional Actions */}
      <div style={headerStyle}>
        <PageTitle style={titleStyle}>
          {title}
        </PageTitle>
        {extra && (
          <div>
            {extra}
          </div>
        )}
      </div>
      
      {/* Page Content */}
      <div>
        {children}
      </div>
    </div>
  );
}

export default Page;
