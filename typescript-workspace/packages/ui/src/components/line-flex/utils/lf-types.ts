export type FlexSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | '3xl' | '4xl' | '5xl';
export type FlexSpacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type FlexMargin = FlexSpacing;
export type FlexGravity = 'top' | 'bottom' | 'center';
export type FlexAlign = 'start' | 'end' | 'center';
export type FlexDecoration = 'none' | 'underline' | 'line-through';
export type FlexWeight = 'regular' | 'bold';
export type FlexStyle = 'normal' | 'italic';
export type FlexPosition = 'relative' | 'absolute';
export type FlexAspectRatio =
  | '1:1'
  | '1.51:1'
  | '1.91:1'
  | '4:3'
  | '16:9'
  | '20:13'
  | '2:1'
  | '3:1'
  | '3:4'
  | '9:16'
  | '1:2'
  | '1:3';
export type FlexAspectMode = 'cover' | 'fit';
export type FlexLayout = 'horizontal' | 'vertical' | 'baseline';
export type FlexDirection = 'ltr' | 'rtl';
export type FlexJustifyContent =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';
export type FlexAlignItems = 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
export type FlexBubbleSize = 'nano' | 'micro' | 'deca' | 'hecto' | 'kilo' | 'mega' | 'giga';
export type FlexButtonStyle = 'link' | 'primary' | 'secondary';
export type FlexButtonHeight = 'sm' | 'md';
export type FlexBorderWidth = 'none' | 'light' | 'normal' | 'medium' | 'semi-bold' | 'bold';

export type FlexAction = FlexURIAction | FlexMessageAction | FlexPostbackAction;

export interface FlexURIAction {
  type: 'uri';
  label?: string;
  uri: string;
  altUri?: {
    desktop?: string;
  };
}

export interface FlexMessageAction {
  type: 'message';
  label?: string;
  text: string;
}

export interface FlexPostbackAction {
  type: 'postback';
  label?: string;
  data: string;
  displayText?: string;
}

export interface FlexBackground {
  type: 'linearGradient';
  angle: string;
  startColor: string;
  endColor: string;
  centerColor?: string;
  centerPosition?: string;
}

export interface FlexBox {
  type: 'box';
  layout: FlexLayout;
  contents: FlexComponent[];
  flex?: number;
  spacing?: FlexSpacing | string;
  margin?: FlexMargin | string;
  paddingAll?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingStart?: string;
  paddingEnd?: string;
  position?: FlexPosition;
  offsetTop?: string;
  offsetBottom?: string;
  offsetStart?: string;
  offsetEnd?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: FlexBorderWidth | string;
  cornerRadius?: string;
  width?: string;
  maxWidth?: string;
  height?: string;
  maxHeight?: string;
  justifyContent?: FlexJustifyContent;
  alignItems?: FlexAlignItems;
  background?: FlexBackground;
  action?: FlexAction;
}

export interface FlexButton {
  type: 'button';
  action: FlexAction;
  flex?: number;
  margin?: FlexMargin | string;
  position?: FlexPosition;
  offsetTop?: string;
  offsetBottom?: string;
  offsetStart?: string;
  offsetEnd?: string;
  height?: FlexButtonHeight;
  style?: FlexButtonStyle;
  color?: string;
  gravity?: FlexGravity;
  adjustMode?: 'shrink-to-fit';
}

export interface FlexFiller {
  type: 'filler';
  flex?: number;
}

export interface FlexIcon {
  type: 'icon';
  url: string;
  size?: FlexSize | string;
  aspectRatio?: FlexAspectRatio;
  margin?: FlexMargin | string;
  position?: FlexPosition;
  offsetTop?: string;
  offsetBottom?: string;
  offsetStart?: string;
  offsetEnd?: string;
}

export interface FlexImage {
  type: 'image';
  url: string;
  flex?: number;
  margin?: FlexMargin | string;
  position?: FlexPosition;
  offsetTop?: string;
  offsetBottom?: string;
  offsetStart?: string;
  offsetEnd?: string;
  align?: FlexAlign;
  gravity?: FlexGravity;
  size?: FlexSize | string;
  aspectRatio?: FlexAspectRatio;
  aspectMode?: FlexAspectMode;
  backgroundColor?: string;
  action?: FlexAction;
}

export interface FlexSeparator {
  type: 'separator';
  margin?: FlexMargin | string;
  color?: string;
}

export interface FlexSpacer {
  type: 'spacer';
  size?: FlexSize | string;
}

export interface FlexText {
  type: 'text';
  text: string;
  contents?: FlexSpan[];
  flex?: number;
  margin?: FlexMargin | string;
  position?: FlexPosition;
  offsetTop?: string;
  offsetBottom?: string;
  offsetStart?: string;
  offsetEnd?: string;
  size?: FlexSize | string;
  align?: FlexAlign;
  gravity?: FlexGravity;
  wrap?: boolean;
  maxLines?: number;
  weight?: FlexWeight;
  color?: string;
  style?: FlexStyle;
  decoration?: FlexDecoration;
  lineSpacing?: string;
  action?: FlexAction;
}

export interface FlexSpan {
  type: 'span';
  text: string;
  size?: FlexSize | string;
  color?: string;
  weight?: FlexWeight;
  style?: FlexStyle;
  decoration?: FlexDecoration;
}

export interface FlexVideo {
  type: 'video';
  url: string;
  previewUrl: string;
  altContent?: FlexImage | FlexBox;
  aspectRatio?: FlexAspectRatio;
  action?: FlexAction;
}

export type FlexComponent =
  | FlexBox
  | FlexButton
  | FlexFiller
  | FlexIcon
  | FlexImage
  | FlexSeparator
  | FlexSpacer
  | FlexText
  | FlexVideo;

export interface FlexBubbleStyles {
  header?: {
    backgroundColor?: string;
  };
  hero?: {
    backgroundColor?: string;
  };
  body?: {
    backgroundColor?: string;
  };
  footer?: {
    backgroundColor?: string;
  };
}

export interface FlexBubble {
  type: 'bubble';
  size?: FlexBubbleSize;
  direction?: FlexDirection;
  header?: FlexBox;
  hero?: FlexBox | FlexImage | FlexVideo;
  body?: FlexBox;
  footer?: FlexBox;
  styles?: FlexBubbleStyles;
  action?: FlexAction;
}

export interface FlexCarousel {
  type: 'carousel';
  contents: FlexBubble[];
}

export interface FlexMessage {
  type: 'flex';
  altText: string;
  contents: FlexBubble | FlexCarousel;
}
