import {Component, For, Show, createResource} from 'solid-js';
import * as api from '~/api/api';
import {ErrorMessage} from '~/components/ui/ErrorMessage';
import ProjectItem from '../project/ProjectItem';

const UserStarsSection: Component<{username: string}> = (props) => {
  const [userStars, {mutate}] = createResource(
    () => ({
      staredBy: props.username,
    }),
    api.projectList,
  );

  return (
    <>
      <Show when={userStars.state === 'ready'}>
        <For each={userStars()}>
          {(projectView, i) => (
            <ProjectItem
              projectView={projectView}
              setProjectView={(newValue) => {
                const newItems = [...userStars()!];
                newItems[i()] = newValue;
                mutate(newItems);
              }}
            />
          )}
        </For>
      </Show>
      <Show when={userStars.state === 'errored'}>
        <ErrorMessage>{userStars.error}</ErrorMessage>
      </Show>
    </>
  );
};

export default UserStarsSection;
