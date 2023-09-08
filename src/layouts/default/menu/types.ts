import type { MenuItemProps } from 'ant-design-vue';
import { Menu } from '/@/router/types';

export interface MenuItem extends MenuItemProps {
  path: string;
  option: Menu;
}

export interface MenuOption {
  openKeys: string[];
  selectedKeys: string[];
}

export interface ClickHandleParams {
  item: MenuItem;
  key: number | string;
  keyPath: number[] | string[];
}
