import { h } from 'vue'
import { Icon, type IconProps } from '@/components'
import type { IMenu } from '#/config'

export function renderIcon(
  iconName?: string | null,
  props: Omit<IconProps, 'name'> = {}
) {
  if (!iconName) return
  return () => h(Icon, { ...props, name: iconName })
}

/**
 * 渲染菜单树
 * @param menus 菜单树
 * @param mapper 映射函数
 * @param predicate  过滤条件
 * @returns 渲染后的菜单树
 */
export function renderMenus<T>(
  menus: IMenu[],
  mapper?: (item: IMenu) => Partial<T>,
  predicate?: (item: IMenu) => boolean
): T[] {
  if (!predicate) {
    return menus.map((item) => ({
      ...mapper?.(item),
      children:
        item.children && item.children.length > 0
          ? renderMenus(item.children, mapper, predicate)
          : undefined,
    })) as unknown as T[]
  }

  const result: T[] = []
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
        ...mapper?.(node),
        children: hasMatchingChildren ? filteredChildren : undefined,
      } as unknown as T)
    }
  }
  return result
}

export function menusToOptions(menus: IMenu[] = []) {
  return renderMenus(menus, (item) => ({
    key: String(item.id),
    label: item.title,
    title: item.title,
    disabled: item.disabled,
    icon: renderIcon(item.icon),
  }))
}
