import {Icon} from '@iconify-icon/solid';
import {Dialog as KDialog} from '@kobalte/core';
import {ParentComponent, splitProps} from 'solid-js';

const Dialog: ParentComponent<{title: string} & KDialog.DialogRootProps> = (
  props,
) => {
  const [local, others] = splitProps(props, ['title']);

  return (
    <KDialog.Root {...others}>
      <KDialog.Portal>
        <KDialog.Overlay class='fixed inset-0 z-50 bg-black bg-opacity-20' />
        <div class='fixed inset-0 z-50 flex items-center justify-center'>
          <KDialog.Content class='z-50 w-full max-w-[min(calc(100vw-16px),500px)] border rounded-md p-4 bg-white shadow-lg'>
            <div class='flex items-baseline justify-between mb-3'>
              <KDialog.Title class='text-xl font-medium'>
                {local.title}
              </KDialog.Title>
              <KDialog.CloseButton class='dialog__close-button'>
                <Icon
                  icon='material-symbols:close'
                  width={24}
                  height={24}
                  class='pr-2 text-slate-500'
                />
              </KDialog.CloseButton>
            </div>
            {props.children}
          </KDialog.Content>
        </div>
      </KDialog.Portal>
    </KDialog.Root>
  );
};

export default Dialog;
