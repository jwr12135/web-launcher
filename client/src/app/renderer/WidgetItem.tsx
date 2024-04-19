import {Component} from 'solid-js';
import {Dynamic} from 'solid-js/web';
import useBackground from '~/app/useBackground';
import {deepmerge, themeCss} from '~/app/utils';
import widgets from '~/app/widgets';
import {cssVars} from '~/app/utils/cssVars';
import { useSpace } from '../storage';
import {root, rootHover, widget, label} from './WidgetItem.module.css';
import {editMode} from '.';

export interface WidgetItemProps {
  id: string;
  editMode?: boolean;
  rootProps?: any;
  innerProps?: any;
  inToolbar?: boolean;
}

const WidgetItem: Component<WidgetItemProps> = (props) => {
  const [ws, setWS, rawWS] = useSpace();
  const backgroundCss = useBackground();

  const Widget = () =>
    props.id.length < 4
      ? undefined
      : widgets[ws.widgets[props.id].type].Component;

  // const WidgetEditMenuElement =
  //   ws.settings.layout.dashboard.size < 90 ? WidgetEditMenuSmall : WidgetEditMenu;

  // const editMenu = (
  //   <WidgetEditMenuElement
  //     visible={editMode}
  //     {...{ onEdit, onDuplicate, onDelete }}
  //   />
  // );

  const widgetTheme = () =>
    deepmerge(ws.settings.theme.widget, ws.widgets[props.id].theme);
  const widgetThemeHover = () =>
    deepmerge(
      ws.settings.theme.widgetHover,
      deepmerge(
        ws.widgets[props.id]?.theme ?? {},
        ws.widgets[props.id]?.themeHover,
      ),
    );

  return (
    <div
      ref={props.ref}
      {...props.rootProps}
      classList={{
        [root]: true,
        [rootHover]: !editMode(),
      }}
      style={{
        'grid-column-end': `span  ${ws.widgets[props.id].size?.[0] ?? 1}`,
        'grid-row-end': `span  ${ws.widgets[props.id].size?.[1] ?? 1}`,
        ...cssVars({
          widget: {
            default: {
              root: {
                transition: `all ${
                  editMode() ? 0 : widgetTheme().transition.duration
                }ms`,
                transitionTimingFunction: widgetTheme().transition.function,
              },
              widget: {
                background: backgroundCss(widgetTheme().background) ?? '',
                borderRadius: `${widgetTheme().radius}px`,
                boxShadow: themeCss.boxShadow(widgetTheme().shadow),
                color: `#${widgetTheme().color}`,
                fontFamily: widgetTheme().fontFamily,
                transform: themeCss.transform(widgetTheme().transform),
              },
              label: {
                color: `#${widgetTheme().labelFont.color}`,
                fontFamily: widgetTheme().labelFont.family,
                fontSize: `${widgetTheme().labelFont.size}px`,
                fontStyle: widgetTheme().labelFont.italic ? 'italic' : 'normal',
                fontWeight: `${widgetTheme().labelFont.weight}`,
                textShadow: themeCss.textShadow(widgetTheme().labelShadow),
                transform: themeCss.transform(widgetTheme().labelTransform),
              },
            },
            hover: {
              root: {
                transition: `all ${
                  editMode() ? 0 : widgetThemeHover().transition.duration
                }ms`,
                transitionTimingFunction:
                  widgetThemeHover().transition.function,
              },
              widget: {
                background: backgroundCss(widgetThemeHover().background) ?? '',
                borderRadius: `${widgetThemeHover().radius}px`,
                boxShadow: themeCss.boxShadow(widgetThemeHover().shadow),
                color: `#${widgetThemeHover().color}`,
                fontFamily: widgetThemeHover().fontFamily,
                transform: themeCss.transform(widgetThemeHover().transform),
              },
              label: {
                color: `#${widgetThemeHover().labelFont.color}`,
                fontFamily: widgetThemeHover().labelFont.family,
                fontSize: `${widgetThemeHover().labelFont.size}px`,
                fontStyle: widgetThemeHover().labelFont.italic
                  ? 'italic'
                  : 'normal',
                fontWeight: `${widgetThemeHover().labelFont.weight}`,
                textShadow: themeCss.textShadow(widgetThemeHover().labelShadow),
                transform: themeCss.transform(
                  widgetThemeHover().labelTransform,
                ),
              },
            },
          },
        }),
      }}
    >
      <div
        {...props.innerProps}
        class={widget}
        style={{
          height: `${ws.settings.layout.dashboard.size}px`,
        }}
      >
        <Dynamic
          component={Widget()}
          disabled={editMode()}
          options={[
            deepmerge(
              widgets[ws.widgets[props.id].type].defaultOptions as any,
              ws.widgets[props.id].options,
            ),
            (arg) => {
              setWS((ws) => {
                arg(ws.widgets[props.id].options);
              });
            },
            rawWS.widgets[props.id],
          ]}
          theme={widgetTheme}
          themeHover={widgetThemeHover}
        />
      </div>
      <div class={label}>{ws.widgets[props.id].name}</div>
      {/* {editMenu} */}
    </div>
  );
};

export default WidgetItem;
