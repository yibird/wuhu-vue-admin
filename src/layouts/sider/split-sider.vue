<template>
  <div
    class="relative flex h-full overflow-visible shadow-[var(--w-sider-shadow)] border-r-1 border-solid border-r-[rgb(var(--w-sider-border-color))] z-[var(--w-sider-z-index)]"
  >
    <div
      class="flex flex-col w-78 overflow-hidden bg-[rgb(var(--w-sider-bg))] border-r-1 border-solid border-r-[rgb(var(--w-border-color-2))]"
    >
      <Logo
        collapsed
        class="border-b-1 border-solid border-b-[rgb(var(--w-border-color-2))]"
      />
      <div class="flex-1 py-10 flex flex-col gap-10">
        <div
          v-for="item in menus"
          :key="item.id"
          :data-active="rootId === item.id"
          :class="[
            'group relative mx-8 cursor-pointer select-none rounded-6 px-5 py-10 text-center outline-none transition-[color,background-color,box-shadow,transform] duration-motion-moderate ease-motion-enter before:(pointer-events-none absolute -left-8 top-1/2 h-18 w-4 -translate-x-3 -translate-y-1/2 scale-y-40 rounded-r-4 bg-primary opacity-0 content-empty transition-[opacity,transform] duration-motion-moderate ease-motion-enter) data-[active=true]:before:(translate-x-0 scale-y-100 opacity-100) hover:(-translate-y-1 bg-primary/10 text-primary) active:(translate-y-0 scale-96) motion-reduce:(transform-none transition-none) motion-reduce:before:transition-none',
            rootId === item.id
              ? 'bg-primary/10 text-primary'
              : 'text-[rgb(var(--w-sider-item-color))] bg-[rgb(var(--w-sider-item-bg))]',
          ]"
          @click="onClickMenu(item)"
        >
          <div
            v-if="item.icon"
            class="mb-6 text-center transition-[filter,transform] duration-motion-moderate ease-motion-enter group-hover:scale-110 motion-reduce:(transform-none transition-none)"
            :class="{
              '-translate-y-1 scale-105 [filter:drop-shadow(0_3px_6px_rgb(var(--w-color-primary)_/_20%))]':
                rootId === item.id,
            }"
          >
            <Icon :name="item.icon" :size="20" />
          </div>
          <div class="text-xs text-center truncate">{{ item.title }}</div>
        </div>
      </div>
    </div>
    <a-layout-sider
      :collapsed="sider.collapsed"
      :width="sider.width"
      :collapsed-width="0"
      :theme="siderTheme"
      data-testid="layout-sider"
      @update:collapsed="setCollapsed"
    >
      <div
        v-if="sider.showSearch"
        class="h-50 flex items-center justify-center border-b-1 border-solid border-b-[rgb(var(--w-sider-border-color))]"
      >
        <Search />
      </div>
      <Menu :items="activeRootMenuChildren" :theme="siderTheme" />
    </a-layout-sider>
  </div>
</template>
<script lang="ts" setup>
import { firstLeafPath } from '@zhouchengfeng/okay'
import { useAppStore, usePermissionStore } from '@/store'
import { useTabs } from '@/hooks'
import { ThemeMode } from '@/constants'
import { useTheme } from '@/theme'
import { useMenu } from '@/layouts/hooks'
import { Menu, Logo, Search } from './components'

import type { IMenu } from '#/config'

const { sider, setCollapsed } = useAppStore()
const { menus } = usePermissionStore()
const { openTab, currentTab } = useTabs()
const { activeRootMenuChildren } = useMenu()
const { themeMode } = useTheme()

const rootId = computed(() => currentTab.value?.rootId)
const siderTheme = computed(() =>
  themeMode.value === ThemeMode.Dark ? 'dark' : 'light'
)

const onClickMenu = (item: IMenu) => {
  if (sider.value.collapsed) {
    setCollapsed(false)
  }
  const nodes = firstLeafPath(item.children ?? [])
  const node = nodes.at(-1)
  if (!node) return
  openTab(node.id)
}
</script>
