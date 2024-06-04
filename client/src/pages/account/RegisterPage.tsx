import {Component, Show, createSignal} from 'solid-js';
import {useNavigate, useParams, useSearchParams} from '@solidjs/router';
import Inputs from '~/app/components/Inputs';
import {Button} from '~/components/ui/Button';
import * as api from '~/api/api';
import {authStatusResource} from '~/api/globalResources';
import {ErrorMessage} from '~/components/ui/ErrorMessage';
import {CardTitle} from '~/components/ui/Card';
import {Title} from '~/components/Title';
import {regexpUsernameStrict} from '~/utils/utils';

const RegisterPage: Component = () => {
  const [status] = authStatusResource;

  const [username, setUsername] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [confirmPassword, setConfirmPassword] = createSignal('');

  const [error, setError] = createSignal('');

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const adminCode = () => searchParams.admin;

  return (
    <>
      <Title>Register</Title>
      <Show
        when={status.state !== 'ready' || status().user.role === 'GUEST'}
        fallback={<>Logged in as {status()!.user.username}</>}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            setError('');

            try {
              if (!regexpUsernameStrict.test(username())) {
                throw new Error(
                  'Username must be 4-32 characters and contain only letters, numbers, and underscores',
                );
              }

              if (password().length < 8) {
                throw new Error('Password must be at least 8 characters');
              }

              if (password() !== confirmPassword()) {
                throw new Error("Confirm password doesn't match");
              }

              await api.authRegister(
                username(),
                email(),
                password(),
                adminCode(),
              );
              navigate('/login');
            } catch (error) {
              setError(String(error));
            }
          }}
        >
          <CardTitle>Register{adminCode() ? ' Admin' : ''}</CardTitle>
          <br />
          <Inputs.Text
            value={username()}
            onChange={(e) => setUsername(e.target.value)}
            required
          >
            Username
          </Inputs.Text>
          <Inputs.Text
            type='email'
            value={email()}
            onChange={(e) => setEmail(e.target.value)}
            required
          >
            Email
          </Inputs.Text>
          <Inputs.Text
            type='password'
            value={password()}
            onChange={(e) => setPassword(e.target.value)}
            required
          >
            Password
          </Inputs.Text>
          <Inputs.Text
            type='password'
            value={confirmPassword()}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          >
            Confirm Password
          </Inputs.Text>
          <div class='flex my-2'>
            <ErrorMessage class='grow'>{error()}</ErrorMessage>
            <Button type='submit'>Register</Button>
          </div>
        </form>
      </Show>
    </>
  );
};

export default RegisterPage;
