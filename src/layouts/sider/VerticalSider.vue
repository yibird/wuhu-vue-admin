<template>
  <a-layout-sider
    :width="sider.width"
    :collapsed="sider.collapsed"
    :collapsed-width="sider.collapsedWidth"
    :theme="siderTheme"
    class="layout-sider-vertical z-[var(--w-sider-z-index)] shadow-[var(--w-sider-vertical-shadow)]"
    @update:collapsed="setCollapsed"
  >
    <Logo :collapsed="sider.collapsed" />
    <Search
      :value="rawSearchValue"
      :collapsed="sider.collapsed"
      @update:value="onSearchInput"
    />
    <Scrollbar
      class="sider-menu-scrollbar flex-1 overflow-hidden mx-1 mb-2"
      content-class="pb-2"
    >
      <AppMenu
        :items="items"
        :collapsed="sider.collapsed"
        :theme="siderTheme"
        class="border-none"
      />
    </Scrollbar>
  </a-layout-sider>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useAppStore, usePermissionStore } from '@/store'
import { ThemeMode } from '@/constants'
import { useTheme } from '@/composables'
import { AppMenu } from '@/layouts/menu'
import Logo from './Logo.vue'
import Search from './Search.vue'

const { sider, setCollapsed } = useAppStore()
const { menus } = usePermissionStore()
const { themeMode } = useTheme()
const rawSearchValue = ref('')
const searchValue = ref('')

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
  return menus.value.filter(
    (item) =>
      item.title.toLowerCase().includes(v) ||
      item.children?.some((c) => c.title.toLowerCase().includes(v))
  )
})
</script>
