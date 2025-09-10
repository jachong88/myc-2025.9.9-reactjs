/**
 * MYC Dashboard Page
 * 
 * Main landing page with welcome content and navigation cards
 * to different sections of the application.
 */

import { Row, Col } from 'antd';
import { UserOutlined, BankOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Page } from '../../../shared/components/Page';
import { Card } from '../../../ui/Card';
import { PageTitle, BodyText } from '../../../ui/Typography';
import { Button } from '../../../ui/Button';

export function DashboardPage() {
  const navigate = useNavigate();

  const handleNavigateToUsers = () => {
    navigate('/users');
  };

  const handleNavigateToStudios = () => {
    navigate('/studios');
  };

  return (
    <Page title="Dashboard">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <PageTitle>Welcome to MYC Studio Management System</PageTitle>
        <BodyText style={{ fontSize: '16px', marginTop: '1rem' }}>
          Manage your music studios and users from this central dashboard.
          Click on the cards below to navigate to different sections.
        </BodyText>
      </div>

      <Row gutter={[24, 24]} justify="center">
        <Col xs={24} sm={12} lg={8}>
          <Card 
            title="Users Management" 
            style={{ height: '200px', cursor: 'pointer' }}
            onClick={handleNavigateToUsers}
            hoverable
          >
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <UserOutlined style={{ fontSize: '48px', color: '#1677ff', marginBottom: '1rem' }} />
              <BodyText>
                Manage system users, roles, and permissions. 
                Create, edit, and organize user accounts.
              </BodyText>
              <div style={{ marginTop: '1rem' }}>
                <Button variant="primary" onClick={handleNavigateToUsers}>
                  Manage Users
                </Button>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card 
            title="Studios Management" 
            style={{ height: '200px', cursor: 'pointer' }}
            onClick={handleNavigateToStudios}
            hoverable
          >
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <BankOutlined style={{ fontSize: '48px', color: '#1677ff', marginBottom: '1rem' }} />
              <BodyText>
                Manage music studios, schedules, and resources.
                Configure studio settings and availability.
              </BodyText>
              <div style={{ marginTop: '1rem' }}>
                <Button variant="primary" onClick={handleNavigateToStudios}>
                  Manage Studios
                </Button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <BodyText type="secondary">
          This is the central hub for managing your MYC Studio system. 
          Use the sidebar navigation or the cards above to access different sections.
        </BodyText>
      </div>
    </Page>
  );
}

export default DashboardPage;
