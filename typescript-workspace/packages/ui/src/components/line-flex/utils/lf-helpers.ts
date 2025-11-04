import type { FlexAction, FlexMargin, FlexSpacing } from './lf-types';

/**
 * Convert margin/spacing to CSS class or inline style
 */
export function getMarginClass(margin?: FlexMargin | string): string {
  if (!margin) return '';

  if (margin.includes('px') || margin.includes('%')) {
    return ''; // Will be handled as inline style
  }

  const marginMap: Record<string, string> = {
    none: 'mt-0',
    xs: 'mt-[2px]',
    sm: 'mt-[4px]',
    md: 'mt-[8px]',
    lg: 'mt-[12px]',
    xl: 'mt-[16px]',
    xxl: 'mt-[20px]',
  };

  return marginMap[margin] || '';
}

export function getMarginStyle(margin?: FlexMargin | string): React.CSSProperties {
  if (!margin || (!margin.includes('px') && !margin.includes('%'))) return {};
  return { marginTop: margin };
}

/**
 * Convert margin to left margin CSS class or inline style (for text elements)
 */
export function getTextMarginClass(margin?: FlexMargin | string): string {
  if (!margin) return '';

  if (margin.includes('px') || margin.includes('%')) {
    return ''; // Will be handled as inline style
  }

  const marginMap: Record<string, string> = {
    none: 'ml-0',
    xs: 'ml-[2px]',
    sm: 'ml-[4px]',
    md: 'ml-[8px]',
    lg: 'ml-[12px]',
    xl: 'ml-[16px]',
    xxl: 'ml-[20px]',
  };

  return marginMap[margin] || '';
}

export function getTextMarginStyle(margin?: FlexMargin | string): React.CSSProperties {
  if (!margin || (!margin.includes('px') && !margin.includes('%'))) return {};
  return { marginLeft: margin };
}

/**
 * Convert spacing to CSS class or inline style
 */
export function getSpacingClass(spacing?: FlexSpacing | string): string {
  if (!spacing) return '';

  if (spacing.includes('px') || spacing.includes('%')) {
    return '';
  }

  const spacingMap: Record<string, string> = {
    none: 'gap-0',
    xs: 'gap-[2px]',
    sm: 'gap-[4px]',
    md: 'gap-[8px]',
    lg: 'gap-[12px]',
    xl: 'gap-[16px]',
    xxl: 'gap-[20px]',
  };

  return spacingMap[spacing] || '';
}

export function getSpacingStyle(spacing?: FlexSpacing | string): React.CSSProperties {
  if (!spacing || (!spacing.includes('px') && !spacing.includes('%'))) return {};
  return { gap: spacing };
}

/**
 * Get flex class from flex number
 * Note: When flex is undefined, we return empty string and let parent layout determine behavior via CSS
 */
export function getFlexClass(flex?: number): string {
  if (flex === undefined || flex < 0) return '';
  if (flex === 0) return 'flex-none';
  if (flex === 1) return 'flex-1';
  if (flex === 2) return 'flex-[2]';
  if (flex === 3) return 'flex-[3]';
  return ''; // Will use inline style for larger values
}

export function getFlexStyle(flex?: number): React.CSSProperties {
  if (flex === undefined || flex < 0 || flex <= 3) return {};
  return { flexGrow: flex };
}

/**
 * Get offset styles
 */
export function getOffsetStyles(
  offsetTop?: string,
  offsetBottom?: string,
  offsetStart?: string,
  offsetEnd?: string,
): React.CSSProperties {
  const styles: React.CSSProperties = {};

  if (offsetTop) {
    styles.top = offsetTop.includes('px') || offsetTop.includes('%') ? offsetTop : getOffsetValue(offsetTop);
  }
  if (offsetBottom) {
    styles.bottom =
      offsetBottom.includes('px') || offsetBottom.includes('%') ? offsetBottom : getOffsetValue(offsetBottom);
  }
  if (offsetStart) {
    styles.left = offsetStart.includes('px') || offsetStart.includes('%') ? offsetStart : getOffsetValue(offsetStart);
  }
  if (offsetEnd) {
    styles.right = offsetEnd.includes('px') || offsetEnd.includes('%') ? offsetEnd : getOffsetValue(offsetEnd);
  }

  return styles;
}

function getOffsetValue(offset: string): string {
  const offsetMap: Record<string, string> = {
    none: '0',
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    xxl: '20px',
  };
  return offsetMap[offset] || '0';
}

/**
 * Get padding styles
 */
export function getPaddingStyles(
  paddingAll?: string,
  paddingTop?: string,
  paddingBottom?: string,
  paddingStart?: string,
  paddingEnd?: string,
): React.CSSProperties {
  const styles: React.CSSProperties = {};

  if (paddingAll) {
    styles.padding = paddingAll.includes('px') || paddingAll.includes('%') ? paddingAll : getPaddingValue(paddingAll);
  }
  if (paddingTop) {
    styles.paddingTop =
      paddingTop.includes('px') || paddingTop.includes('%') ? paddingTop : getPaddingValue(paddingTop);
  }
  if (paddingBottom) {
    styles.paddingBottom =
      paddingBottom.includes('px') || paddingBottom.includes('%') ? paddingBottom : getPaddingValue(paddingBottom);
  }
  if (paddingStart) {
    styles.paddingLeft =
      paddingStart.includes('px') || paddingStart.includes('%') ? paddingStart : getPaddingValue(paddingStart);
  }
  if (paddingEnd) {
    styles.paddingRight =
      paddingEnd.includes('px') || paddingEnd.includes('%') ? paddingEnd : getPaddingValue(paddingEnd);
  }

  return styles;
}

