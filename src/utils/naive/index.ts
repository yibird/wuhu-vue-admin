import { h } from 'vue';
import { Icon, type IconProps } from '@/components';
import type { IMenu } from '#/config';
import type { MenuOption } from 'naive-ui';

/**
 * 渲染icon
 * @param iconName icon名称
 * @param props icon组件props
 * @returns 返回渲染后的icon组件
 */
export function renderIcon(iconName?: string | null, props: Omit<IconProps, 'name'> = {}) {
  if (!iconName) return;
  return () => {
    return h(Icon, {
      ...props,
      name: iconName,
    });
  };
}

/**
 * 渲染菜单
 * @param menus 菜单数组
 * @param mapper 映射函数
 * @returns 渲染后的菜单数组(MenuOption[])
 */
export function renderMenus<T extends MenuOption = MenuOption>(
  menus: IMenu[],
  mapper?: (item: IMenu) => Partial<T>,
  predicate?: (item: IMenu) => boolean,
): T[] {
  // 如果没有过滤条件，直接进行映射
  if (!predicate) {
    return menus.map((item) => ({
      ...item,
      ...mapper?.(item),
      children: item.children ? renderMenus(item.children, mapper, predicate) : undefined,
    })) as unknown as T[];
  }

  const filterMenuTree = (nodes: IMenu[]): T[] => {
    const result: T[] = [];
    for (const node of nodes) {
      // 先处理子节点，避免不必要的映射
      let filteredChildren: T[] | undefined;
      if (node.children && node.children.length > 0) {
        filteredChildren = filterMenuTree(node.children);
      }

      // 如果当前节点匹配或者有子节点匹配，则保留该节点
      const isCurrentNodeMatch = predicate(node);
      const hasMatchingChildren = filteredChildren && filteredChildren.length > 0;

      if (isCurrentNodeMatch || hasMatchingChildren) {
        const mappedNode = {
          ...node,
          ...mapper?.(node),
          children: hasMatchingChildren ? filteredChildren : undefined,
        } as unknown as T;
        result.push(mappedNode);
      }
    }
    return result;
  };

  return filterMenuTree(menus);
}

export function menusToOptions(menus: IMenu[] = []) {
  return renderMenus(menus, (item) => ({
    key: item.id,
    label: item.title,
    icon: renderIcon(item.icon),
  }));
}
