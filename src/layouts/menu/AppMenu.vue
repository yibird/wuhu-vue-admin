<template>
  <a-menu
    :key="menuKey"
    v-model:selected-keys="innerSelectedKeys"
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
import { useTabs } from '@/composables'
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
const innerSelectedKeys = ref<string[]>(
  props.selectedKey ? [props.selectedKey] : []
)
const innerOpenKeys = ref<string[]>(props.expandedKeys)
const menuKey = ref(0)

const isInlineCollapsed = computed(
  () => props.mode === 'inline' && props.collapsed
)
const inlineCollapsed = computed(() =>
  props.mode === 'inline' ? props.collapsed : undefined
)
const menuOpenKeys = computed(() =>
  isInlineCollapsed.value ? undefined : innerOpenKeys.value
)
const theme = computed(() => props.theme)

const items = computed(() => {
  return renderMenus(
    props.items,
    (item) => {
      return {
        key: String(item.id),
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
        keys.add(String(item.id))
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
    current?.id === undefined ? undefined : String(current.id),
    ...(current?.level?.split('-').reverse() ?? []),
  ].filter((key): key is string => Boolean(key))
  return (
    routeKeys.find((key) => visibleMenuKeys.value.has(key)) ??
    (props.selectedKey && visibleMenuKeys.value.has(props.selectedKey)
      ? props.selectedKey
      : undefined)
  )
})

const onOpenChange: MenuProps['onOpenChange'] = (openKeys) => {
  if (isInlineCollapsed.value) return
  innerOpenKeys.value = openKeys.map(String)
}

const onClick: MenuProps['onClick'] = ({ key }) => {
  openTab(String(key))
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
  () => props.selectedKey,
  (val) => {
    if (!currentTab.value) {
      innerSelectedKeys.value = val ? [val] : []
    }
  }
)

watch(
  () => props.expandedKeys,
  (val) => {
    innerOpenKeys.value = val
  }
)

watch(
  [() => currentTab.value?.id, () => currentTab.value?.level, activeMenuKey],
  ([, level, selectedKey]) => {
    innerOpenKeys.value = level
      ? level
          .split('-')
          .slice(0, -1)
          .filter((key) => visibleMenuKeys.value.has(key))
      : []
    innerSelectedKeys.value = selectedKey ? [selectedKey] : []
  },
  { immediate: true }
)
</script>
