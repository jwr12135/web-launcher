import {Component, For, Show, createResource} from 'solid-js';
import * as api from '~/api/api';
import {ErrorMessage} from '~/components/ui/ErrorMessage';
import ProjectItem from '../project/ProjectItem';

const UserProjectsSection: Component<{username: string}> = (props) => {
  const [userProjects, {mutate}] = createResource(
    () => ({
      createdBy: props.username,
    }),
    api.projectList,
  );

  return (
    <>
      <Show when={userProjects.state === 'ready'}>
        <For each={userProjects()}>
          {(projectView, i) => (
            <ProjectItem
              projectView={projectView}
              setProjectView={(newValue) => {
                const newItems = [...userProjects()!];
                newItems[i()] = newValue;
                mutate(newItems);
              }}
            />
          )}
        </For>
      </Show>
      <Show when={userProjects.state === 'errored'}>
        <ErrorMessage>{userProjects.error}</ErrorMessage>
      </Show>
    </>
  );
};

export default UserProjectsSection;
