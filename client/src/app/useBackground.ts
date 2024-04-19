import useStorageFile from '~/app/storage/useStorageFile';

function useBackground() {
  const resolveFile = useStorageFile();

  return (background: Background) => {
    switch (background[0]) {
      case 'color': {
        return `#${background[1]}`;
      }
      case 'gradient': {
        return `linear-gradient(${background[1]}deg,#${background[2]} 0%,#${background[3]} 100%)`;
      }
      case 'image': {
        return `no-repeat center / cover url('${resolveFile(background[1])}')`;
      }
    }
  };
}

export default useBackground;
