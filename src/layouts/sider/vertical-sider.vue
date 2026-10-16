<template>
  <a-layout-sider
    :width="sider.width"
    :collapsed="sider.collapsed"
    :collapsed-width="sider.collapsedWidth"
    :theme="siderTheme"
    class="z-[var(--w-sider-z-index)] shadow-[var(--w-sider-vertical-shadow)]"
    @update:collapsed="setCollapsed"
  >
    <div class="h-full flex flex-col">
      <Logo :collapsed="sider.collapsed" />
      <Search
        v-if="sider.showSearch"
        :value="rawSearchValue"
        :collapsed="sider.collapsed"
        @update:value="onSearchInput"
      />
      <Menu :items="items" :collapsed="sider.collapsed" :theme="siderTheme" />
    </div>
  </a-layout-sider>
</template>
<script lang="ts" setup>
import { useDebounceFn } from '@vueuse/core'
import { useAppStore, usePermissionStore } from '@/store'
import { ThemeMode } from '@/constants'
import { useTheme } from '@/theme'
import { Menu, Logo, Search, matchesMenuTree } from './components'

const { sider, setCollapsed } = useAppStore()
const { menus } = usePermissionStore()
const { themeMode } = useTheme()
const rawSearchValue = shallowRef('')
const searchValue = shallowRef('')

const debouncedUpdate = useDebounceFn(() => {
  searchValue.value = rawSearchValue.value
}, 200)

const onSearchInput = (value: string) => {
  rawSearchValue.value = value
  debouncedUpdate()
}

const siderTheme = computed(() =>
  themeMode.value === ThemeMode.Dark ? 'dark' : 'light'
)

const items = computed(() => {
  const v = searchValue.value.trim().toLowerCase()
  if (!v) return menus.value
  return menus.value.filter((item) => matchesMenuTree(item, v))
})
</script>
