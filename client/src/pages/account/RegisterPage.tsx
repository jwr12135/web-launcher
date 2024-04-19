import {Component, Show, createSignal} from 'solid-js';
import {useNavigate, useParams, useSearchParams} from '@solidjs/router';
import Inputs from '~/app/components/Inputs';
import {Button} from '~/components/ui/Button';
import * as api from '~/api/api';
import {authStatusResource} from '~/api/globalResources';
import {ErrorMessage} from '~/components/ui/ErrorMessage';
import {CardTitle} from '~/components/ui/Card';
import {Title} from '~/components/Title';

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
            try {
              setError('');
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
          >
            Username
          </Inputs.Text>
          <Inputs.Text
            type='email'
            value={email()}
            onChange={(e) => setEmail(e.target.value)}
          >
            Email
          </Inputs.Text>
          <Inputs.Text
            type='password'
            value={password()}
            onChange={(e) => setPassword(e.target.value)}
          >
            Password
          </Inputs.Text>
          <Inputs.Text
            type='password'
            value={confirmPassword()}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
