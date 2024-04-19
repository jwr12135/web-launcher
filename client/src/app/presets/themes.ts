export const themes: Record<string, Theme> = {
  Default: {
    background: ['gradient', 43, 'FFCC70', 'FC00FF'],
    color: {
      accent: '2196F3',
      neutral: 'FFFFFF',
    },
    fontFamily: 'sans',
    radius: 8,
    toolbar: {
      background: ['color', '2196F3CC'],
      radius: 0,
      shadow: {
        offsetX: 0,
        offsetY: 2,
        blur: 8,
        spread: 0,
        color: '00000066',
        inset: false,
      },
    },
    widget: {
      background: ['color', 'FFFFFF'],
      color: '000000',
      labelFont: {
        color: '000000',
        italic: false,
        size: 16,
        weight: 400,
      },
      radius: 12,
      shadow: {
        offsetX: 0,
        offsetY: 0,
        blur: 0,
        spread: 0,
        color: '00000000',
        inset: false,
      },
      labelShadow: {
        offsetX: 0,
        offsetY: 0,
        blur: 0,
        color: '00000000',
      },
      transform: {
        translateX: 0,
        translateY: 0,
        scale: 100,
        rotate: 0,
      },
      labelTransform: {
        translateX: 0,
        translateY: 0,
        scale: 100,
        rotate: 0,
      },
      transition: {
        duration: 250,
        function: 'ease',
      },
    },
  },
};
