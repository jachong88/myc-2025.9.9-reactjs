import { Button, Typography, Space, Alert } from 'antd';
import { ReloadOutlined, HomeOutlined, ArrowLeftOutlined, BugOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ErrorRecoveryAction } from '../types/errors';

const { Title, Paragraph, Text } = Typography;

interface ErrorFallbackProps {
  error: Error;
  errorInfo?: { componentStack: string };
  onRetry?: () => void;
  level?: 'app' | 'route' | 'feature';
  title?: string;
  message?: string;
  showErrorDetails?: boolean;
}

export function ErrorFallback({
  error,
  errorInfo,
  onRetry,
  level = 'app',
  title,
  message,
  showErrorDetails = false
}: ErrorFallbackProps) {
  const navigate = useNavigate();

  const handleRecoveryAction = (action: ErrorRecoveryAction) => {
    switch (action) {
      case 'retry':
        if (onRetry) {
          onRetry();
        } else {
          window.location.reload();
        }
        break;
      case 'reload':
        window.location.reload();
        break;
      case 'goHome':
        navigate('/');
        break;
      case 'goBack':
        navigate(-1);
        break;
    }
  };

  const getErrorTitle = () => {
    if (title) return title;
    
    switch (level) {
      case 'app':
        return 'Application Error';
      case 'route':
        return 'Page Error';
      case 'feature':
        return 'Feature Error';
      default:
        return 'Something went wrong';
    }
  };

  const getErrorMessage = () => {
    if (message) return message;
    
    switch (level) {
      case 'app':
        return 'The application encountered an unexpected error. Please try refreshing the page.';
      case 'route':
        return 'This page encountered an error. Please try navigating to another page or refresh.';
      case 'feature':
        return 'This feature encountered an error. Please try again or use a different feature.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  const getRecoveryActions = () => {
    const actions = [];
    
    if (onRetry) {
      actions.push(
        <Button 
          key="retry"
          type="primary" 
          icon={<ReloadOutlined />}
          onClick={() => handleRecoveryAction('retry')}
        >
          Try Again
        </Button>
      );
    }

    if (level !== 'app') {
      actions.push(
        <Button 
          key="home"
          icon={<HomeOutlined />}
          onClick={() => handleRecoveryAction('goHome')}
        >
          Go Home
        </Button>
      );
    }

    if (level === 'route' || level === 'feature') {
      actions.push(
        <Button 
          key="back"
          icon={<ArrowLeftOutlined />}
          onClick={() => handleRecoveryAction('goBack')}
        >
          Go Back
        </Button>
      );
    }

    actions.push(
      <Button 
        key="reload"
        icon={<ReloadOutlined />}
        onClick={() => handleRecoveryAction('reload')}
      >
        Refresh Page
      </Button>
    );

    return actions;
  };

  return (
    <div 
      style={{ 
        padding: '48px 24px',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto',
        minHeight: level === 'app' ? '100vh' : '300px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <BugOutlined 
        style={{ 
          fontSize: '64px', 
          color: '#ff4d4f',
          marginBottom: '24px'
        }} 
      />
      
      <Title level={2} style={{ marginBottom: '16px' }}>
        {getErrorTitle()}
      </Title>
      
      <Paragraph style={{ marginBottom: '32px', fontSize: '16px' }}>
        {getErrorMessage()}
      </Paragraph>

      <Space wrap style={{ marginBottom: '32px', justifyContent: 'center' }}>
        {getRecoveryActions()}
      </Space>

      {showErrorDetails && (
        <Alert
          message="Error Details"
          description={
            <div style={{ textAlign: 'left' }}>
              <Text strong>Error:</Text> {error.message}
              <br />
              <Text strong>Stack:</Text>
              <pre style={{ fontSize: '12px', marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                {error.stack}
              </pre>
              {errorInfo && (
                <>
                  <Text strong>Component Stack:</Text>
                  <pre style={{ fontSize: '12px', marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                    {errorInfo.componentStack}
                  </pre>
                </>
              )}
            </div>
          }
          type="error"
          showIcon
          style={{ textAlign: 'left' }}
        />
      )}
      
      {process.env.NODE_ENV === 'development' && !showErrorDetails && (
        <Text type="secondary" style={{ marginTop: '16px' }}>
          Error ID: {Date.now().toString(36)}
        </Text>
      )}
    </div>
  );
}
