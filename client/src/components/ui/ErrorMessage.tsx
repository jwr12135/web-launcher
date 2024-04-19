import {Component, ComponentProps, splitProps} from 'solid-js';
import {cn} from '~/utils/utils';

const ErrorMessage: Component<ComponentProps<'div'> & {children: any}> = (
  props,
) => {
  const [, rest] = splitProps(props, ['children', 'class']);
  return (
    <div class={cn('text-red-500', props.class)} {...rest}>
      {String(props.children)}
    </div>
  );
};

export {ErrorMessage};
