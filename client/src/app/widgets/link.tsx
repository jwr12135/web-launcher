import {Icon} from '@iconify-icon/solid';
import {Dynamic} from 'solid-js/web';
import {useSpace} from '../storage';

const link: Widget<{
  url: string;
  target: '_self' | '_blank';
  container: string;
  content: ['img' | 'ico' | 'let', string];
  scale: number;
}> = {
  name: 'Link',
  defaultOptions: {
    url: '',
    target: '_self',
    container: '',
    content: ['ico', ''],
    scale: 100,
  },
  exampleOptions: {
    url: 'https://www.wikipedia.org',
    target: '_self',
    container: '',
    content: ['ico', 'wikipedia'],
    scale: 100,
  },
  Component(props) {
    const [space] = useSpace();

    const options = () => props.options[0];
    const setOptions = () => props.options[1];
    const rawOptions = () => props.options[2];

    const target = () => rawOptions().target ?? space.settings.page.linkTarget;
    const container = () =>
      rawOptions().container ?? space.settings.page.linkContainer;

    const visual = () => (
      <Icon
        height={props.inToolbar ? 24 : '100%'}
        icon={options().content[1]}
        width={props.inToolbar ? 24 : '100%'}
        style={{
          transform: `scale(${
            options().scale * (props.inToolbar ? 0.01 : 0.007)
          })`,
        }}
      />
    );

    /*
    switch (options.content[0]) {
      case 'img': {
        visual = inToolbar ? (
          <SvgIcon
            sx={{
              transform: `scale(${data.scale * 0.0167})`,
              fill: `#${data.theme.default.color}`,
            }}
          >
            <image height="24" href={data.contentData} width="24" />
          </SvgIcon>
        ) : (
          <Box
            component="img"
            src={data.contentData}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              transform: `scale(${data.scale * 0.01})`,
            }}
          />
        );
        break;
      }
      case 'ico': {
        visual = (
          <Icon
            height={inToolbar ? 24 : '100%'}
            icon={options.content[1]}
            width={inToolbar ? 24 : '100%'}
            style={{
              transform: `scale(${options.scale * (inToolbar ? 0.01 : 0.007)})`,
            }}
          />
        );
        break;
      }
      case 'let': {
        visual = (
          <SvgIcon
            sx={{
              fill: `#${data.theme.default.color}`,
              ...(inToolbar
                ? { transform: `scale(1.67)` }
                : {
                    width: '100%',
                    height: '100%',
                  }),
            }}
          >
            <text
              dominantBaseline="middle"
              fontSize={data.scale * 0.14}
              fontWeight="bold"
              textAnchor="middle"
              x="12"
              y="12"
            >
              {data.contentData}
            </text>
          </SvgIcon>
        );
        break;
      }
      default: {
        break;
      }
    }
    */

    const anchorProps = () =>
      props.disabled
        ? {component: 'div'}
        : {
            component: 'a',
            href: options().url,
            target: target(),
          };

    return (
      <Dynamic
        {...anchorProps()}
        class='w-full h-full flex overflow-hidden text-inherit'
      >
        {visual()}
      </Dynamic>
    );
    // inToolbar ? (
    //   <Box
    //     sx={{
    //       // backgroundColor: `#${data.bgColor}`,
    //       borderRadius: '50%',
    //     }}
    //   >
    //     <IconButton sx={{ overflow: 'hidden' }} {...anchorProps}>
    //       {visual}
    //     </IconButton>
    //   </Box>
    // ) : (

    // );
  },
  Options() {
    return <></>;
  },
};

export default link;
