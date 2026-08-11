<template>
  <div
    :class="[
      'relative flex h-full overflow-visible shadow-[var(--w-sider-shadow)] border-r-1 border-solid border-r-[rgb(var(--w-sider-border-color))] z-[var(--w-sider-z-index)]',
      `split-sider-${siderTheme}`,
    ]"
  >
    <div
      class="flex flex-col w-78 overflow-hidden bg-[rgb(var(--w-sider-bg))] border-r-1 border-solid border-r-[rgb(var(--w-border-color-2))]"
    >
      <Logo
        collapsed
        class="border-b-1 border-solid border-b-[rgb(var(--w-border-color-2))]"
      />
      <Scrollbar
        class="flex-1 overflow-hidden"
        content-class="flex flex-col gap-10 py-10"
      >
        <div
          v-for="item in menus"
          :key="item.id"
          :class="[
            'relative box-border py-10 px-5 mx-8 text-center cursor-pointer select-none rounded-6 transition-[transform,colors,background-color] active:scale-90 hover:text-[rgb(var(--w-color-primary))] hover:bg-[rgb(var(--w-color-primary)_/_5%)]',
            String(rootId) === String(item.id)
              ? 'text-[rgb(var(--w-color-primary))] bg-[rgb(var(--w-color-primary)_/_10%)] before:content-empty before:absolute before:top-1/2 before:-left-8 before:w-4 before:h-18 before:bg-[rgb(var(--w-color-primary))] before:rounded-r-4 before:-translate-y-1/2'
              : 'text-[rgb(var(--w-sider-item-color))] bg-[rgb(var(--w-sider-item-bg))]',
          ]"
          @click="onClickMenu(item)"
        >
          <div v-if="item.icon" class="mb-6 text-center">
            <Icon :name="item.icon" :size="20" />
          </div>
          <div class="text-xs text-center truncate">{{ item.title }}</div>
        </div>
      </Scrollbar>
    </div>
    <a-layout-sider
      :collapsed="sider.collapsed"
      :width="sider.width"
      :collapsed-width="0"
      :theme="siderTheme"
      class="[&_.ant-layout-sider-children]:flex [&_.ant-layout-sider-children]:flex-col [&_.ant-layout-sider-children]:h-full [&_.ant-layout-sider-children]:overflow-hidden"
      data-testid="layout-sider"
      @update:collapsed="setCollapsed"
    >
      <div
        class="h-50 flex items-center justify-center border-b-1 border-solid border-b-[rgb(var(--w-sider-border-color))]"
      >
        <Search />
      </div>
      <Scrollbar class="flex-1 overflow-hidden" content-class="pb-2">
        <AppMenu :items="childMenus" :theme="siderTheme" class="border-none" />
      </Scrollbar>
    </a-layout-sider>
  </div>
</template>
<script lang="ts" setup>
import { firstLeafPath } from '@zhouchengfeng/okay'
import { useAppStore } from '@/store'
import { useTabs } from '@/composables'
import { AppMenu } from '@/layouts/menu'
import { ThemeMode } from '@/constants'
import { useTheme } from '@/composables'
import Logo from './Logo.vue'
import Search from './Search.vue'

import type { IMenu } from '#/config'

const { sider, setCollapsed } = useAppStore()
const { menus, openTab, currentTab } = useTabs()
const { themeMode } = useTheme()

const rootId = computed(() => currentTab.value?.rootId)
const siderTheme = computed(() =>
  themeMode.value === ThemeMode.Dark ? 'dark' : 'light'
)

const childMenus = computed(() => {
  return menus.value.find((item) => item.id === rootId.value)?.children ?? []
})

const onClickMenu = (item: IMenu) => {
  if (sider.value.collapsed) {
    setCollapsed(false)
  }
  const nodes = firstLeafPath(item.children ?? [])
  const node = nodes.at(-1)
  if (!node) return
  openTab(String(node.id))
}
</script>
