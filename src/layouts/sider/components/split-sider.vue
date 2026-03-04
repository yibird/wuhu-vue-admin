<template>
  <div class="h-full flex border-r-1 border-r-solid border-r-[#f2f2f2]">
    <div
      class="w-72 flex flex-col gap-10 border-r-1 border-r-[#f5f5f5] overflow-hidden"
    >
      <Logo collapsed />
      <n-scrollbar class="flex-1" content-class="flex flex-col gap-10">
        <div
          v-for="item in menus"
          :key="item.id"
          :class="[
            'sider-menu-item',
            {
              'is-active': String(rootId) === String(item.id),
            },
          ]"
          @click="onClickMenu(item)"
        >
          <div v-if="item.icon" class="mb-6 text-center">
            <Icon :name="item.icon" :size="20" />
          </div>
          <div class="text-xs text-center truncate">{{ item.title }}</div>
        </div>
      </n-scrollbar>
    </div>
    <n-layout-sider
      :width="240"
      :collapsed="sider.collapsed"
      :collapsed-width="0"
      collapsible
      class="overflow-hidden"
    >
      <div class="py-8 border-b-1 border-b-solid border-[#f5f5f5]">
        <Search />
      </div>
      <AppMenu :items="childMenus" />
    </n-layout-sider>
  </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { appStore } from '@/store'
import { getFirstBranch } from '@/utils'
import { useTabs } from '@/composables'
import { AppMenu } from '@/components'
import Logo from './logo.vue'
import Search from './search.vue'

import type { IMenu } from '#/config'

const { sider } = storeToRefs(appStore())
const { menus, openTab, currentTab } = useTabs()

const rootId = computed(() => currentTab.value?.rootId)

const childMenus = computed(() => {
  return menus.value.find((item) => item.id === rootId.value)?.children ?? []
})

const onClickMenu = (item: IMenu) => {
  if (sider.value.collapsed) {
    sider.value.collapsed = !sider.value.collapsed
  }
  const nodes = getFirstBranch(item.children ?? [])
  const node = nodes.at(-1)
  if (!node) return
  openTab(String(node.id))
}
</script>


<style lang="less" scoped>
.sider-menu-item {
  margin: 0 6px;
  padding: 8px 5px;
  background-color: #f5f5f5;
  box-sizing: border-box;
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;
  user-select: none;
  transition: all 0.3s;
  &:hover {
    background: #000;
    color: #fff;
  }
  &.is-active {
    background: #000;
    color: #fff;
    &::before {
      height: 8px;
      width: 8px;
      border-radius: 50%;
      background-color: #fff;
    }
  }
}
</style>
