import {Component, createSignal, For, ParentComponent} from 'solid-js';
import {Dynamic} from 'solid-js/web';
import useBackground from '~/app/useBackground';
import {themeCss} from '~/app/utils';
import Settings from '~/app/settings';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemIcon,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/DropdownMenu';
import {Button} from '~/components/ui/Button';
import {Icon} from '~/components/ui/Icon';
import {Dialog} from '~/components/ui/Dialog';
import {useSpace} from '../storage';
import {DefaultWidgetContainer} from './WidgetContainer';

export const [widgetsDialog, setWidgetsDialog] = createSignal(false);
export const [settingsDialog, setSettingsDialog] = createSignal(false);
export const [editMode, setEditMode] = createSignal(false);
export const [editDialog, setEditDialog] = createSignal('');

const ToolbarSeparator: Component = () => <span style={{'flex-grow': 0.5}} />;

const DefaultWidgetContext: ParentComponent = (props) => <>{props.children}</>;

const Renderer: Component = () => {
  const [space] = useSpace();

  const background = useBackground();

  const CurrentWidgetContext = () =>
    // editMode() && dnd ? dnd.SortableWidgetContext :
    DefaultWidgetContext;
  const CurrentWidgetContainer = () =>
    // editMode() && dnd ? dnd.SortableWidgetContainer :
    DefaultWidgetContainer;

  const [settingsOpen, setSettingsOpen] = createSignal(false);

  return (
    <div
      class='flex h-full'
      style={{
        'flex-direction':
          space.settings.layout.toolbar.position === 'top'
            ? 'column'
            : 'column-reverse',
      }}
    >
      <Dynamic component={CurrentWidgetContext()}>
        <div
          class='text-center flex min-h-[64px] w-full'
          style={{
            background: background(space.settings.theme.toolbar.background),
            margin: `${space.settings.layout.toolbar.margin}px`,
            'border-radius': `${space.settings.theme.toolbar.radius}px`,
            'box-shadow': themeCss.boxShadow(
              space.settings.theme.toolbar.shadow,
            ),
            padding: `${space.settings.layout.toolbar.padding}px`,
          }}
        >
          {/* <Dynamic component={CurrentWidgetContainer()} inToolbar id='tl' /> */}
          <ToolbarSeparator />
          {/* <Dynamic component={CurrentWidgetContainer()} inToolbar id='tc' /> */}
          <ToolbarSeparator />
          {/* <Dynamic component={CurrentWidgetContainer()} inToolbar id='tr' /> */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                size='icon'
                variant='ghost'
                class='text-white hover:text-white hover:bg-accent/50'
              >
                <Icon icon='material-symbols:menu' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <DropdownMenuItemIcon icon='material-symbols:widgets' />
                Widgets
              </DropdownMenuItem>
              <DropdownMenuItem>
                <DropdownMenuItemIcon icon='material-symbols:edit' />
                Edit Mode
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                <DropdownMenuItemIcon icon='material-symbols:settings' />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem as='a' href='/explore'>
                <DropdownMenuItemIcon icon='material-symbols:explore' />
                Explore
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Tabs</DropdownMenuLabel>
              <For each={space.order}>
                {(tabId) => (
                  <DropdownMenuItem>
                    <DropdownMenuItemIcon icon={space.tabs[tabId].icon} />
                    {space.tabs[tabId].name}
                  </DropdownMenuItem>
                )}
              </For>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <For each={space.tabs[space.selected].groups}>
          {(groupId) => (
            <div
              style={{
                padding: `${space.settings.layout.dashboard.margin}px`,
              }}
            >
              <div>{space.groups[groupId].name}</div>
              <div
                class='grow grid justify-center align-middle overflow-auto relative'
                style={{
                  'grid-template-columns': `repeat(${
                    space.settings.layout.dashboard.columns || 'auto-fill'
                  }, ${space.settings.layout.dashboard.size}px)`,
                  'grid-gap': `${space.settings.layout.dashboard.gap}px`,
                }}
              >
                <Dynamic component={CurrentWidgetContainer()} id={groupId} />
              </div>
            </div>
          )}
        </For>
      </Dynamic>
      {/* <WidgetsDialog
        open={widgetsDialog}
        setOpen={setWidgetsDialog}
        setEditDialog={(newValue) => {
          setEditMode(true);
          setEditDialog(newValue);
        }}
      />
      <SettingsDialog
        {...{
          settingsDialog,
          setSettingsDialog,
        }}
      /> */}
      {/* <WidgetEditDialog {...{ editDialog, setEditDialog }} /> */}
      <Dialog
        open={settingsOpen()}
        onOpenChange={(isOpen) => setSettingsOpen(isOpen)}
      >
        <Settings />
      </Dialog>
    </div>
  );
};

export default Renderer;
