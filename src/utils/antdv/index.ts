import { h } from 'vue'
import { Icon, type IconProps } from '@/components/icon'
import type { IMenu } from '#/config'

/**
 * 动态渲染图标
 *
 * @param iconName icon name
 * @param props icon props
 * @returns Icon Node
 */
export function renderIcon(
  iconName?: string | null,
  props: Omit<IconProps, 'name'> = {}
) {
  if (!iconName) return
  return () => h(Icon, { ...props, name: iconName })
}

/**
 * 渲染菜单树
 *
 * @param menus 菜单树
 * @param mapper 映射函数
 * @param predicate  过滤条件
 * @returns 渲染后的菜单树
 */
export type RenderedMenuNode<T extends object> = T & {
  children?: RenderedMenuNode<T>[]
}

export function renderMenus<T extends object>(
  menus: IMenu[],
  mapper: (item: IMenu) => T,
  predicate?: (item: IMenu) => boolean
): RenderedMenuNode<T>[] {
  if (!predicate) {
    return menus.map((item) => ({
      ...mapper(item),
      children:
        item.children && item.children.length > 0
          ? renderMenus(item.children, mapper, predicate)
          : undefined,
    }))
  }

  const result: RenderedMenuNode<T>[] = []
  for (const node of menus) {
    const filteredChildren =
      node.children && node.children.length > 0
        ? renderMenus(node.children, mapper, predicate)
        : undefined
    const hasMatchingChildren = filteredChildren && filteredChildren.length > 0
    if (
      (typeof predicate === 'function' && predicate(node)) ||
      hasMatchingChildren
    ) {
      result.push({
        ...mapper(node),
        children: hasMatchingChildren ? filteredChildren : undefined,
      })
    }
  }
  return result
}

/**
 * 将菜单项列表转换为选项列表
 *
 * @param menus 菜单项列表
 * @returns 选项列表
 */
export function menusToOptions(menus: IMenu[] = []) {
  return renderMenus(menus, (item) => ({
    key: String(item.id),
    label: item.title,
    title: item.title,
    disabled: item.disabled,
    icon: renderIcon(item.icon),
  }))
}
