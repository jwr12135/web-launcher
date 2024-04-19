import {Component, For, Show, createEffect, createResource} from 'solid-js';
import {useParams} from '@solidjs/router';
import * as api from '~/api/api';
import {ErrorMessage} from '~/components/ui/ErrorMessage';
import {Title} from '~/components/Title';
import {NotFoundPage} from '../NotFoundPage';
import ProjectItem from './ProjectItem';

const ProjectPage: Component = () => {
  const params = useParams();

  const [projectView, {mutate, refetch}] = createResource(
    () => Number.parseInt(params.id, 10),
    api.projectGet,
  );

  return (
    <>
      <Show when={projectView.state === 'ready'}>
        <Title>{projectView()!.project.name}</Title>
        <ProjectItem
          projectView={projectView()!}
          setProjectView={(newValue) => {
            mutate(newValue);
          }}
        />
      </Show>
      <Show when={projectView.state === 'errored'}>
        <Show
          when={String(projectView.error) === 'Error: 404 Not Found'}
          fallback={<ErrorMessage>{projectView.error}</ErrorMessage>}
        >
          <NotFoundPage />
        </Show>
      </Show>
    </>
  );
};

export default ProjectPage;
