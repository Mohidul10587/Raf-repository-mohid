import { ReactEventHandler } from 'react';

export interface IIconProps {
  className?: string;
  size?: number;
  color?: string;
  onClick?: ReactEventHandler;
}

export const ICON_DEFAULT_COLORS: any = {
  white: '#FFF',
  black: '#000',
  primary: '#03A688',
  warning: '#F2C94C',
  blue: '#2081E2',
  purple: '#BB6BD9',
  gray: '#7A849F',
};
