import {Component, JSX} from 'solid-js';
import useStorageFile from '~/app/storage/useStorageFile';
import {useSpace} from '../storage';

const Background: Component = () => {
  const [space] = useSpace();
  const resolveFile = useStorageFile();

  const background = () => {
    let backgroundElement: JSX.Element;

    switch (space.settings.theme.background[0]) {
      case 'color': {
        backgroundElement = (
          <div
            class='fixed w-full h-full pointer-events-none -z-10'
            style={{
              'background-color': `#${space.settings.theme.background[1]}`,
            }}
          />
        );
        break;
      }
      case 'gradient': {
        backgroundElement = (
          <div
            class='fixed w-full h-full pointer-events-none -z-10'
            style={{
              background: `linear-gradient(${space.settings.theme.background[1]}deg,#${space.settings.theme.background[2]} 0%,#${space.settings.theme.background[3]} 100%)`,
            }}
          />
        );
        break;
      }

      case 'image': {
        backgroundElement = (
          <img
            class='fixed w-full h-full pointer-events-none -z-10'
            alt=''
            src={resolveFile(space.settings.theme.background[1])}
            style={{'object-fit': 'cover'}}
          />
        );
        break;
      }
      case 'video': {
        backgroundElement = (
          <video
            class='fixed w-full h-full pointer-events-none -z-10'
            loop
            muted
            src={resolveFile(space.settings.theme.background[1])}
            style={{'object-fit': 'cover'}}
          />
        );
        break;
      }
      case 'iframe': {
        backgroundElement = (
          <iframe
            class='fixed w-full h-full pointer-events-none -z-10'
            allow='accelerometer;autoplay;encrypted-media;gyroscope'
            src={resolveFile(space.settings.theme.background[1])}
            tabIndex={-1}
          />
        );
        break;
      }
      case 'youtube': {
        backgroundElement = (
          <iframe
            class='fixed w-full h-full pointer-events-none -z-10'
            allow='accelerometer;autoplay;encrypted-media;gyroscope'
            tabIndex={-1}
            src={`https://www.youtube.com/embed/${space.settings.theme.background[1]}?autoplay=1&controls=0&loop=1`}
          />
        );
        break;
      }
      default: {
        backgroundElement = <></>;
        break;
      }
    }

    return backgroundElement;
  };

  return background();
};

export default Background;
