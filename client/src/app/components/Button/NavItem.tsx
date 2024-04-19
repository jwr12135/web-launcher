import {Icon} from '@iconify-icon/solid';
import {Button} from '@kobalte/core';
import {ParentComponent, splitProps} from 'solid-js';

const NavItem: ParentComponent<
  {icon?: string; iconClass?: string} & Button.ButtonRootProps
> = (props) => {
  const [local, other] = splitProps(props, ['class', 'icon', 'iconClass']);

  return (
    <Button.Root
      class={
        'flex px-4 py-2 w-full rounded hover:bg-slate-200 ' +
        String(local.class)
      }
      {...other}
    >
      {local.icon ? (
        <Icon
          icon={local.icon}
          width={24}
          height={24}
          class={'pr-2 text-slate-500 ' + String(local.iconClass)}
        />
      ) : undefined}
      {props.children}
    </Button.Root>
  );
};

export default NavItem;
