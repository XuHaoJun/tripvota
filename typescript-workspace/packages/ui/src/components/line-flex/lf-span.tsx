import * as React from 'react';

import { cn } from '@workspace/ui/lib/utils';

import { getSizeClass, getSizeStyle } from './utils/lf-helpers';
import type { FlexSpan } from './utils/lf-types';
import { weightVariants, styleVariants, decorationVariants } from './utils/lf-variants';

export interface LfSpanProps extends FlexSpan {
  className?: string;
}

const LfSpan = React.forwardRef<HTMLSpanElement, LfSpanProps>(
  ({ text, size, color, weight, style, decoration, className }, ref) => {
    const sizeClass = getSizeClass(size);
    const sizeStyle = getSizeStyle(size);

    const inlineStyle: React.CSSProperties = {
      ...sizeStyle,
      ...(color && { color }),
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inherit',
          sizeClass,
          weight && weightVariants({ weight }),
          style && styleVariants({ style }),
          decoration && decorationVariants({ decoration }),
          className,
        )}
        style={inlineStyle}
      >
        {text}
      </span>
    );
  },
);

LfSpan.displayName = 'LfSpan';

export { LfSpan };
