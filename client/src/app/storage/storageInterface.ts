export async function storageGet<T>(key: string): Promise<T> {
  return new Promise((resolve) => {
    switch (PLATFORM) {
      case 'WEB': {
        resolve(JSON.parse(localStorage.getItem(key)!));
        break;
      }

      case 'CHROME': {
        chrome.storage.local.get(key, (result) => resolve(result[key]));
        break;
      }

      case 'FIREFOX': {
        browser.storage.local.get(key).then((result) => resolve(result[key]));
        break;
      }

      default: {
        break;
      }
    }
  });
}

export function storageSet<T>(key: string, value: T) {
  switch (PLATFORM) {
    case 'WEB': {
      localStorage.setItem(key, JSON.stringify(value));
      break;
    }

    case 'CHROME': {
      chrome.storage.local.set({[key]: value});
      break;
    }

    case 'FIREFOX': {
      browser.storage.local.set({[key]: value});
      break;
    }

    default: {
      break;
    }
  }
}

export function storageListen<T>(key: string, callback: (value: T) => void) {
  switch (PLATFORM) {
    case 'WEB': {
      const listener = (e: StorageEvent): void => {
        if (e.key === key) callback(JSON.parse(e.newValue!));
      };

      window.addEventListener('storage', listener);
      return () => window.removeEventListener('storage', listener);
    }

    case 'CHROME': {
      const listener = (
        changes: Record<string, chrome.storage.StorageChange>,
        areaName: string,
      ): void => {
        if (areaName === 'local' && Object.keys(changes).includes(key))
          callback(changes[key].newValue);
      };

      chrome.storage.onChanged.addListener(listener);
      return () => chrome.storage.onChanged.removeListener(listener);
    }

    case 'FIREFOX': {
      const listener = (
        changes: Record<string, browser.storage.StorageChange>,
        areaName: string,
      ): void => {
        if (areaName === 'local' && Object.keys(changes).includes(key))
          callback(changes[key].newValue);
      };

      browser.storage.onChanged.addListener(listener);
      return () => browser.storage.onChanged.removeListener(listener);
    }
  }
}

export function storageRemove(key: string) {
  switch (PLATFORM) {
    case 'WEB': {
      localStorage.removeItem(key);
      break;
    }

    case 'CHROME': {
      chrome.storage.local.remove(key);
      break;
    }

    case 'FIREFOX': {
      browser.storage.local.remove(key);
      break;
    }
  }
}
