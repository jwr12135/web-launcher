import {batch, createSignal} from 'solid-js';
import {createStore, produce} from 'solid-js/store';
import * as presets from '~/app/presets';
import * as api from '~/api/api';
import {deepmerge, genId} from '../utils';
import parseStorageData from './parseStorageData';
import {storageGet, storageListen, storageSet} from './storageInterface';
import {defaultSettings} from './defaultSettings';

const key = 'sourcetab';
const spaceKey = key + '-space-';

/* @ts-expect-error */
const [rawStorage, setRawStorage] = createStore<Config>();
const [rawSpace, setRawSpace] = createStore<Space>();

(async () => {
  const v = await storageGet<Config>(key);

  const newValue = parseStorageData(v);
  let spaceData: Space;

  if (newValue) {
    setRawStorage(newValue);
    loadSpace(newValue.space);
  } else {
    const spaceId = genId();
    const tabId = genId();
    const groupId = genId();

    const data: Config = {
      sourcetab: VERSION,
      date: Date.now(),
      user: {},
      space: spaceId,
      spaces: {
        [spaceId]: {
          name: 'Main',
        },
      },
      files: {},
    };

    spaceData = {
      name: 'Main',
      selected: tabId,
      order: [tabId],
      tabs: {
        [tabId]: {
          name: 'Main',
          icon: '',
          groups: [groupId],
        },
      },
      groups: {
        [groupId]: {
          name: 'Main',
          collapsed: false,
          widgets: [],
        },
      },
      widgets: {},
    };
    for (const link of [
      'amazon',
      'google',
      'github',
      'netflix',
      'wikipedia',
      'youtube',
    ]) {
      const widgetId = genId();
      spaceData.groups[groupId].widgets.push(widgetId);
      spaceData.widgets[widgetId] = presets.widgets[link];
    }
    storageSet(spaceKey + spaceId, spaceData);
    storageSet(key, data);
    setRawStorage(data);
    setRawSpace(spaceData);
  }
})();

storageListen<Config>(key, (value) => {
  if (value.date > rawStorage.date) setRawStorage(value);
});

export const useSpace = () => {
  return [
    rawSpace,
    (fn) =>
      setStorage((state) => {
        fn(state.spaces[state.space]);
      }),
  ];
};

export const useTabSettings: () => [
  DeepRequired<Settings>,
  (newValue: Settings) => void,
  Settings,
] = () => {
  const space = deepmerge(
    {
      name: '',
      widgets: {},
      settings: deepmerge(defaultSettings, rawStorage.user.settings),
    },
    rawSpace,
  ) as DeepRequired<Space>;

  space.settings.theme.widget.fontFamily ??= space.settings.theme.fontFamily;
  space.settings.theme.widget.labelFont.family ??=
    space.settings.theme.fontFamily;
  space.settings.theme.widgetHover = deepmerge(
    space.settings.theme.widget,
    space.settings.theme.widgetHover,
  );

  return [
    space,
    (fn) =>
      setStorage((state) => {
        fn(state.spaces[state.space]);
      }),
    rawSpace()!,
  ];
};

export {rawStorage as storage};
export const setStorage = (fn: (state: Config) => void) => {
  console.log('prev', rawStorage.date);
  batch(() => {
    setRawStorage(produce(fn));
    setRawStorage('date', Date.now());
  });
  console.log('next', rawStorage.date);
  storageSet(key, rawStorage);
};

export async function loadSpace(id: string) {
  let space: Space;
  if (id.startsWith('@')) {
    space = (await api.projectGet(Number.parseInt(id, 10))).project
      .data as unknown as Space;
  } else {
    space = await storageGet<Space>(spaceKey + id);
  }

  setRawSpace(space);
}
