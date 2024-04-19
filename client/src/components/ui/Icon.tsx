import {Component, splitProps} from 'solid-js';

import {
  Icon as IconPrimitive,
  IconifyIconProps as IconPrimitiveProps,
} from '@iconify-icon/solid';

export interface IconProps extends IconPrimitiveProps {
  size?: number;
}

const Icon: Component<IconProps> = (props) => {
  const [, rest] = splitProps(props, ['size']);
  return (
    <IconPrimitive
      width={props.size ?? 24}
      height={props.size ?? 24}
      {...rest}
    />
  );
};

export {Icon};
