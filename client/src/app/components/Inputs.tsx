import {Icon} from '@iconify-icon/solid';
import {
  Button as KButton,
  TextField as KTextField,
  Select as KSelect,
} from '@kobalte/core';
import {ParentComponent, Show, splitProps} from 'solid-js';

const Text: ParentComponent<
  {onReset?: () => void; allowReset?: boolean} & KTextField.TextFieldInputProps
> = (props) => {
  const [local, other] = splitProps(props, [
    'children',
    'class',
    'onReset',
    'allowReset',
  ]);

  return (
    <KTextField.Root class='flex flex-col my-3'>
      <KTextField.Label class='text-sm font-medium select-none pb-1'>
        {local.children}
      </KTextField.Label>
      <div class='inline-flex'>
        <KTextField.Input
          class={
            'grow px-3 py-2 outline-none bg-white border-2 border-slate-300 hover:border-slate-400 focus:border-sky-500 duration-100 text-slate-950 rounded-md ' +
            (local.onReset ? 'rounded-r-none ' : '') +
            String(local.class)
          }
          {...other}
        />
        <Show when={local.onReset}>
          <KButton.Root
            disabled={!local.allowReset}
            class='rounded-r-md border-2 border-l-0 border-slate-300 flex'
          >
            <Icon
              icon='material-symbols:refresh'
              width={24}
              height={24}
              class={
                'p-2 ' +
                (local.allowReset ? 'text-slate-600' : 'text-slate-300')
              }
            />
          </KButton.Root>
        </Show>
      </div>
    </KTextField.Root>
  );
};

const Select: ParentComponent<
  {
    class?: string;
    onReset?: () => void;
    allowReset?: boolean;
  } & KSelect.SelectRootProps<any>
> = (props) => {
  const [local, other] = splitProps(props, [
    'children',
    'class',
    'onReset',
    'allowReset',
  ]);

  return (
    <KSelect.Root
      options={['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple']}
      placeholder='Select a fruit…'
      itemComponent={(props) => (
        <KSelect.Item
          item={props.item}
          class='flex px-3 py-1 w-full rounded hover:bg-slate-200'
        >
          <KSelect.ItemLabel>{props.item.rawValue}</KSelect.ItemLabel>
          <KSelect.ItemIndicator class='select__item-indicator'>
            <Icon
              icon='material-symbols:check'
              width={24}
              height={24}
              class='pr-2 text-slate-500'
            />
          </KSelect.ItemIndicator>
        </KSelect.Item>
      )}
    >
      <div class='flex flex-col my-3'>
        <KSelect.Label class='text-sm font-medium select-none pb-1'>
          {local.children}
        </KSelect.Label>
        <div class='inline-flex'>
          <KSelect.Trigger
            class={
              'grow inline-flex items-center justify-between px-3 py-2 outline-none bg-white border-2 border-slate-300 hover:border-slate-400 focus:border-sky-500 duration-100 text-slate-950 rounded-md ' +
              (local.onReset ? 'rounded-r-none ' : '') +
              String(local.class)
            }
            aria-label='Fruit'
          >
            <KSelect.Value class='text-ellipsis whitespace-nowrap overflow-hidden'>
              {(state) => state.selectedOption()}
            </KSelect.Value>
            <KSelect.Icon class='basis-5'>
              <Icon
                width={20}
                height={20}
                icon='material-symbols:arrow-drop-down'
                class='pr-2 text-slate-500'
              />
            </KSelect.Icon>
          </KSelect.Trigger>
          <Show when={local.onReset}>
            <KButton.Root
              disabled={!local.allowReset}
              class='rounded-r-md border-2 border-l-0 border-slate-300 flex'
            >
              <Icon
                icon='material-symbols:refresh'
                width={24}
                height={24}
                class={
                  'p-2 ' +
                  (local.allowReset ? 'text-slate-600' : 'text-slate-300')
                }
              />
            </KButton.Root>
          </Show>
        </div>
      </div>
      <KSelect.Portal>
        <KSelect.Content class='z-50 bg-white rounded-md border border-slate-500 shadow-md origin-[var(--kb-select-content-transform-origin)]'>
          <KSelect.Listbox class='overflow-y-auto max-h-96 p-2' />
        </KSelect.Content>
      </KSelect.Portal>
    </KSelect.Root>
  );
};

const Inputs = {Text, Select};

export default Inputs;
