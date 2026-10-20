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
import { MENU_MODE } from '@/constants'
import { renderIcon, renderMenus } from '@/utils'
import { useTabs } from '@/hooks'
import { useMenu } from '@/layouts/hooks'
import type { MenuProps } from 'antdv-next'

const { app } = useAppStore()
const { menus } = usePermissionStore()
const { openTab, currentTab } = useTabs()
const { activeRootMenuId, setPreviewRootMenuId } = useMenu()
const selectedKeys = ref<string[]>([])

const options = computed(() => {
  const items =
    app.value.menuMode === MENU_MODE.Horizontal
      ? menus.value
      : menus.value.map((item) => ({ ...item, children: undefined }))
  return renderMenus(
    items,
    (item) => ({
      key: item.id,
      label: h(
        'span',
        {
          class: 'inline-block align-middle',
        },
        item.title
      ),
      title: item.title,
      disabled: item.disabled,
      icon: renderIcon(item.icon, { size: 20 }),
    }),
    // 仅目录(type 1)/菜单(type 2)参与头部菜单渲染,子页面与权限按钮不展示
    (item) => [1, 2].includes(item.type)
  )
})

const onClick: MenuProps['onClick'] = ({ key }) => {
  if (app.value.menuMode === MENU_MODE.Horizontal) {
    openTab(key)
    return
  }

  if (app.value.menuMode === MENU_MODE.Mix) {
    setPreviewRootMenuId(key)
  }
}

watch(
  [() => currentTab.value, () => app.value.menuMode],
  ([val, mode]) => {
    if (!val) return
    if (mode === MENU_MODE.Horizontal) {
      selectedKeys.value = val.menuId ? [val.menuId] : []
    }

    if (mode === MENU_MODE.Mix) {
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
    if (app.value.menuMode !== MENU_MODE.Mix) return
    selectedKeys.value = id ? [id] : []
  },
  { immediate: true }
)
</script>
