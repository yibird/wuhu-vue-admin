import type { RouteLocation, NavigationGuardNext, RouteRecordRaw, RouteMeta } from 'vue-router';
import type { defineComponent } from 'vue';
import { RoleEnum } from '/@/enums/roleEnum';

export type Component<T extends any = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>);

// @ts-ignore
export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
  title?: string;
  name?: string;
  meta?: RouteMeta;
  component?: Component | string;
  components?: Component;
  children?: AppRouteRecordRaw[];
  props?: Recordable;
  fullPath?: string;
}

export interface BeforeGuardPrams {
  to: RouteLocation;
  from: RouteLocation;
  next: NavigationGuardNext;
}
export type AfterGuardParams = Pick<BeforeGuardPrams, 'to' | 'from'>;

export interface MenuTag {
  type?: 'primary' | 'error' | 'warn' | 'success';
  content?: string;
  dot?: boolean;
}

export interface Menu {
  // 菜单项Id
  id: number;
  // 菜单名称
  name: string;
  // 0目录、1菜单、2权限按钮
  type: number;
  // 当前菜单项父菜单Id
  parent_id?: number | null;
  // 路由Path
  path: string;
  // 父级层级路径,以'-'分割父级id
  levelPath: string;
  // 菜单路径参数
  paramPath?: string;
  // 菜单Icon
  icon?: string;
  // 子菜单数组
  children?: Menu[];
  // 是否默认选中激活当前菜单
  defaultActive?: boolean;
  // 是否禁用菜单
  disabled?: boolean;
  // 是否隐藏菜单
  hidden?: boolean;
  // 排序序号
  orderNo?: number;
  // 菜单角色
  roles?: RoleEnum[];
  // 菜单路由元信息
  meta?: Partial<RouteMeta>;
  // 菜单标签
  tag?: MenuTag;
}
