/**
 * @vitest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MYCThemeProvider } from './ThemeProvider';
import { Button } from './Button';

// Wrapper component for theme context
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <MYCThemeProvider>{children}</MYCThemeProvider>;
}

describe('Button Component', () => {
  it('should render with default variant', () => {
    render(
      <TestWrapper>
        <Button>Default Button</Button>
      </TestWrapper>
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Default Button');
  });

  it('should render primary variant correctly', () => {
    render(
      <TestWrapper>
        <Button variant="primary">Primary Button</Button>
      </TestWrapper>
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('ant-btn-primary');
  });

  it('should render danger variant correctly', () => {
    render(
      <TestWrapper>
        <Button variant="danger">Delete</Button>
      </TestWrapper>
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('ant-btn-primary', 'ant-btn-dangerous');
  });

  it('should render link variant correctly', () => {
    render(
      <TestWrapper>
        <Button variant="link">View Details</Button>
      </TestWrapper>
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('ant-btn-link');
  });

  it('should support all standard button props', () => {
    render(
      <TestWrapper>
        <Button variant="primary" disabled size="large">
          Disabled Button
        </Button>
      </TestWrapper>
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('ant-btn-lg');
  });
});
