/**
 * Form Component Usage Examples
 * Demonstrates Form, LabeledInput, LabeledSelect, and FormActions
 */

import { useState } from 'react';
import { Divider, Card, Row, Col, message } from 'antd';
import { Form, LabeledInput, LabeledSelect, FormActions, useForm } from './Form';
import { Button } from './Button';
import { PageTitle, SectionTitle } from './Typography';

export function FormExamples() {
  const [basicForm] = useForm();
  const [userForm] = useForm();
  const [country, setCountry] = useState<string>('');

  const handleBasicSubmit = (values: any) => {
    console.log('Basic form values:', values);
    message.success('Form submitted successfully!');
  };

  const handleUserSubmit = (values: any) => {
    console.log('User form values:', values);
    message.success('User created successfully!');
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200 }}>
      <PageTitle>Form Component Examples</PageTitle>

      <Divider orientation="left">Basic Form with LabeledInput</Divider>
      <Card>
        <Form form={basicForm} onFinish={handleBasicSubmit}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <LabeledInput
                name="name"
                label="Full Name"
                required
                placeholder="Enter your full name"
              />
            </Col>
            <Col xs={24} md={12}>
              <LabeledInput
                name="email"
                label="Email Address"
                type="email"
                required
              />
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <LabeledInput
                name="phone"
                label="Phone Number"
                placeholder="+65 1234 5678"
              />
            </Col>
            <Col xs={24} md={12}>
              <LabeledInput
                name="password"
                label="Password"
                type="password"
                required
              />
            </Col>
          </Row>

          <LabeledInput
            name="notes"
            label="Additional Notes"
            type="textarea"
            placeholder="Optional notes..."
          />

          <FormActions>
            <Button variant="primary" htmlType="submit">Submit</Button>
            <Button htmlType="button" onClick={() => basicForm.resetFields()}>Reset</Button>
          </FormActions>
        </Form>
      </Card>

      <Divider orientation="left">User Creation Form with Selects</Divider>
      <Card>
        <Form form={userForm} onFinish={handleUserSubmit}>
          <SectionTitle>Basic Information</SectionTitle>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <LabeledInput
                name="firstName"
                label="First Name"
                required
              />
            </Col>
            <Col xs={24} md={8}>
              <LabeledInput
                name="lastName"
                label="Last Name"
                required
              />
            </Col>
            <Col xs={24} md={8}>
              <LabeledSelect
                name="role"
                label="Role"
                type="role"
                required
              />
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <LabeledInput
                name="email"
                label="Email"
                type="email"
                required
              />
            </Col>
            <Col xs={24} md={12}>
              <LabeledInput
                name="phone"
                label="Phone"
                placeholder="+65 1234 5678"
              />
            </Col>
          </Row>

          <SectionTitle>Location Information</SectionTitle>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <LabeledSelect
                name="country"
                label="Country"
                type="country"
                required
              />
            </Col>
            <Col xs={24} md={12}>
              <LabeledSelect
                name="province"
                label="Province/State"
                type="province"
                country={country}
                required={!!country}
              />
            </Col>
          </Row>

          <SectionTitle>Additional Information</SectionTitle>
          <LabeledSelect
            name="department"
            label="Department"
            type="basic"
            options={[
              { value: 'engineering', label: 'Engineering' },
              { value: 'marketing', label: 'Marketing' },
              { value: 'sales', label: 'Sales' },
              { value: 'hr', label: 'Human Resources' },
            ]}
          />

          <LabeledInput
            name="bio"
            label="Biography"
            type="textarea"
            placeholder="Tell us about yourself..."
          />

          <FormActions>
            <Button variant="primary" htmlType="submit">Create User</Button>
            <Button htmlType="button" onClick={() => userForm.resetFields()}>Clear Form</Button>
          </FormActions>
        </Form>
      </Card>

      <Divider orientation="left">Form Actions Alignment</Divider>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="Left Aligned (Default)">
            <Form>
              <LabeledInput name="example1" label="Sample Field" />
              <FormActions align="left">
                <Button variant="primary">Save</Button>
                <Button>Cancel</Button>
              </FormActions>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Center Aligned">
            <Form>
              <LabeledInput name="example2" label="Sample Field" />
              <FormActions align="center">
                <Button variant="primary">Save</Button>
                <Button>Cancel</Button>
              </FormActions>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Right Aligned">
            <Form>
              <LabeledInput name="example3" label="Sample Field" />
              <FormActions align="right">
                <Button variant="primary">Save</Button>
                <Button>Cancel</Button>
              </FormActions>
            </Form>
          </Card>
        </Col>
      </Row>

      <Divider orientation="left">Custom Validation Rules</Divider>
      <Card>
        <Form onFinish={() => message.success('Validation passed!')}>
          <LabeledInput
            name="username"
            label="Username"
            required
            rules={[
              { min: 3, message: 'Username must be at least 3 characters' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: 'Username can only contain letters, numbers, and underscores' }
            ]}
          />

          <LabeledInput
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            required
            dependencies={['password']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          />

          <FormActions>
            <Button variant="primary" htmlType="submit">Validate</Button>
          </FormActions>
        </Form>
      </Card>

      <Divider orientation="left">Design System Notes</Divider>
      <Card title="MYC Form Specifications">
        <div style={{ fontSize: 14 }}>
          <div style={{ marginBottom: 16 }}>
            <strong>Form Defaults:</strong>
            <ul style={{ marginTop: 8 }}>
              <li><code>layout="vertical"</code> - Labels above inputs for better mobile experience</li>
              <li>Automatic required field validation messages</li>
              <li>Email validation for email type inputs</li>
            </ul>
          </div>

          <div style={{ marginBottom: 16 }}>
            <strong>LabeledInput Features:</strong>
            <ul style={{ marginTop: 8 }}>
              <li>Automatic placeholder generation based on label</li>
              <li>Built-in required validation</li>
              <li>Support for text, password, email, textarea types</li>
              <li>Integrates with MYC Input components</li>
            </ul>
          </div>

          <div style={{ marginBottom: 16 }}>
            <strong>LabeledSelect Features:</strong>
            <ul style={{ marginTop: 8 }}>
              <li>Support for basic, role, country, province types</li>
              <li>Automatic cascading for country/province selects</li>
              <li>Integrates with MYC Select components</li>
            </ul>
          </div>

          <div>
            <strong>FormActions:</strong>
            <ul style={{ marginTop: 8 }}>
              <li>Consistent spacing and alignment</li>
              <li>Support for left, center, right alignment</li>
              <li>Standard gap between action buttons</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default FormExamples;
