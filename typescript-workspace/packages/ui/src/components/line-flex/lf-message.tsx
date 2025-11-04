import * as React from 'react';

import { cn } from '@workspace/ui/lib/utils';

import { LfBubble } from './lf-bubble';
import { LfCarousel } from './lf-carousel';
import type { FlexMessage, FlexAction } from './utils/lf-types';

export interface LfMessageProps extends FlexMessage {
  className?: string;
  onAction?: (action: FlexAction) => void;
}

/**
 * LfMessage - Root wrapper component for LINE Flex Messages
 *
 * This component validates and renders LINE Flex Message JSON objects.
 * It accepts a message with type 'flex' and renders either a bubble or carousel
 * based on the contents.
 *
 * @throws {Error} If the message type is not 'flex'
 *
 * @example
 * ```tsx
 * const message = {
 *   type: 'flex',
 *   altText: 'This is a flex message',
 *   contents: {
 *     type: 'bubble',
 *     body: {
 *       type: 'box',
 *       layout: 'vertical',
 *       contents: [
 *         {
 *           type: 'text',
 *           text: 'Hello, World!'
 *         }
 *       ]
 *     }
 *   }
 * };
 *
 * <LfMessage {...message} />
 * ```
 */
const LfMessage = React.forwardRef<HTMLDivElement, LfMessageProps>(
  ({ type, altText, contents, onAction, className }, ref) => {
    // Validate that the message type is 'flex'
    if (type !== 'flex') {
      throw new Error(
        `Invalid message type: expected 'flex', but received '${type}'. ` +
          `LfMessage only accepts LINE Flex Message format with type 'flex'.`,
      );
    }

    // Render based on contents type
    if (contents.type === 'bubble') {
      return (
        <div ref={ref} className={cn('lf-message-wrapper', className)} role="article" aria-label={altText}>
          <LfBubble {...contents} onAction={onAction} />
        </div>
      );
    }

    if (contents.type === 'carousel') {
      return (
        <div ref={ref} className={cn('lf-message-wrapper', className)} role="article" aria-label={altText}>
          <LfCarousel {...contents} onAction={onAction} />
        </div>
      );
    }

    // This should never happen with proper TypeScript types, but adding for runtime safety
    throw new Error(
      `Invalid contents type: expected 'bubble' or 'carousel', but received '${(contents as any).type}'.`,
    );
  },
);

LfMessage.displayName = 'LfMessage';

export { LfMessage };
