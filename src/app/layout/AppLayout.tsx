/**
 * MYC App Layout Component
 * 
 * Main layout component that integrates Header, Sidebar, and Content areas.
 * Follows MYC design system wireframe specifications for the global layout.
 */

import React, { useState } from 'react';
import { Layout } from 'antd';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { designTokens } from '../../ui/theme';

const { Content } = Layout;

interface AppLayoutProps {
  /** Content to be rendered in the main content area */
  children: React.ReactNode;
  /** Current user name for header display */
  userName?: string;
  /** Currently active menu item */
  activeMenuItem?: string;
  /** Callback for menu navigation */
  onMenuSelect?: (key: string) => void;
  /** Callback for logout action */
  onLogout?: () => void;
}

/**
 * MYC App Layout
 * 
 * Complete application layout with header, sidebar navigation, and content area.
 * Uses MYC design tokens for consistent theming and spacing.
 */
export function AppLayout({ 
  children, 
  userName = "Admin User",
  activeMenuItem = "users",
  onMenuSelect,
  onLogout
}: AppLayoutProps) {
  // State for sidebar collapse
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarCollapse = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  const handleMenuSelect = (key: string) => {
    if (onMenuSelect) {
      onMenuSelect(key);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Default logout behavior - could be enhanced later
      console.log('Logout clicked');
    }
  };

  const contentStyle: React.CSSProperties = {
    margin: 0,
    minHeight: 'calc(100vh - 64px)', // Full height minus header
    background: designTokens.colors.background,
    padding: designTokens.spacing.lg,
    overflow: 'auto',
  };

  const layoutStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: designTokens.colors.background,
  };

  return (
    <Layout style={layoutStyle}>
      {/* Sidebar Navigation */}
      <Sidebar
        activeKey={activeMenuItem}
        onMenuSelect={handleMenuSelect}
        collapsed={sidebarCollapsed}
        onCollapse={handleSidebarCollapse}
      />
      
      {/* Main Layout with Header and Content */}
      <Layout>
        {/* Header */}
        <Header
          userName={userName}
          onLogout={handleLogout}
        />
        
        {/* Main Content Area */}
        <Content style={contentStyle}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
