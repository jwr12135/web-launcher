import {Component} from 'solid-js';
import {Button as KButton} from '@kobalte/core';

const Button: Component<KButton.ButtonRootProps> = (props) => {
  return <KButton.Root {...props} />;
};

export default Button;
