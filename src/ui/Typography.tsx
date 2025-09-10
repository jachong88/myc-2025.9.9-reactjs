/**
 * MYC Typography Components
 *
 * Standardized typography wrappers following MYC design system.
 * Provides PageTitle, SectionTitle, BodyText, and MutedText using Ant Design Typography.
 */

import { Typography as AntTypography } from 'antd';
import type { ComponentProps } from 'react';

type TitleProps = ComponentProps<typeof AntTypography.Title>;
type TextProps = ComponentProps<typeof AntTypography.Text>;

const { Title: AntTitle, Text: AntText, Paragraph: AntParagraph } = AntTypography;

/**
 * Page Title - Main page headers (Dashboard, Users, etc.)
 * Uses Typography.Title level={2}
 */
export function PageTitle(props: TitleProps) {
  return <AntTitle level={2} {...props} />;
}

/**
 * Section Title - Subsections (Profile Settings, Filters, etc.)
 * Uses Typography.Title level={4}
 */
export function SectionTitle(props: TitleProps) {
  return <AntTitle level={4} {...props} />;
}

/**
 * Body Text - General text content
 */
export function BodyText(props: TextProps) {
  return <AntText {...props} />;
}

/**
 * Muted Text - Helper/secondary text
 * Uses Ant Design secondary type for muted color (#8c8c8c)
 */
export function MutedText(props: TextProps) {
  return <AntText type="secondary" {...props} />;
}

/**
 * Optional paragraph export if needed for longer text blocks
 */
export const Paragraph = AntParagraph;

