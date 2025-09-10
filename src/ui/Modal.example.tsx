/**
 * Modal Component Usage Examples
 * Demonstrates MYC Modal defaults and ConfirmModal utility
 */

import { useState } from 'react';
import { Button, Space, Divider, Form, Input } from 'antd';
import { Modal, ConfirmModal } from './Modal';

export function ModalExamples() {
  const [basicOpen, setBasicOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div style={{ padding: 24 }}>
      <Divider orientation="left">Basic Modal (MYC Defaults)</Divider>
      <Space>
        <Button type="primary" onClick={() => setBasicOpen(true)}>Open Modal</Button>
      </Space>
      <Modal
        open={basicOpen}
        title="Basic Modal"
        onCancel={() => setBasicOpen(false)}
        onOk={() => setBasicOpen(false)}
      >
        This modal is centered, not closable by mask-click, and destroys its content on close.
      </Modal>

      <Divider orientation="left">Confirm Modal</Divider>
      <Space>
        <Button danger onClick={() => setConfirmOpen(true)}>Delete User</Button>
      </Space>
      <ConfirmModal
        open={confirmOpen}
        title="Delete User?"
        okText="Delete"
        okButtonProps={{ danger: true }}
        onCancel={() => setConfirmOpen(false)}
        onOk={async () => {
          // perform delete
          setConfirmOpen(false);
        }}
      >
        Are you sure you want to delete this user? This action cannot be undone.
      </ConfirmModal>

      <Divider orientation="left">Form in Modal</Divider>
      <Space>
        <Button onClick={() => setFormOpen(true)}>Open Form</Button>
      </Space>
      <Modal
        open={formOpen}
        title="Create Item"
        onCancel={() => setFormOpen(false)}
        onOk={() => setFormOpen(false)}
      >
        <Form layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="Enter name" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} placeholder="Optional" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ModalExamples;
