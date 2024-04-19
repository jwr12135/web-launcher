import {Component, For, createSignal} from 'solid-js';
import {Dynamic} from 'solid-js/web';
import NavItem from '~/app/components/Button/NavItem';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/Dialog';
import SourcetabSettings from './SourcetabSettings';
import TabSettings from './TabSettings';

const settingsNav = [
  {name: 'Sourcetab', icon: 'material-symbols:info', comp: SourcetabSettings},
  {name: 'Theme', icon: 'material-symbols:palette', comp: SourcetabSettings},
  {name: 'Layout', icon: 'material-symbols:dashboard', comp: SourcetabSettings},
  {name: 'Tabs', icon: 'material-symbols:tabs-outline', comp: TabSettings},
  {name: 'Data', icon: 'material-symbols:database', comp: SourcetabSettings},
];

const Settings: Component = (props) => {
  const [active, setActive] = createSignal(0);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Settings</DialogTitle>
      </DialogHeader>
      <div class='flex'>
        <ul class='inline-flex flex-col mr-3'>
          <For each={settingsNav}>
            {(settingsNavConfig, i) => (
              <li>
                <NavItem
                  icon={settingsNavConfig.icon}
                  {...(i() === active()
                    ? {class: 'text-sky-700', iconClass: 'text-sky-700'}
                    : {})}
                  onClick={() => setActive(i())}
                >
                  {settingsNavConfig.name}
                </NavItem>
              </li>
            )}
          </For>
        </ul>
        <div class='w-full'>
          <Dynamic component={settingsNav[active()].comp} />
        </div>
      </div>
    </DialogContent>
  );
};

export default Settings;
