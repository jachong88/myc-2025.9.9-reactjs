# MYC UI Components Library

A collection of reusable UI components built on top of Ant Design, following the MYC design system specifications.

## Overview

This library provides standardized, theme-consistent components that wrap Ant Design components with MYC-specific defaults and styling. All components follow the established design tokens and maintain consistency across the application.

## Design System Integration

### Color Tokens
- **Primary**: `#1677ff` - Main brand color for primary actions
- **Danger**: `#ff4d4f` - For destructive actions (delete, disable)
- **Success**: `#52c41a` - For success states and active status
- **Warning**: `#faad14` - For warning states and pending status
- **Text Primary**: `#000000` - Primary text color
- **Text Secondary**: `#8c8c8c` - Muted/helper text color

### Spacing Tokens
- **XS**: `4px` - Tight spacing (icon + text)
- **SM**: `8px` - Small gaps (form field spacing)
- **MD**: `16px` - Standard padding (cards, content)
- **LG**: `24px` - Section spacing (between cards)
- **XL**: `32px` - Page-level spacing

### Typography
- **Font Family**: Inter, sans-serif
- **Base Font Size**: 14px
- **Page Titles**: Typography.Title level={2}
- **Section Titles**: Typography.Title level={4}

## Usage

### Installation & Setup

1. **Import components from the barrel export:**
```tsx
import { Button, Input, Table } from '@/ui';
```

2. **Configure theme in your App component:**
```tsx
import { ConfigProvider } from 'antd';
import { antdThemeConfig, injectCSSVariables } from '@/ui';

function App() {
  // Inject CSS variables for design tokens
  injectCSSVariables();
  
  return (
    <ConfigProvider theme={antdThemeConfig}>
      {/* Your app content */}
    </ConfigProvider>
  );
}
```

### Design Token Usage

#### In React Components
```tsx
import { theme } from 'antd';
import { designTokens } from '@/ui';

function MyComponent() {
  const { token } = theme.useToken();
  
  const customStyles = {
    padding: token.padding,        // Uses design token
    color: token.colorPrimary,     // MYC primary color
    borderRadius: token.borderRadius, // MYC border radius
  };
  
  return <div style={customStyles}>Content</div>;
}
```

#### In CSS Files
```css
.custom-component {
  padding: var(--myc-space-md);
  color: var(--myc-color-primary);
  border-radius: var(--myc-border-radius);
  font-family: var(--myc-font-family);
}
```

## Component Guidelines

### Button Rules
- **Primary**: Only one per page/form - for main CTAs
- **Default**: Secondary actions (Cancel, Reset, Edit)
- **Danger**: Destructive actions - must include confirmation
- **Link**: Inline actions (View Details, navigation)

### Form Rules
- **Required Fields**: Show `*` indicator when `required={true}`
- **Validation**: Use inline validation with proper error states
- **Layout**: Vertical layout by default

### Table Rules
- **Pagination**: Default 10 items with total count display
- **Actions**: Edit (Default button), Delete (Danger button with confirmation)
- **Status**: Use Tag components with proper colors
- **Names**: Clickable for navigation to details

## TypeScript Support

All components include comprehensive TypeScript interfaces:

```tsx
import type { ButtonVariant, StatusVariant } from '@/ui';

interface MyComponentProps {
  variant: ButtonVariant;
  status: StatusVariant;
}
```

## Accessibility

All components follow WCAG 2.1 AA standards:
- Proper ARIA labels and descriptions
- Keyboard navigation support
- Sufficient color contrast ratios
- Screen reader compatibility

## Testing

Components include comprehensive test coverage:
- Unit tests for component rendering
- Design system compliance tests
- Accessibility requirement tests
- TypeScript integration tests

## Development Standards

### Component Structure
```tsx
import { ComponentProps } from 'antd';
import { BaseComponentProps } from './types';

interface MyComponentProps extends ComponentProps<AntComponent>, BaseComponentProps {
  variant?: 'primary' | 'secondary';
}

/**
 * Component description following design system
 * @param variant - Component variant
 */
export function MyComponent({ 
  variant = 'primary',
  children,
  ...props 
}: MyComponentProps) {
  return <AntComponent {...props}>{children}</AntComponent>;
}
```

### Documentation Requirements
- JSDoc comments for all components
- Usage examples in comments
- Design system rule documentation
- Accessibility notes

## Contributing

When adding new components:

1. Follow the established patterns and interfaces
2. Use design tokens consistently
3. Include comprehensive TypeScript types
4. Add component to barrel export
5. Update this README with usage examples
6. Write tests covering all variants and accessibility

## Available Components

### ✅ Implemented Components

- [x] **Button** - Primary, Default, Danger, Link variants
  - Follows MYC design system color specifications
  - Supports all Ant Design Button props
  - Enforces "one primary per page" rule through documentation
  - TypeScript interfaces with proper variant types

- [x] **Typography** - PageTitle, SectionTitle, BodyText, MutedText
  - Consistent typography levels (h2 for pages, h4 for sections)
  - Proper text hierarchy and muted text styling
  - Inter font family and design token integration
  - All Ant Design Typography props supported

### 🚧 Pending Components
- [ ] Input - Text, Password, Email, TextArea with validation
- [ ] Select - Dropdown with cascading support
- [ ] Tag - Status indicators (Active, Inactive, Pending)
- [ ] Card - Bordered, hoverable containers
- [ ] Modal - Safe defaults, confirmation dialogs  
- [ ] Form - Vertical layout, validation helpers
- [ ] Table - Pagination, actions, status integration
