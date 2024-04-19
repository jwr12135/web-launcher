declare const PLATFORM: 'WEB' | 'CHROME' | 'FIREFOX';
declare const VERSION: string;

type DeepRequired<T> = Required<{
  [K in keyof T]: DeepRequired<T[K]>;
}>;

type Inter<T> = [DeepRequired<T>, (fn: (state: T) => void) => void, T];

interface WidgetData {
  type: string;
  name: string;
  options?: Record<string, unknown>;
  size?: Size;
  theme?: WidgetTheme;
  themeHover?: WidgetTheme;
}

type Size = [number, number];

type GradientValue = [number, string, string];

type Background =
  | ['color', string]
  | ['gradient', ...GradientValue]
  | ['image', string];

type ComplexBackground =
  | Background
  | ['video', string]
  | ['iframe', string]
  | ['youtube', string];

interface Font {
  color?: string;
  family?: string;
  italic?: boolean;
  size?: number;
  weight?: number;
}

interface BoxShadow {
  offsetX?: number;
  offsetY?: number;
  blur?: number;
  spread?: number;
  color?: string;
  inset?: boolean;
}

interface TextShadow {
  offsetX?: number;
  offsetY?: number;
  blur?: number;
  color?: string;
}

interface Transform {
  translateX?: number;
  translateY?: number;
  scale?: number;
  rotate?: number;
}

interface ToolbarTheme {
  background?: Background;
  radius?: number;
  shadow?: BoxShadow;
}

interface Transition {
  duration?: number;
  function?: string;
}

interface WidgetTheme {
  background?: Background;
  color?: string;
  fontFamily?: string;
  labelFont?: Font;
  radius?: number;
  shadow?: BoxShadow;
  labelShadow?: TextShadow;
  transform?: Transform;
  labelTransform?: Transform;
  transition?: Transition;
}

interface Theme {
  background?: ComplexBackground;
  color?: {
    accent?: string;
    neutral?: string;
  };
  fontFamily?: string;
  radius?: number;
  toolbar?: ToolbarTheme;
  widget?: WidgetTheme;
  widgetHover?: WidgetTheme;
}

interface Layout {
  dashboard?: {
    columns?: number;
    margin?: number;
    gap?: number;
    size?: number;
  };
  toolbar?: {
    margin?: number;
    padding?: number;
    position?: 'top' | 'bottom';
  };
}

interface Page {
  linkTarget?: '_self' | '_blank';
  linkContainer?: string;
}

interface Settings {
  theme?: Theme;
  layout?: Layout;
  page?: Page;
}

interface User {
  settings?: Settings;
  icons?: string[];
}

interface Space {
  name: string;
  selected: string;
  order: string[];
  tabs: Record<
    string,
    {
      name: string;
      icon: string;
      groups: string[];
    }
  >;
  groups: Record<
    string,
    {
      name: string;
      collapsed: boolean;
      widgets: string[];
    }
  >;
  widgets: Record<string, WidgetData>;
  settings?: Settings;
}

interface Config {
  sourcetab: string;
  date: number;
  user: User;
  space: string;
  spaces: Record<
    string,
    {
      name: string;
    }
  >;
  files: Record<string, string>;
}

interface Widget<Options = Record<string, unknown>> {
  name: string;
  defaultOptions: Options;
  exampleOptions: Options;
  Component: import('solid-js').Component<{
    options: Inter<Options>;
    inToolbar?: boolean;
    disabled?: boolean;
  }>;
  options?: Record<
    string,
    {control?: import('solid-js').Component} & (
      | {
          type: 'text';
          default: string;
          example?: string;
        }
      | {
          type: 'select';
          default: string;
          options?: Record<string, string>;
        }
      | {
          type: 'boolean';
          default: boolean;
        }
      | {
          type: 'number';
          default: number;
          min?: number;
          max?: number;
          step?: number;
        }
      | {
          type: 'icon';
          default: string;
        }
      | {
          type: 'color';
          default: string;
          alpha?: boolean;
        }
    )
  >;
  Options: import('solid-js').Component<{
    options: Inter<Options>;
  }>;
}
