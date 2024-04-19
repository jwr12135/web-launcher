import {Component, Show, createSignal} from 'solid-js';
import {LoginSection} from '~/pages/account/LoginPage';
import {Button} from '~/components/ui/Button';
import * as api from '~/api/api';
import {authStatusResource} from '~/api/globalResources';
import {ErrorMessage} from '~/components/ui/ErrorMessage';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/Select';
import {loadSpace, storage} from '~/app/storage';

const SourcetabSettings: Component = () => {
  const [authStatus, {mutate}] = authStatusResource;

  const [error, setError] = createSignal('');

  return (
    <>
      <Select
        value={storage.space}
        onChange={(value) => {
          if (value) loadSpace(value);
        }}
        options={Object.keys(storage.spaces).sort()}
        placeholder='Switch current space'
        itemComponent={(props) => (
          <SelectItem item={props.item}>
            {storage.spaces[props.item.rawValue].name} ({props.item.rawValue})
          </SelectItem>
        )}
      >
        <SelectTrigger class='w-[180px]'>
          <SelectValue<string>>
            {(state) => storage.spaces[state.selectedOption()].name}
          </SelectValue>
        </SelectTrigger>
        <SelectContent />
      </Select>

      <Show
        when={
          authStatus.state !== 'ready' || authStatus().user.role === 'GUEST'
        }
        fallback={
          <>
            <div>Logged in as {authStatus()!.user.username}</div>
            <br />
            <div>
              <Button
                onClick={async () => {
                  try {
                    const newUser = await api.authLogout();
                    mutate({
                      ...authStatus()!,
                      user: newUser.user,
                    });
                    setError('');
                  } catch (error) {
                    setError(String(error));
                  }
                }}
              >
                Logout
              </Button>
            </div>
          </>
        }
      >
        <LoginSection />
      </Show>
      <Show when={error}>
        <ErrorMessage class='py-2'>{error()}</ErrorMessage>
      </Show>
    </>
  );
};

export default SourcetabSettings;
