/**
 * Typography Component Examples
 * Shows all Typography variants with MYC design system patterns
 */

import { Space, Divider, Card } from 'antd';
import { PageTitle, SectionTitle, BodyText, MutedText, Paragraph } from './Typography';

export function TypographyExamples() {
  return (
    <div style={{ padding: 24, maxWidth: 800 }}>
      <PageTitle>Typography Component Examples</PageTitle>
      
      <Divider orientation="left">Page Titles (Level 2)</Divider>
      <Space direction="vertical" size="large">
        <PageTitle>Dashboard</PageTitle>
        <PageTitle>User Management</PageTitle>
        <PageTitle>Settings</PageTitle>
      </Space>
      
      <Divider orientation="left">Section Titles (Level 4)</Divider>
      <Space direction="vertical">
        <SectionTitle>Profile Settings</SectionTitle>
        <SectionTitle>Filter Options</SectionTitle>
        <SectionTitle>Account Details</SectionTitle>
      </Space>
      
      <Divider orientation="left">Body Text & Muted Text</Divider>
      <Space direction="vertical" size="middle">
        <BodyText>This is standard body text for general content and descriptions.</BodyText>
        <MutedText>This is muted text for helper information, notes, and secondary details.</MutedText>
        <div>
          <BodyText>Regular text with </BodyText>
          <MutedText>inline muted text</MutedText>
          <BodyText> for emphasis.</BodyText>
        </div>
      </Space>
      
      <Divider orientation="left">Typography in Context</Divider>
      <Card>
        <SectionTitle>User Profile</SectionTitle>
        <Space direction="vertical">
          <div>
            <BodyText strong>Name:</BodyText> <BodyText>John Doe</BodyText>
          </div>
          <div>
            <BodyText strong>Email:</BodyText> <BodyText>john.doe@example.com</BodyText>
          </div>
          <div>
            <BodyText strong>Role:</BodyText> <BodyText>Administrator</BodyText>
          </div>
        </Space>
        <div style={{ marginTop: 16 }}>
          <MutedText>Last updated: 2025-09-10</MutedText>
        </div>
      </Card>
      
      <Divider orientation="left">Design System Rules</Divider>
      <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
        <SectionTitle>Typography Guidelines</SectionTitle>
        <Space direction="vertical">
          <div>
            <BodyText strong>Page Titles:</BodyText>
            <MutedText> Use for main page headers (Dashboard, Users, etc.)</MutedText>
          </div>
          <div>
            <BodyText strong>Section Titles:</BodyText>
            <MutedText> Use for subsections within pages</MutedText>
          </div>
          <div>
            <BodyText strong>Body Text:</BodyText>
            <MutedText> Use for general content and descriptions</MutedText>
          </div>
          <div>
            <BodyText strong>Muted Text:</BodyText>
            <MutedText> Use for helper text, notes, and secondary information</MutedText>
          </div>
        </Space>
      </div>
      
      <Divider orientation="left">Text Styling Options</Divider>
      <Space direction="vertical">
        <BodyText>Normal body text</BodyText>
        <BodyText strong>Strong/bold text</BodyText>
        <BodyText italic>Italic text</BodyText>
        <BodyText underline>Underlined text</BodyText>
        <BodyText delete>Deleted text</BodyText>
        <BodyText code>Inline code text</BodyText>
      </Space>
      
      <Divider orientation="left">Paragraph Example</Divider>
      <Paragraph>
        This is a paragraph component for longer text blocks. It provides proper spacing 
        and can contain multiple sentences with appropriate line height and margins. 
        The paragraph component inherits from Ant Design's Typography.Paragraph 
        and follows the MYC design system typography specifications.
      </Paragraph>
      
      <MutedText>
        All typography components follow the Inter font family and 14px base font size 
        as specified in the MYC design tokens.
      </MutedText>
    </div>
  );
}

export default TypographyExamples;