function getPaddingValue(padding: string): string {
  const paddingMap: Record<string, string> = {
    none: '0',
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    xxl: '20px',
  };
  return paddingMap[padding] || '0';
}

/**
 * Get corner radius class
 */
export function getCornerRadiusClass(cornerRadius?: string): string {
  if (!cornerRadius) return '';

  if (cornerRadius.includes('px')) {
    return '';
  }

  const radiusMap: Record<string, string> = {
    none: 'rounded-none',
    xs: 'rounded-[2px]',
    sm: 'rounded-[4px]',
    md: 'rounded-lg',
    lg: 'rounded-[12px]',
    xl: 'rounded-[16px]',
    xxl: 'rounded-[20px]',
  };

  return radiusMap[cornerRadius] || '';
}

export function getCornerRadiusStyle(cornerRadius?: string): React.CSSProperties {
  if (!cornerRadius || !cornerRadius.includes('px')) return {};
  return { borderRadius: cornerRadius };
}

/**
 * Get border width class
 */
export function getBorderWidthClass(borderWidth?: string): string {
  if (!borderWidth) return '';

  if (borderWidth.includes('px')) {
    return '';
  }

  const borderMap: Record<string, string> = {
    none: 'border-0',
    light: 'border-[0.5px]',
    normal: 'border',
    medium: 'border-2',
    'semi-bold': 'border-[3px]',
    bold: 'border-4',
  };

  return borderMap[borderWidth] || '';
}

export function getBorderWidthStyle(borderWidth?: string): React.CSSProperties {
  if (!borderWidth || !borderWidth.includes('px')) return {};
  return { borderWidth };
}

/**
 * Get background gradient style
 */
export function getBackgroundGradientStyle(background?: {
  type: 'linearGradient';
  angle: string;
  startColor: string;
  endColor: string;
  centerColor?: string;
  centerPosition?: string;
}): React.CSSProperties {
  if (!background || background.type !== 'linearGradient') return {};

  const { angle, startColor, endColor, centerColor, centerPosition = '50%' } = background;

  let gradient: string;
  if (centerColor) {
    gradient = `linear-gradient(${angle}, ${startColor} 0%, ${centerColor} ${centerPosition}, ${endColor} 100%)`;
  } else {
    gradient = `linear-gradient(${angle}, ${startColor} 0%, ${endColor} 100%)`;
  }

  return { background: gradient };
}

/**
 * Handle action click
 */
export function handleAction(action?: FlexAction, onAction?: (action: FlexAction) => void) {
  if (!action) return undefined;

  return (e: React.MouseEvent) => {
    e.preventDefault();

    if (onAction) {
      onAction(action);
      return;
    }

    // Default handlers
    switch (action.type) {
      case 'uri':
        window.open(action.uri, '_blank', 'noopener,noreferrer');
        break;
      case 'message':
        alert(`Message: ${action.text}`);
        break;
      case 'postback':
        alert(`Postback: ${action.data}`);
        break;
    }
  };
}

/**
 * Get size class for various components
 */
export function getSizeClass(size?: string): string {
  if (!size) return '';

  if (size.includes('px') || size.includes('%')) {
    return '';
  }

  const sizeMap: Record<string, string> = {
    xxs: 'text-[11px]',
    xs: 'text-[13px]',
    sm: 'text-[14px]',
    md: 'text-base',
    lg: 'text-[19px]',
    xl: 'text-[22px]',
    xxl: 'text-[29px]',
    '3xl': 'text-[35px]',
    '4xl': 'text-[48px]',
    '5xl': 'text-[74px]',
  };

  return sizeMap[size] || '';
}

export function getSizeStyle(size?: string): React.CSSProperties {
  if (!size || (!size.includes('px') && !size.includes('%'))) return {};
  return { fontSize: size };
}

/**
 * Compute per-child spacing className to emulate flex2html:
 * - Vertical: .MdBx.vr.spcSm > div { margin-top: 4px; }
 * - Horizontal/Baseline: margin-left equivalent
 * Skips first child and filler/spacer components.
 */
export function getChildSpacingClass(
  spacing: FlexSpacing | string | undefined,
  layout: 'horizontal' | 'vertical' | 'baseline' | undefined,
  childIndex: number,
  componentType: string,
): string {
  if (!spacing || childIndex === 0) return '';
  if (componentType === 'filler' || componentType === 'spacer') return '';

  const tokenToPx: Record<string, string> = {
    none: '0px',
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    xxl: '20px',
  };

  const value =
    typeof spacing === 'string' && (spacing.includes('px') || spacing.includes('%'))
      ? spacing
      : tokenToPx[String(spacing)] || '';

  if (!value) return '';

  const marginDir = layout === 'vertical' ? 'mt' : 'ml';
  return `${marginDir}-[${value}]`;
}
