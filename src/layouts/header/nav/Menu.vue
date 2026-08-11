<template>
  <a-menu
    v-model:selected-keys="selectedKeys"
    :items="options"
    mode="horizontal"
    @click="onClick"
    class="layout-menu-horizontal min-w-0 flex-auto overflow-hidden"
  />
</template>
<script lang="ts" setup>
import { computed, h, ref, watch } from 'vue'
import { useAppStore, usePermissionStore } from '@/store'
import { prefetchMenuRoute } from '@/router'
import { MenuMode } from '@/constants'
import { renderIcon, renderMenus } from '@/utils'
import { useTabs } from '@/composables'
import { useMenuSelection } from '@/layouts/menu'

import type { MenuProps } from 'antdv-next'

const { app } = useAppStore()
const { menus } = usePermissionStore()
const { openTab, currentTab } = useTabs()
const { activeRootMenuId, setPreviewRootMenuId } = useMenuSelection()
const selectedKeys = ref<string[]>([])

const options = computed(() => {
  const items =
    app.value.menuMode === MenuMode.Horizontal
      ? menus.value
      : menus.value.map((item) => ({ ...item, children: undefined }))
  return renderMenus(items, (item) => ({
    key: String(item.id),
    label: h(
      'span',
      {
        class: 'inline-block align-middle',
        onFocusin: () => void prefetchMenuRoute(item),
        onPointerenter: () => void prefetchMenuRoute(item),
      },
      item.title
    ),
    title: item.title,
    disabled: item.disabled,
    icon: renderIcon(item.icon, { size: 20 }),
  }))
})

const onClick: MenuProps['onClick'] = ({ key }) => {
  const menuKey = String(key)
  if (app.value.menuMode === MenuMode.Horizontal) {
    openTab(menuKey)
    return
  }

  if (app.value.menuMode === MenuMode.Mix) {
    setPreviewRootMenuId(menuKey)
  }
}

watch(
  [() => currentTab.value, () => app.value.menuMode],
  ([val, mode]) => {
    if (!val) return
    if (mode === MenuMode.Horizontal) {
      selectedKeys.value = [String(val.id ?? val.name)]
    }

    if (mode === MenuMode.Mix) {
      selectedKeys.value = activeRootMenuId.value
        ? [activeRootMenuId.value]
        : []
    }
  },
  { immediate: true }
)

watch(
  activeRootMenuId,
  (id) => {
    if (app.value.menuMode !== MenuMode.Mix) return
    selectedKeys.value = id ? [id] : []
  },
  { immediate: true }
)
</script>
