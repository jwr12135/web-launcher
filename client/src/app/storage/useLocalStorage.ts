import {Accessor, createSignal, onCleanup, onMount} from 'solid-js';
import {
  storageGet,
  storageListen,
  storageRemove,
  storageSet,
} from './storageInterface';

export function useLocalStorage<T>(
  key: string,
): [Accessor<T | undefined>, (newValue: T) => void, {remove: () => void}] {
  const [signal, setSignal] = createSignal<T>();

  let cleanupFunc = () => {};

  onMount(async () => {
    const value = await storageGet(key);
    if (value) {
      setSignal(value);
    }

    cleanupFunc = storageListen(key, (newValue) => {
      setSignal(newValue);
    });
  });

  onCleanup(() => {
    cleanupFunc();
  });

  return [
    signal,
    (newValue: T) => {
      setSignal(newValue);
      storageSet(key, newValue);
    },
    {
      remove() {
        storageRemove(key);
      },
    },
  ];
}
