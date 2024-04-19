import {Component} from 'solid-js';
import {Title} from '~/components/Title';
import Background from './Background';
import Renderer from './renderer';
import {storage, useSpace} from './storage';

const InnerApp: Component = () => {
  const [space] = useSpace();

  return (
    <>
      <Title>{space.tabs[space.selected].name}</Title>
      <Background />
      <Renderer />
    </>
  );
};

const App: Component = () => {
  return <>{storage.date && useSpace()[2] && <InnerApp />}</>;
};

export default App;
