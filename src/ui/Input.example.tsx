/**
 * Input Component Usage Examples
 * Demonstrates Input, InputPassword, InputEmail, and InputTextArea
 */

import { Space, Divider } from 'antd';
import { Input, InputPassword, InputEmail, InputTextArea } from './Input';

export function InputExamples() {
  return (
    <div style={{ padding: 24, maxWidth: 640 }}>
      <Divider orientation="left">Text Input (allowClear by default)</Divider>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input placeholder="Enter name" />
        <Input placeholder="Phone number" />
        <Input placeholder="Disabled input" disabled />
      </Space>

      <Divider orientation="left">Email Input</Divider>
      <Space direction="vertical" style={{ width: '100%' }}>
        <InputEmail placeholder="Enter email address" />
      </Space>

      <Divider orientation="left">Password Input</Divider>
      <Space direction="vertical" style={{ width: '100%' }}>
        <InputPassword placeholder="Enter password" />
      </Space>

      <Divider orientation="left">TextArea (max 500 chars, showCount)</Divider>
      <Space direction="vertical" style={{ width: '100%' }}>
        <InputTextArea placeholder="Add notes (optional)" />
        <InputTextArea placeholder="Custom rows" rows={5} />
      </Space>
    </div>
  );
}

export default InputExamples;

