import {Component, Show, createEffect, createResource} from 'solid-js';
import {useNavigate, useParams} from '@solidjs/router';
import * as api from '~/api/api';
import {ErrorMessage} from '~/components/ui/ErrorMessage';

const UserRedirectPage: Component = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [user] = createResource(
    () => Number.parseInt(params.id, 10),
    api.userGet,
  );

  createEffect(() => {
    if (user.state === 'ready') {
      navigate('/@' + user().username);
    }
  });

  return (
    <>
      <Show when={user.state === 'errored'}>
        <ErrorMessage>{user.error}</ErrorMessage>
      </Show>
    </>
  );
};

export default UserRedirectPage;
