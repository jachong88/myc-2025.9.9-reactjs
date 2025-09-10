/**
 * MYC App Header Component
 * 
 * Global header with app name on left and user profile/logout area on right.
 * Follows MYC design system wireframe specifications.
 */

import React from 'react';
import { Layout, Avatar, Button, Space } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { SectionTitle } from '../../ui/Typography';
import { designTokens } from '../../ui/theme';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  /** Optional user name for profile display */
  userName?: string;
  /** Callback for logout action */
  onLogout?: () => void;
}

/**
 * MYC App Header
 * 
 * Displays the app name on the left and user profile area on the right.
 * Uses MYC design tokens for consistent spacing and colors.
 */
export function Header({ userName = "User", onLogout }: HeaderProps) {
  const navigate = useNavigate();
  
  // Get initials for avatar (first letter of first and last name)
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  const handleTitleClick = () => {
    navigate('/');
  };

  const headerStyle: React.CSSProperties = {
    background: '#fff',
    borderBottom: '1px solid #f0f0f0',
    padding: `0 ${designTokens.spacing.lg}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px', // Standard Ant Design header height
  };

  const appNameStyle: React.CSSProperties = {
    margin: 0,
    color: designTokens.colors.textPrimary,
    cursor: 'pointer',
    transition: 'color 0.2s ease',
  };

  const profileAreaStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: `${designTokens.spacing.sm}px`,
  };

  return (
    <AntHeader style={headerStyle}>
      {/* App Name - Left Side */}
      <SectionTitle 
        style={appNameStyle}
        onClick={handleTitleClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = designTokens.colors.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = designTokens.colors.textPrimary;
        }}
      >
        MYC Studio Management System
      </SectionTitle>

      {/* Profile Area - Right Side */}
      <div style={profileAreaStyle}>
        <Space size={designTokens.spacing.sm}>
          {/* User Avatar with Initials */}
          <Avatar 
            style={{ 
              backgroundColor: designTokens.colors.primary,
              color: '#fff'
            }}
            icon={<UserOutlined />}
          >
            {getInitials(userName)}
          </Avatar>
          
          {/* User Name Display */}
          <span style={{ color: designTokens.colors.textPrimary }}>
            {userName}
          </span>
          
          {/* Logout Button */}
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={onLogout}
            style={{ color: designTokens.colors.textSecondary }}
          >
            Logout
          </Button>
        </Space>
      </div>
    </AntHeader>
  );
}

export default Header;
