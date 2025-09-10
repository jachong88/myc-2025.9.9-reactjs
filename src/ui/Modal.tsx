/**
 * MYC Modal Component
 *
 * Thin wrapper around Ant Design Modal with MYC defaults:
 * - centered: true
 * - maskClosable: false (prevent accidental close)
 * - destroyOnClose: true (keeps forms clean)
 *
 * Also provides ConfirmModal utility for quick confirm flows.
 */

import { Modal as AntModal } from 'antd';
import type { ModalProps as AntModalProps } from 'antd';
import React from 'react';

export interface ModalProps extends AntModalProps {}

export function Modal({
  centered = true,
  maskClosable = false,
  destroyOnClose = true,
  ...props
}: ModalProps) {
  return (
    <AntModal
      centered={centered}
      maskClosable={maskClosable}
      destroyOnClose={destroyOnClose}
      {...props}
    />
  );
}

/**
 * ConfirmModal
 * Simplified confirm dialog with consistent defaults
 */
export function ConfirmModal({
  open,
  title = 'Are you sure?',
  okText = 'Confirm',
  cancelText = 'Cancel',
  okButtonProps,
  onOk,
  onCancel,
  children,
  ...props
}: {
  open: boolean;
  title?: React.ReactNode;
  okText?: React.ReactNode;
  cancelText?: React.ReactNode;
  okButtonProps?: AntModalProps['okButtonProps'];
  onOk: () => Promise<void> | void;
  onCancel: () => void;
  children?: React.ReactNode;
} & Omit<ModalProps, 'open' | 'onOk' | 'onCancel' | 'title' | 'okText' | 'cancelText'>) {
  return (
    <Modal
      open={open}
      title={title}
      onOk={onOk}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
      okButtonProps={okButtonProps}
      {...props}
    >
      {children}
    </Modal>
  );
}

export default Modal;
