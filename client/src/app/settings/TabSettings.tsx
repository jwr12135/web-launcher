import {Component, For, Show, createSignal} from 'solid-js';
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
import {loadSpace, storage, useSpace} from '~/app/storage';
import {Icon} from '~/components/ui/Icon';

const TabSettings: Component = () => {
  const [space, setSpace] = useSpace();

  return (
    <>
      <div class='pb-3 text-right'>
        <Button>Create tab</Button>
      </div>
      <For each={space.order}>
        {(tabId) => (
          <div class='pb-3 flex items-center'>
            <span class='grow'>{space.tabs[tabId].name}</span>
            <Button size='icon' variant='ghost'>
              <Icon icon='material-symbols:arrow-upward' />
            </Button>
            <Button size='icon' variant='ghost'>
              <Icon icon='material-symbols:arrow-downward' />
            </Button>
            <Button
              size='icon'
              variant='destructive'
              onClick={() => {
                setSpace();
              }}
            >
              <Icon icon='material-symbols:delete' />
            </Button>
          </div>
        )}
      </For>
    </>
  );
};

export default TabSettings;
