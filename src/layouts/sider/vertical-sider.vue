<template>
  <a-layout-sider
    :width="sider.width"
    :collapsed="sider.collapsed"
    :collapsed-width="sider.collapsedWidth"
    :theme="siderTheme"
    class="w-layout-sider"
    @update:collapsed="setCollapsed"
  >
    <div class="h-full flex flex-col">
      <Logo :collapsed="sider.collapsed" />
      <Search
        v-if="sider.showSearch"
        v-model:value="searchValue"
        :collapsed="sider.collapsed"
      />
      <Menu :items="items" :collapsed="sider.collapsed" :theme="siderTheme" />
    </div>
  </a-layout-sider>
</template>
<script lang="ts" setup>
import { useAppStore, usePermissionStore } from '@/store'
import { THEME_MODE } from '@/constants'
import { useTheme } from '@/theme'
import { Menu, Logo, Search, matchesMenuTree } from './components'

const { sider, setCollapsed } = useAppStore()
const { menus } = usePermissionStore()
const { themeMode } = useTheme()
const searchValue = shallowRef('')

const siderTheme = computed(() =>
  themeMode.value === THEME_MODE.Dark ? THEME_MODE.Dark : THEME_MODE.Light
)

const items = computed(() => {
  const v = searchValue.value.trim().toLowerCase()
  if (!v) return menus.value
  return menus.value.filter((item) => matchesMenuTree(item, v))
})
</script>
<style scoped>
.w-layout-sider {
  z-index: var(--w-sider-z-index);
  box-shadow: var(--w-sider-vertical-shadow);
}
</style>
