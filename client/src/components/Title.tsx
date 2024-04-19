import {Component, createEffect} from 'solid-js';
import {siteResource} from '~/api/globalResources';

export const Title: Component<{children?: string}> = (props) => {
  const [site] = siteResource;

  createEffect(() => {
    const parts = [];
    if (props.children) parts.push(props.children);
    if (site()?.name) parts.push(site()?.name);

    document.title = parts.join(' - ');
  });

  return <></>;
};
