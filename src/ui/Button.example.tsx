/**
 * Button Component Usage Examples
 * Demonstrates all Button variants following MYC design system rules
 */

import { Space, Divider } from 'antd';
import { Button } from './Button';

export function ButtonExamples() {
  return (
    <div style={{ padding: 24 }}>
      <h2>MYC Button Component Examples</h2>
      
      <Divider orientation="left">Primary Button (Only one per page)</Divider>
      <Space>
        <Button variant="primary">Save Changes</Button>
        <Button variant="primary" loading>Saving...</Button>
        <Button variant="primary" disabled>Save (Disabled)</Button>
      </Space>
      
      <Divider orientation="left">Default Buttons (Secondary actions)</Divider>
      <Space>
        <Button variant="default">Cancel</Button>
        <Button variant="default">Reset Form</Button>
        <Button variant="default">Edit Profile</Button>
        <Button variant="default" size="small">Small Action</Button>
        <Button variant="default" size="large">Large Action</Button>
      </Space>
      
      <Divider orientation="left">Danger Buttons (Destructive actions - use with confirmation)</Divider>
      <Space>
        <Button variant="danger">Delete User</Button>
        <Button variant="danger">Remove Item</Button>
        <Button variant="danger" disabled>Delete (Disabled)</Button>
      </Space>
      
      <Divider orientation="left">Link Buttons (Inline actions)</Divider>
      <Space>
        <Button variant="link">View Details</Button>
        <Button variant="link">Forgot Password?</Button>
        <Button variant="link">Learn More</Button>
      </Space>
      
      <Divider orientation="left">Button States</Divider>
      <Space>
        <Button variant="default" loading>Loading...</Button>
        <Button variant="default" disabled>Disabled</Button>
        <Button variant="primary" size="large">Large Primary</Button>
        <Button variant="default" size="small">Small Default</Button>
      </Space>
      
      <Divider orientation="left">Design System Rules</Divider>
      <div style={{ maxWidth: 600 }}>
        <h4>Important Rules:</h4>
        <ul>
          <li><strong>Primary:</strong> Only ONE primary button per page/form</li>
          <li><strong>Danger:</strong> Always use with confirmation dialogs</li>
          <li><strong>Default:</strong> For secondary actions like Cancel, Reset, Edit</li>
          <li><strong>Link:</strong> For inline/low-emphasis actions</li>
        </ul>
      </div>
    </div>
  );
}

export default ButtonExamples;
