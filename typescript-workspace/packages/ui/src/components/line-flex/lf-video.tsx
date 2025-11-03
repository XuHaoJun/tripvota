import * as React from 'react';

import { cn } from '@workspace/ui/lib/utils';

import type { FlexVideo } from './utils/lf-types';
import { aspectRatioVariants } from './utils/lf-variants';

export interface LfVideoProps extends FlexVideo {
  className?: string;
}

const LfVideo = React.forwardRef<HTMLDivElement, LfVideoProps>(
  ({ url, previewUrl, aspectRatio = '16:9', className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('w-full overflow-hidden', aspectRatio && aspectRatioVariants({ aspectRatio }), className)}
      >
        <video className="h-full w-full object-cover" poster={previewUrl} controls>
          <source src={url} type="video/mp4" />
          <source src={url} type="video/ogg" />
          <source src={url} type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  },
);

LfVideo.displayName = 'LfVideo';

export { LfVideo };
