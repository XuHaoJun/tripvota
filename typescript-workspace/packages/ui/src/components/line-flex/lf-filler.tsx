import * as React from 'react';

import { cn } from '@workspace/ui/lib/utils';

import { getFlexClass, getFlexStyle } from './utils/lf-helpers';
import type { FlexFiller } from './utils/lf-types';

export interface LfFillerProps extends FlexFiller {
  className?: string;
}

const LfFiller = React.forwardRef<HTMLDivElement, LfFillerProps>(({ flex = 1, className }, ref) => {
  const flexClass = getFlexClass(flex);
  const flexStyle = getFlexStyle(flex);

  return <div ref={ref} className={cn('min-h-0', flexClass, className)} style={flexStyle} />;
});

LfFiller.displayName = 'LfFiller';

export { LfFiller };
