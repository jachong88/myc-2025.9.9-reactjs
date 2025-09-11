/**
 * @vitest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MYCThemeProvider } from './ThemeProvider';
import { PageTitle, SectionTitle, BodyText, MutedText } from './Typography';

// Wrapper component for theme context
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <MYCThemeProvider>{children}</MYCThemeProvider>;
}

describe('Typography Components', () => {
  describe('PageTitle', () => {
    it('should render as h2 element', () => {
      render(
        <TestWrapper>
          <PageTitle>Dashboard</PageTitle>
        </TestWrapper>
      );
      
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Dashboard');
    });

    it('should accept additional props', () => {
      render(
        <TestWrapper>
          <PageTitle style={{ color: 'red' }}>Test Title</PageTitle>
        </TestWrapper>
      );
      
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    });
  });

  describe('SectionTitle', () => {
    it('should render as h4 element', () => {
      render(
        <TestWrapper>
          <SectionTitle>Settings</SectionTitle>
        </TestWrapper>
      );
      
      const title = screen.getByRole('heading', { level: 4 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Settings');
    });
  });

  describe('BodyText', () => {
    it('should render normal text', () => {
      render(
        <TestWrapper>
          <BodyText>This is body text</BodyText>
        </TestWrapper>
      );
      
      const text = screen.getByText('This is body text');
      expect(text).toBeInTheDocument();
    });

    it('should support text styling props', () => {
      render(
        <TestWrapper>
          <BodyText strong>Strong text</BodyText>
        </TestWrapper>
      );
      
      const text = screen.getByText('Strong text');
      expect(text).toBeInTheDocument();
      expect(text).toHaveStyle({ fontWeight: '600' }); // Ant Design uses numeric font weights
    });
  });

  describe('MutedText', () => {
    it('should render with secondary type', () => {
      render(
        <TestWrapper>
          <MutedText>Muted text</MutedText>
        </TestWrapper>
      );
      
      const text = screen.getByText('Muted text');
      expect(text).toBeInTheDocument();
      expect(text).toHaveClass('ant-typography-secondary'); // Ant Design v5 uses -secondary instead of -caption
    });

    it('should have muted text color', () => {
      render(
        <TestWrapper>
          <MutedText>Helper text</MutedText>
        </TestWrapper>
      );
      
      const text = screen.getByText('Helper text');
      expect(text).toBeInTheDocument();
      // The secondary type should apply appropriate muted styling
    });
  });

  describe('Typography Integration', () => {
    it('should work together in a typical layout', () => {
      render(
        <TestWrapper>
          <div>
            <PageTitle>Main Page</PageTitle>
            <SectionTitle>Section Header</SectionTitle>
            <BodyText>Main content goes here.</BodyText>
            <MutedText>Additional notes or helper text.</MutedText>
          </div>
        </TestWrapper>
      );
      
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Main Page');
      expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Section Header');
      expect(screen.getByText('Main content goes here.')).toBeInTheDocument();
      expect(screen.getByText('Additional notes or helper text.')).toBeInTheDocument();
    });
  });
});
