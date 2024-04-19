import {storage} from '.';

function useStorageFile(): (file: string) => string {
  return (file: string) => storage.files[file] ?? file;
}

export default useStorageFile;
