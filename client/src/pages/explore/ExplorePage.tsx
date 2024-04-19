import {Component, For, Show, createResource} from 'solid-js';
import * as api from '~/api/api';
import {ErrorMessage} from '~/components/ui/ErrorMessage';
import {Title} from '~/components/Title';
import ProjectItem from '../project/ProjectItem';

const ExplorePage: Component = () => {
  const [resource, {mutate, refetch}] = createResource(
    () => ({sort: 'trending'}),
    api.projectList,
  );

  return (
    <>
      <Title>Explore</Title>
      <Show when={resource.state === 'ready'}>
        <For each={resource()}>
          {(projectView, i) => (
            <ProjectItem
              projectView={projectView}
              setProjectView={(newValue) => {
                const newItems = [...resource()!];
                newItems[i()] = newValue;
                mutate(newItems);
              }}
            />
          )}
        </For>
      </Show>
      <Show when={resource.state === 'errored'}>
        <ErrorMessage>{resource.error}</ErrorMessage>
      </Show>
    </>
  );
};

export default ExplorePage;
