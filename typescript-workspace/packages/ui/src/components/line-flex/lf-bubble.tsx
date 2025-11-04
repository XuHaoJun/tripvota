import * as React from 'react';

import { cn } from '@workspace/ui/lib/utils';

import { LfBox, renderLfFlexComponent } from './lf-box';
import { handleAction } from './utils/lf-helpers';
import type { FlexBubble, FlexAction } from './utils/lf-types';
import { bubbleSizeVariants } from './utils/lf-variants';

export interface LfBubbleProps extends FlexBubble {
  className?: string;
  onAction?: (action: FlexAction) => void;
}

const LfBubble = React.forwardRef<HTMLDivElement, LfBubbleProps>(
  ({ size = 'mega', direction = 'ltr', header, hero, body, footer, styles, action, onAction, className }, ref) => {
    const clickHandler = handleAction(action, onAction);

    const directionClass = direction === 'rtl' ? 'dir-rtl' : 'dir-ltr';

    return (
      <div
        ref={ref}
        className={cn(bubbleSizeVariants({ size }), directionClass, action && 'cursor-pointer', className)}
        onClick={action && !onAction ? clickHandler : undefined}
        dir={direction}
      >
        {/* Header */}
        {header && (
          <div
            className="flex flex-none flex-col"
            style={styles?.header?.backgroundColor ? { backgroundColor: styles.header.backgroundColor } : undefined}
          >
            <LfBox
              {...header}
              onAction={onAction}
              {...(header.paddingAll === undefined &&
                header.paddingTop === undefined &&
                header.paddingBottom === undefined &&
                header.paddingStart === undefined &&
                header.paddingEnd === undefined && {
                  paddingAll:
                    size === 'mega' || size === 'giga'
                      ? '20px'
                      : size === 'kilo'
                        ? '13px'
                        : size === 'nano' || size === 'micro'
                          ? '10px'
                          : '11px',
                })}
            />
          </div>
        )}

        {/* Hero */}
        {hero && (
          <div
            className="flex-none"
            style={styles?.hero?.backgroundColor ? { backgroundColor: styles.hero.backgroundColor } : undefined}
          >
            {hero.type === 'box' ? (
              <LfBox {...hero} onAction={onAction} />
            ) : (
              renderLfFlexComponent(hero, 0, undefined, onAction)
            )}
          </div>
        )}

        {/* Body */}
        {body && (
          <div
            className="flex flex-1 flex-col"
            style={styles?.body?.backgroundColor ? { backgroundColor: styles.body.backgroundColor } : undefined}
          >
            <LfBox
              {...body}
              onAction={onAction}
              {...(body.paddingAll === undefined &&
                body.paddingTop === undefined &&
                body.paddingBottom === undefined &&
                body.paddingStart === undefined &&
                body.paddingEnd === undefined && {
                  paddingAll:
                    size === 'mega' || size === 'giga'
                      ? '20px'
                      : size === 'kilo'
                        ? '13px'
                        : size === 'nano' || size === 'micro'
                          ? '10px'
                          : '11px',
                  paddingTop: size === 'mega' || size === 'giga' ? '19px' : undefined,
                  paddingBottom: footer
                    ? size === 'kilo' || size === 'hecto' || size === 'deca'
                      ? '17px'
                      : '10px'
                    : undefined,
                })}
            />
          </div>
        )}

        {/* Footer */}
        {footer && (
          <div
            className="flex flex-none flex-col"
            style={styles?.footer?.backgroundColor ? { backgroundColor: styles.footer.backgroundColor } : undefined}
          >
            <LfBox
              {...footer}
              onAction={onAction}
              {...(footer.paddingAll === undefined &&
                footer.paddingTop === undefined &&
                footer.paddingBottom === undefined &&
                footer.paddingStart === undefined &&
                footer.paddingEnd === undefined && {
                  paddingAll: '10px',
                })}
            />
          </div>
        )}
      </div>
    );
  },
);

LfBubble.displayName = 'LfBubble';

export { LfBubble };
