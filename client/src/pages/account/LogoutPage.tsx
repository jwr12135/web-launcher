import {Component, createSignal, onMount, Show} from 'solid-js';
import {useNavigate} from '@solidjs/router';
import * as api from '~/api/api';
import {authStatusResource} from '~/api/globalResources';
import {Title} from '~/components/Title';

const LogoutPage: Component = () => {
  const [authStatus, {mutate}] = authStatusResource;

  const navigate = useNavigate();

  const [error, setError] = createSignal('');

  onMount(async () => {
    try {
      const newUser = await api.authLogout();
      mutate({
        ...authStatus()!,
        user: newUser.user,
      });
      navigate('/login');
    } catch (error) {
      setError(String(error));
    }
  });

  return (
    <>
      <Title>Logout</Title>
      Logging out...
      <Show when={error}>
        <div class='py-2 text-red-500'>{error()}</div>
      </Show>
    </>
  );
};

export default LogoutPage;
