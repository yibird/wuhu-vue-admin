<template>
  <a-layout-sider
    :width="sider.width"
    collapse-mode="width"
    :collapsed="sider.collapsed"
    :collapsed-width="sider.collapsedWidth"
    :theme="siderTheme"
    show-trigger="arrow-circle"
    class="layout-sider-mix"
    data-testid="layout-sider"
    @update:collapsed="setCollapsed"
  >
    <div class="py-10">
      <Search :collapsed="sider.collapsed" />
    </div>
    <Scrollbar class="flex-1 overflow-hidden" content-class="pb-2">
      <AppMenu
        :items="items"
        :collapsed="sider.collapsed"
        :theme="siderTheme"
      />
    </Scrollbar>
  </a-layout-sider>
</template>
<script lang="ts" setup>
import { permissionStore, useAppStore } from '@/store'
import { AppMenu } from '@/layouts/menu'
import { ThemeMode } from '@/constants'
import { useTheme } from '@/theme'
import { Scrollbar } from '@/components'
import { useMenu } from '@/layouts/hooks'
import Search from './search/index.vue'

const { sider, setCollapsed } = useAppStore()
const { activeRootMenuId } = useMenu()
const { themeMode } = useTheme()

const siderTheme = computed(() =>
  themeMode.value === ThemeMode.Dark ? 'dark' : 'light'
)

const items = computed(() => {
  const { menuCache } = permissionStore()
  if (!activeRootMenuId.value) return []
  return Reflect.get(menuCache.idMap, activeRootMenuId.value).children ?? []
})
</script>
<style scoped>
.layout-sider-mix {
  z-index: var(--w-sider-z-index);
  box-shadow: var(--w-sider-shadow);
}

.layout-sider-mix :deep(.ant-layout-sider-children) {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
</style>
