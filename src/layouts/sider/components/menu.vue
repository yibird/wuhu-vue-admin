<template>
  <Scrollbar class="flex-1">
    <a-menu
      :selected-keys="selectedKeys"
      :open-keys="menuOpenKeys"
      :inline-collapsed="inlineCollapsed"
      :items="items"
      :mode="mode"
      :theme="theme"
      @open-change="onOpenChange"
      @click="onClick"
      class="border-none!"
    />
  </Scrollbar>
</template>
<script lang="ts" setup>
import { useTabs } from '@/hooks'
import { Scrollbar } from '@/components/scrollbar'
import { renderIcon, renderMenus } from '@/utils'
import type { MenuProps } from './types'
import type { IMenu } from '#/config'

const { currentTab, openTab } = useTabs()

const props = withDefaults(defineProps<MenuProps>(), {
  items: () => [],
  collapsed: false,
  mode: 'inline',
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
    // 目录(type 1)与菜单(type 2)参与侧边栏渲染,子页面(type 3)与权限按钮(type 4)不展示
    (item) => [1, 2].includes(item.type)
  )
})

const visibleMenuKeys = computed(() => {
  const keys = new Set<string>()

  const collectVisibleKeys = (menuItems: IMenu[]) => {
    for (const item of menuItems) {
      if ([1, 2].includes(item.type)) {
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
    openKeysOverride.value = val ? [...val] : undefined
  },
  { immediate: true }
)
</script>
