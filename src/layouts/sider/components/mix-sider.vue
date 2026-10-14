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
    <div v-if="sider.showSearch" class="py-10">
      <Search :collapsed="sider.collapsed" />
    </div>
    <Scrollbar class="flex-1" content-class="pb-2">
      <AppMenu
        :items="items"
        :collapsed="sider.collapsed"
        :theme="siderTheme"
      />
    </Scrollbar>
  </a-layout-sider>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store'
import { AppMenu } from '@/layouts/menu'
import { ThemeMode } from '@/constants'
import { useTheme } from '@/theme'
import { Scrollbar } from '@/components/scrollbar'
import { useMenu } from '@/layouts/hooks'
import Search from './search/index.vue'

defineOptions({ name: 'MixSider' })

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
