/**
 * MYC Theme Provider Component
 * Wraps the application with MYC design system configuration
 */

import React, { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import type { ConfigProviderProps } from 'antd/es/config-provider';
import { antdThemeConfig, injectCSSVariables } from './theme';

interface MYCThemeProviderProps {
  children: React.ReactNode;
  theme?: ConfigProviderProps['theme'];
}

/**
 * MYC Theme Provider
 * 
 * Provides MYC design system theme configuration to all child components.
 * Automatically injects CSS variables for design tokens.
 * 
 * @param children - Child components to wrap with theme
 * @param theme - Optional theme overrides (will be merged with MYC theme)
 */
export function MYCThemeProvider({ 
  children, 
  theme 
}: MYCThemeProviderProps) {
  // Inject CSS variables on mount
  useEffect(() => {
    injectCSSVariables();
  }, []);

  // Merge custom theme with MYC theme if provided
  const mergedTheme = theme 
    ? {
        ...antdThemeConfig,
        token: { ...antdThemeConfig.token, ...theme.token },
        components: { ...antdThemeConfig.components, ...theme.components }
      }
    : antdThemeConfig;

  return (
    <ConfigProvider theme={mergedTheme}>
      {children}
    </ConfigProvider>
  );
}

export default MYCThemeProvider;
