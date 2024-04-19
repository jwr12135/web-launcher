import {Component, For, splitProps} from 'solid-js';

import {useSpace} from '../storage';
import WidgetItem from './WidgetItem';

export interface WidgetContainerProps {
  id: string;
  inToolbar?: boolean;
}

export const DefaultWidgetContainer: Component<WidgetContainerProps> = (
  props,
) => {
  const [space] = useSpace();

  const [local, others] = splitProps(props, ['id']);

  return (
    <>
      <For each={space.groups[local.id].widgets}>
        {(widgetId) => <WidgetItem id={widgetId} {...others} />}
      </For>
    </>
  );
};
