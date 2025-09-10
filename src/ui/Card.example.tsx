/**
 * Card Component Usage Examples
 * Demonstrates Card with MYC design system defaults
 */

import { Space, Divider, Row, Col, Button, Avatar, Statistic } from 'antd';
import { Card } from './Card';
import { PageTitle, SectionTitle, BodyText, MutedText } from './Typography';
import { ActiveTag, InactiveTag } from './Tag';

export function CardExamples() {
  return (
    <div style={{ padding: 24, maxWidth: 1200 }}>
      <PageTitle>Card Component Examples</PageTitle>
      
      <Divider orientation="left">Basic Cards</Divider>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card title="Default Card">
            <BodyText>This is a basic card with default MYC settings:</BodyText>
            <ul>
              <li>bordered: true</li>
              <li>hoverable: true</li>
              <li>Design token padding</li>
            </ul>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={8}>
          <Card title="Card with Extra" extra={<Button type="link">More</Button>}>
            <BodyText>Card with extra action in header.</BodyText>
            <MutedText>The extra prop allows adding actions or metadata.</MutedText>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={8}>
          <Card title="Non-hoverable" hoverable={false}>
            <BodyText>This card has hoverable disabled.</BodyText>
          </Card>
        </Col>
      </Row>

      <Divider orientation="left">User Profile Cards</Divider>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar size={48} style={{ backgroundColor: '#1677ff' }}>JD</Avatar>
                <div>
                  <SectionTitle style={{ margin: 0 }}>John Doe</SectionTitle>
                  <MutedText>Administrator</MutedText>
                </div>
              </div>
              <div>
                <ActiveTag />
              </div>
              <BodyText>Last login: 2025-09-10</BodyText>
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar size={48} style={{ backgroundColor: '#52c41a' }}>JS</Avatar>
                <div>
                  <SectionTitle style={{ margin: 0 }}>Jane Smith</SectionTitle>
                  <MutedText>Teacher</MutedText>
                </div>
              </div>
              <div>
                <InactiveTag />
              </div>
              <BodyText>Last login: 2025-08-15</BodyText>
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar size={48} style={{ backgroundColor: '#faad14' }}>BW</Avatar>
                <div>
                  <SectionTitle style={{ margin: 0 }}>Bob Wilson</SectionTitle>
                  <MutedText>Student</MutedText>
                </div>
              </div>
              <div>
                <ActiveTag>Online</ActiveTag>
              </div>
              <BodyText>Last login: Today</BodyText>
            </Space>
          </Card>
        </Col>
      </Row>

      <Divider orientation="left">Statistics Cards</Divider>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={1128}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Users"
              value={892}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Users"
              value={67}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Inactive Users"
              value={169}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Divider orientation="left">Cards with Actions</Divider>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title="Settings"
            actions={[
              <Button key="edit" type="link">Edit</Button>,
              <Button key="delete" type="link" danger>Delete</Button>
            ]}
          >
            <BodyText>
              This card includes action buttons in the footer area.
              Actions are commonly used for edit, delete, or view operations.
            </BodyText>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card
            title="Course Information"
            extra={<Button size="small">View Details</Button>}
            actions={[
              <Button key="enroll" type="primary">Enroll</Button>,
              <Button key="info" type="default">More Info</Button>
            ]}
          >
            <Space direction="vertical">
              <BodyText><strong>Course:</strong> React Development</BodyText>
              <BodyText><strong>Duration:</strong> 8 weeks</BodyText>
              <BodyText><strong>Students:</strong> 24</BodyText>
            </Space>
          </Card>
        </Col>
      </Row>

      <Divider orientation="left">Custom Padding</Divider>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Card title="Default Padding">
            <BodyText>This card uses the default token-based padding.</BodyText>
          </Card>
        </Col>
        
        <Col xs={24} sm={12}>
          <Card title="Custom Padding" padding={8}>
            <BodyText>This card uses custom padding (8px).</BodyText>
          </Card>
        </Col>
      </Row>

      <Divider orientation="left">Design System Notes</Divider>
      <Card title="MYC Card Specifications">
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <BodyText strong>Default Properties:</BodyText>
            <ul style={{ marginTop: 8 }}>
              <li><code>bordered: true</code> - Provides clear visual boundaries</li>
              <li><code>hoverable: true</code> - Interactive feedback on hover</li>
              <li><code>padding: token.padding</code> - Uses design system spacing (16px)</li>
            </ul>
          </div>
          
          <div>
            <BodyText strong>When to Use:</BodyText>
            <ul style={{ marginTop: 8 }}>
              <li>User profile displays</li>
              <li>Dashboard statistics</li>
              <li>Content grouping</li>
              <li>Form sections</li>
              <li>Feature highlights</li>
            </ul>
          </div>
          
          <div>
            <BodyText strong>Accessibility:</BodyText>
            <ul style={{ marginTop: 8 }}>
              <li>Cards automatically provide proper focus handling</li>
              <li>Hover states improve interactive feedback</li>
              <li>Use semantic titles for screen readers</li>
            </ul>
          </div>
        </Space>
      </Card>
    </div>
  );
}

export default CardExamples;
