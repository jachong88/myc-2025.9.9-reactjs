/**
 * MYC App Sidebar Component
 * 
 * Fixed sidebar navigation with Users and Studios menu items.
 * Follows MYC design system wireframe specifications.
 */

import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, BankOutlined } from '@ant-design/icons';
import { designTokens } from '../../ui/theme';

const { Sider } = Layout;

interface SidebarProps {
  /** Currently active menu item key */
  activeKey?: string;
  /** Callback when menu item is selected */
  onMenuSelect?: (key: string) => void;
  /** Whether sidebar is collapsed */
  collapsed?: boolean;
  /** Callback when collapse state changes */
  onCollapse?: (collapsed: boolean) => void;
}

/**
 * MYC App Sidebar
 * 
 * Fixed sidebar with navigation menu items for Users and Studios.
 * Uses MYC design tokens and supports active state highlighting.
 */
export function Sidebar({ 
  activeKey = 'users', 
  onMenuSelect, 
  collapsed = false, 
  onCollapse 
}: SidebarProps) {
  
  // Menu items configuration
  const menuItems = [
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Users',
    },
    {
      key: 'studios',
      icon: <BankOutlined />,
      label: 'Studios',
    },
  ];

  const siderStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    borderRight: '1px solid #f0f0f0',
    height: '100vh',
  };

  const menuStyle: React.CSSProperties = {
    borderRight: 'none',
    height: '100%',
    paddingTop: designTokens.spacing.md,
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    if (onMenuSelect) {
      onMenuSelect(key);
    }
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      style={siderStyle}
      theme="light"
      width={200}
      collapsedWidth={80}
    >
      <Menu
        mode="inline"
        selectedKeys={[activeKey]}
        items={menuItems}
        onClick={handleMenuClick}
        style={menuStyle}
        theme="light"
      />
    </Sider>
  );
}

export default Sidebar;
