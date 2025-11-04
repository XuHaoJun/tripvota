import { cva } from 'class-variance-authority';

// Size variants for text, icons, images
export const sizeVariants = cva('', {
  variants: {
    size: {
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
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// Margin variants
export const marginVariants = cva('', {
  variants: {
    margin: {
      none: 'mt-0',
      xs: 'mt-[2px]',
      sm: 'mt-[4px]',
      md: 'mt-[8px]',
      lg: 'mt-[12px]',
      xl: 'mt-[16px]',
      xxl: 'mt-[20px]',
    },
  },
});

// Spacing variants (for box gaps)
export const spacingVariants = cva('', {
  variants: {
    spacing: {
      none: 'gap-0',
      xs: 'gap-[2px]',
      sm: 'gap-[4px]',
      md: 'gap-[8px]',
      lg: 'gap-[12px]',
      xl: 'gap-[16px]',
      xxl: 'gap-[20px]',
    },
  },
});

// Layout variants for Box
export const layoutVariants = cva('flex', {
  variants: {
    layout: {
      horizontal: 'flex-row',
      vertical: 'flex-col',
      baseline: 'flex-row items-baseline',
    },
  },
  defaultVariants: {
    layout: 'vertical',
  },
});

// Align variants
export const alignVariants = cva('', {
  variants: {
    align: {
      start: 'text-start',
      end: 'text-end',
      center: 'text-center',
    },
  },
});

// Gravity variants (justify-content for flex)
export const gravityVariants = cva('', {
  variants: {
    gravity: {
      top: 'justify-start',
      center: 'justify-center',
      bottom: 'justify-end',
    },
  },
});

// Position variants
export const positionVariants = cva('', {
  variants: {
    position: {
      relative: 'relative',
      absolute: 'absolute',
    },
  },
  defaultVariants: {
    position: 'relative',
  },
});

// Text weight variants
export const weightVariants = cva('', {
  variants: {
    weight: {
      regular: 'font-normal',
      bold: 'font-bold',
    },
  },
  defaultVariants: {
    weight: 'regular',
  },
});

// Text decoration variants
export const decorationVariants = cva('', {
  variants: {
    decoration: {
      none: 'no-underline',
      underline: 'underline',
      'line-through': 'line-through',
    },
  },
  defaultVariants: {
    decoration: 'none',
  },
});

// Text style variants
export const styleVariants = cva('', {
  variants: {
    style: {
      normal: 'not-italic',
      italic: 'italic',
    },
  },
  defaultVariants: {
    style: 'normal',
  },
});

// Image size variants
export const imageSizeVariants = cva('', {
  variants: {
    size: {
      xxs: 'w-[40px]',
      xs: 'w-[60px]',
      sm: 'w-[80px]',
      md: 'w-[100px]',
      lg: 'w-[120px]',
      xl: 'w-[140px]',
      xxl: 'w-[160px]',
      '3xl': 'w-[180px]',
      '4xl': 'w-[200px]',
      '5xl': 'w-[220px]',
      full: 'w-full',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// Aspect ratio variants
export const aspectRatioVariants = cva('relative overflow-hidden', {
  variants: {
    aspectRatio: {
      '1:1': 'aspect-square',
      '1.51:1': 'aspect-[151/100]',
      '1.91:1': 'aspect-[191/100]',
      '4:3': 'aspect-[4/3]',
      '16:9': 'aspect-video',
      '20:13': 'aspect-[20/13]',
      '2:1': 'aspect-[2/1]',
      '3:1': 'aspect-[3/1]',
      '3:4': 'aspect-[3/4]',
      '9:16': 'aspect-[9/16]',
      '1:2': 'aspect-[1/2]',
      '1:3': 'aspect-[1/3]',
    },
  },
});

// Aspect mode variants
export const aspectModeVariants = cva('', {
  variants: {
    aspectMode: {
      fit: 'object-contain',
      cover: 'object-cover',
    },
  },
  defaultVariants: {
    aspectMode: 'fit',
  },
});

// Button style variants
export const buttonStyleVariants = cva(
  'inline-flex items-center justify-center rounded-lg px-4 transition-colors whitespace-nowrap overflow-hidden text-ellipsis',
  {
    variants: {
      buttonStyle: {
        link: 'text-[#42659a] bg-transparent hover:underline',
        primary: 'bg-[#17c950] text-white hover:bg-[#17c950]/90',
        secondary: 'bg-[#dcdfe5] text-[#111111] hover:bg-[#dcdfe5]/90',
      },
      height: {
        sm: 'h-[40px]',
        md: 'h-[52px]',
      },
    },
    defaultVariants: {
      buttonStyle: 'link',
      height: 'md',
    },
  },
);

// Bubble size variants
export const bubbleSizeVariants = cva('rounded-[17px] overflow-hidden bg-white flex flex-col', {
  variants: {
    size: {
      nano: 'max-w-[120px] rounded-[10px]',
      micro: 'max-w-[160px] rounded-[10px]',
      deca: 'max-w-[220px] rounded-[10px]',
      hecto: 'max-w-[241px] rounded-[10px]',
      kilo: 'max-w-[260px] rounded-[10px]',
      mega: 'max-w-[300px]',
      giga: 'max-w-[500px] rounded-[5px]',
    },
  },
  defaultVariants: {
    size: 'mega',
  },
});

// Border width variants
export const borderWidthVariants = cva('border-solid', {
  variants: {
    borderWidth: {
      none: 'border-0',
      light: 'border-[0.5px]',
      normal: 'border',
      medium: 'border-2',
      'semi-bold': 'border-[3px]',
      bold: 'border-4',
    },
  },
});

// Justify content variants
export const justifyContentVariants = cva('', {
  variants: {
    justifyContent: {
      'flex-start': 'justify-start',
      'flex-end': 'justify-end',
      center: 'justify-center',
      'space-between': 'justify-between',
      'space-around': 'justify-around',
      'space-evenly': 'justify-evenly',
    },
  },
});

// Align items variants
export const alignItemsVariants = cva('', {
  variants: {
    alignItems: {
      'flex-start': 'items-start',
      'flex-end': 'items-end',
      center: 'items-center',
      baseline: 'items-baseline',
      stretch: 'items-stretch',
    },
  },
});
