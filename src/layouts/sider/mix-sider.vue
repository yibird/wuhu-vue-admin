<template>
  <a-layout-sider
    :width="sider.width"
    collapsible
    :collapsed="sider.collapsed"
    :collapsed-width="sider.collapsedWidth"
    :theme="siderTheme"
    class="layout-sider-mix"
    data-testid="layout-sider"
    @update:collapsed="setCollapsed"
  >
    <div class="flex flex-col overflow-hidden">
      <div v-if="sider.showSearch" class="py-10">
        <Search :collapsed="sider.collapsed" />
      </div>
      <Menu :items="items" :collapsed="sider.collapsed" :theme="siderTheme" />
    </div>
  </a-layout-sider>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store'
import { ThemeMode } from '@/constants'
import { useTheme } from '@/theme'
import { useMenu } from '@/layouts/hooks'
import { Menu, Search } from './components'

const { sider, setCollapsed } = useAppStore()
const { activeRootMenuChildren: items } = useMenu()
const { themeMode } = useTheme()

const siderTheme = computed(() =>
  themeMode.value === ThemeMode.Dark ? 'dark' : 'light'
)
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
