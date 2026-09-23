<template>
  <a-menu
    :selected-keys="selectedKeys"
    :open-keys="menuOpenKeys"
    :inline-collapsed="inlineCollapsed"
    :items="items"
    :mode="mode"
    :theme="theme"
    @open-change="onOpenChange"
    @click="onClick"
  />
</template>
<script lang="ts" setup>
import { useTabs } from '@/hooks'
import { renderIcon, renderMenus } from '@/utils'
import type { AppMenuProps } from './types'
import type { MenuProps } from 'antdv-next'
import type { IMenu } from '#/config'

const { currentTab, openTab } = useTabs()

const props = withDefaults(defineProps<AppMenuProps>(), {
  items: () => [],
  collapsed: false,
  mode: 'inline',
  expandedKeys: () => [],
})

/**
 * 用户手动展开/收起的子菜单,路由变化时恢复为路由推导
 */
const openKeysOverride = ref<string[]>()

const isInlineCollapsed = computed(
  () => props.mode === 'inline' && props.collapsed
)
const inlineCollapsed = computed(() =>
  props.mode === 'inline' ? props.collapsed : undefined
)
const theme = computed(() => props.theme)

const items = computed(() => {
  return renderMenus(
    props.items,
    (item) => {
      return {
        key: item.id,
        label: item.title,
        title: item.title,
        disabled: item.disabled,
        icon: renderIcon(item.icon, { size: 22 }),
      }
    },
    (item) => [0, 1].includes(item.type)
  )
})

const visibleMenuKeys = computed(() => {
  const keys = new Set<string>()

  const collectVisibleKeys = (menuItems: IMenu[]) => {
    for (const item of menuItems) {
      if ([0, 1].includes(item.type)) {
        keys.add(item.id)
      }
      if (item.children?.length) {
        collectVisibleKeys(item.children)
      }
    }
  }

  collectVisibleKeys(props.items ?? [])
  return keys
})

const activeMenuKey = computed(() => {
  const current = currentTab.value
  const routeKeys = [
    current?.menuId,
    ...(current?.level?.split('-').reverse() ?? []),
  ].filter((key): key is string => Boolean(key))
  return (
    routeKeys.find((key) => visibleMenuKeys.value.has(key)) ??
    (props.selectedKey && visibleMenuKeys.value.has(props.selectedKey)
      ? props.selectedKey
      : undefined)
  )
})

const selectedKeys = computed(() =>
  activeMenuKey.value ? [activeMenuKey.value] : []
)

const routeOpenKeys = computed(() => {
  const level = currentTab.value?.level
  if (!level) return []
  return level
    .split('-')
    .slice(0, -1)
    .filter((key) => visibleMenuKeys.value.has(key))
})

const openKeys = computed(() => openKeysOverride.value ?? routeOpenKeys.value)
const menuOpenKeys = computed(() =>
  isInlineCollapsed.value ? undefined : openKeys.value
)

const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
  if (isInlineCollapsed.value) return
  openKeysOverride.value = keys
}

const onClick: MenuProps['onClick'] = ({ key }) => {
  openTab(key)
  closeCollapsedPopup()
}

const closeCollapsedPopup = async () => {
  if (!isInlineCollapsed.value) return

  if (typeof document !== 'undefined') {
    ;(document.activeElement as HTMLElement | null)?.blur()
  }
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
  await nextTick()
}

watch(
  () => currentTab.value?.level,
  () => {
    openKeysOverride.value = undefined
  }
)

watch(
  () => props.expandedKeys,
  (val) => {
    openKeysOverride.value = val?.length ? [...val] : undefined
  }
)
</script>
