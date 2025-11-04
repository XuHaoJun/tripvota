import * as React from 'react';

import { cn } from '@workspace/ui/lib/utils';

import { LfSpan } from './lf-span';
import {
  getSizeClass,
  getSizeStyle,
  getMarginClass,
  getMarginStyle,
  getTextMarginClass,
  getTextMarginStyle,
  getOffsetStyles,
  getFlexClass,
  getFlexStyle,
  handleAction,
} from './utils/lf-helpers';
import type { FlexText, FlexSpan, FlexAction } from './utils/lf-types';
import {
  positionVariants,
  weightVariants,
  styleVariants,
  decorationVariants,
  alignVariants,
  gravityVariants,
} from './utils/lf-variants';

export type LfTextProps = FlexText & {
  className?: string;
  layout?: 'horizontal' | 'vertical' | 'baseline';
  onAction?: (action: FlexAction) => void;
};

const LfText = React.forwardRef<HTMLDivElement, LfTextProps>(
  (
    {
      text,
      contents,
      flex,
      margin,
      position,
      offsetTop,
      offsetBottom,
      offsetStart,
      offsetEnd,
      size = 'md',
      align,
      gravity,
      wrap = false,
      maxLines,
      weight,
      color,
      style,
      decoration,
      lineSpacing,
      action,
      layout,
      onAction,
      className,
    },
    ref,
  ) => {
    const sizeClass = getSizeClass(size);
    const sizeStyle = getSizeStyle(size);

    // Use margin-left for baseline/horizontal layout, margin-top for vertical layout
    const isBaselineOrHorizontal = layout === 'baseline' || layout === 'horizontal';
    const marginClass = isBaselineOrHorizontal ? getTextMarginClass(margin) : getMarginClass(margin);
    const marginStyle = isBaselineOrHorizontal ? getTextMarginStyle(margin) : getMarginStyle(margin);

    const offsetStyles = getOffsetStyles(offsetTop, offsetBottom, offsetStart, offsetEnd);
    const flexClass = getFlexClass(flex);
    const flexStyle = getFlexStyle(flex);

    const containerStyle: React.CSSProperties = {
      ...sizeStyle,
      ...marginStyle,
      ...offsetStyles,
      ...flexStyle,
    };

    const textStyle: React.CSSProperties = {
      ...(color && { color }),
      ...(lineSpacing && {
        lineHeight: `${parseInt(lineSpacing.replace('px', '')) + 15}px`,
      }),
      // Match flex2html default baseline line-height of 1.4 when no explicit lineSpacing
      ...(!lineSpacing && { lineHeight: 1.4 }),
      ...(maxLines && {
        display: '-webkit-box',
        WebkitLineClamp: maxLines,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }),
    };

    const clickHandler = handleAction(action, onAction);

    // Convert newlines to <br> tags
    const textContent = (text || '').replace(/\n/g, '<br>');

    const content = (
      <>
        {contents && contents.length > 0 ? (
          <>
            <span dangerouslySetInnerHTML={{ __html: textContent }} />
            {contents.map((span: FlexSpan, index: number) => (
              <LfSpan key={index} {...span} />
            ))}
          </>
        ) : (
          <span dangerouslySetInnerHTML={{ __html: textContent }} />
        )}
      </>
    );

    const textElement =
      action?.type === 'uri' ? (
        <a
          href={action.uri}
          target="_blank"
          rel="noopener noreferrer"
          className="text-inherit no-underline hover:underline"
          style={textStyle}
          onClick={clickHandler}
        >
          {content}
        </a>
      ) : (
        <p
          className={cn(
            !wrap && 'overflow-hidden text-ellipsis whitespace-nowrap',
            wrap && 'break-words whitespace-normal',
          )}
          style={textStyle}
          onClick={clickHandler}
        >
          {content}
        </p>
      );

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex max-w-full min-w-0 flex-col',
          // Default to flex-1 when flex is not specified (matching .MdTxt behavior)
          flex === undefined ? 'flex-1' : flexClass,
          sizeClass,
          marginClass,
          position && positionVariants({ position }),
          weight && weightVariants({ weight }),
          style && styleVariants({ style }),
          decoration && decorationVariants({ decoration }),
          align && alignVariants({ align }),
          gravity && gravityVariants({ gravity }),
          action && 'cursor-pointer',
          className,
        )}
        style={containerStyle}
      >
        {textElement}
      </div>
    );
  },
);

LfText.displayName = 'LfText';

export { LfText };
