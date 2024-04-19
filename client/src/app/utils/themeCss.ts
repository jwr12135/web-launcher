export const themeCss = {
  boxShadow: (value: Required<BoxShadow>) =>
    `${value.inset ? 'inset ' : ''}${value.offsetX}px ${value.offsetY}px ${
      value.blur
    }px ${value.spread}px #${value.color}`,
  textShadow: (value: Required<TextShadow>) =>
    `${value.offsetX}px ${value.offsetY}px ${value.blur}px #${value.color}`,
  transform: (value: Required<Transform>) =>
    `translate(${value.translateX}px, ${value.translateY}px) scale(${
      value.scale / 100
    }) rotate(${value.rotate}deg)`,
};
