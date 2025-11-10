import * as React from 'react';

import { cn } from '@workspace/ui/lib/utils';

import { getMarginClass } from './utils/lf-helpers';
import type { FlexSeparator } from './utils/lf-types';

export interface LfSeparatorProps extends FlexSeparator {
  className?: string;
  layout?: 'horizontal' | 'vertical' | 'baseline';
}

const LfSeparator = React.forwardRef<HTMLDivElement, LfSeparatorProps>(
  ({ margin, color, className, layout = 'vertical' }, ref) => {
    const isHorizontal = layout === 'horizontal' || layout === 'baseline';

    // Separator uses margin-top for vertical layout, margin-left for horizontal
    const marginClass = getMarginClass(margin);
    const marginStyle: React.CSSProperties =
      margin && (margin.includes('px') || margin.includes('%'))
        ? isHorizontal
          ? { marginLeft: margin }
          : { marginTop: margin }
        : {};

    const style: React.CSSProperties = {
      ...marginStyle,
      ...(color && { borderColor: color }),
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex-none',
          !isHorizontal ? 'h-px w-full border-t border-[#d4d6da]' : 'h-full w-px border-l border-[#d4d6da]',
          marginClass,
          className,
        )}
        style={style}
      />
    );
  },
);

LfSeparator.displayName = 'LfSeparator';

export { LfSeparator };
