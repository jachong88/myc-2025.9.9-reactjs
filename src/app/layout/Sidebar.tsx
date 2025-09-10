/**
 * MYC App Sidebar Component
 * 
 * Fixed sidebar navigation with Users and Studios menu items.
 * Follows MYC design system wireframe specifications.
 */

import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, BankOutlined, DashboardOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
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
  activeKey = 'dashboard', 
  onMenuSelect, 
  collapsed = false, 
  onCollapse 
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine active key from current route
  const getCurrentActiveKey = (): string => {
    const path = location.pathname;
    if (path.startsWith('/users')) return 'users';
    if (path.startsWith('/studios')) return 'studios';
    return 'dashboard';
  };
  
  // Menu items configuration with route mapping
  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      path: '/',
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Users',
      path: '/users',
    },
    {
      key: 'studios',
      icon: <BankOutlined />,
      label: 'Studios',
      path: '/studios',
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
    const menuItem = menuItems.find(item => item.key === key);
    if (menuItem) {
      navigate(menuItem.path);
    }
    
    // Also call the callback for any additional logic
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
        selectedKeys={[getCurrentActiveKey()]}
        items={menuItems.map(({ key, icon, label }) => ({ key, icon, label }))}
        onClick={handleMenuClick}
        style={menuStyle}
        theme="light"
      />
    </Sider>
  );
}

export default Sidebar;
