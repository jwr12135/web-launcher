import {Component, Show, createSignal} from 'solid-js';
import Inputs from '~/app/components/Inputs';
import {Button} from '~/components/ui/Button';
import * as api from '~/api/api';
import {authStatusResource} from '~/api/globalResources';
import {ErrorMessage} from '~/components/ui/ErrorMessage';
import {Title} from '~/components/Title';

export const LoginSection: Component = () => {
  const [status, {mutate}] = authStatusResource;

  const [username, setUsername] = createSignal('');
  const [password, setPassword] = createSignal('');

  const [error, setError] = createSignal('');

  return (
    <Show
      when={status.state !== 'ready' || status().user.role === 'GUEST'}
      fallback={<>Logged in as {status()!.user.username}</>}
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            setError('');
            const result = await api.authLogin(username(), password());
            mutate(result);
          } catch (error) {
            setError(String(error));
          }
        }}
      >
        <Inputs.Text
          value={username()}
          onChange={(e) => setUsername(e.target.value)}
        >
          Username
        </Inputs.Text>
        <Inputs.Text
          type='password'
          value={password()}
          onChange={(e) => setPassword(e.target.value)}
        >
          Password
        </Inputs.Text>
        <div class='flex my-2'>
          <ErrorMessage class='grow'>{error()}</ErrorMessage>
          <Button type='submit'>Login</Button>
        </div>
      </form>
    </Show>
  );
};

const LoginPage: Component = () => {
  return (
    <>
      <Title>Login</Title>
      <LoginSection />
    </>
  );
};

export default LoginPage;
