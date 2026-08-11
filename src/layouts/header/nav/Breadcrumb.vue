<template>
  <div v-if="header.showBreadcrumb" class="mx-10 hidden min-w-0 md:block">
    <a-breadcrumb>
      <a-breadcrumb-item v-for="(item, index) in items" :key="item.id">
        <a-dropdown
          v-if="item.children && item.children.length > 0"
          :menu="{ items: dropdownMenus[index] }"
          @menu-click="onSelect"
        >
          <div class="max-w-140 flex items-center gap-4 truncate">
            <Icon
              v-if="header.showBreadCrumbIcon && item.icon"
              :name="item.icon"
              :size="14"
              class="shrink-0"
            />
            <span class="truncate">{{ item.title }}</span>
          </div>
        </a-dropdown>
        <div v-else class="max-w-140 flex items-center gap-4 truncate">
          <Icon
            v-if="header.showBreadCrumbIcon && item.icon"
            :name="item.icon"
            :size="14"
            class="shrink-0"
          />
          <span class="truncate">{{ item.title }}</span>
        </div>
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { findPath } from '@zhouchengfeng/okay'
import { useTabs } from '@/composables'
import { useAppStore, usePermissionStore } from '@/store'
import { menusToOptions } from '@/utils'

const { header } = useAppStore()
const { menus } = usePermissionStore()
const { currentTab, openTab } = useTabs()

const items = computed(() => {
  if (!currentTab.value) return []
  return findPath(menus.value, currentTab.value.name)
})

const dropdownMenus = computed(() => {
  return items.value.map((item) => {
    if (item.children && item.children.length > 0) {
      return menusToOptions(item.children)
    }
    return []
  })
})

const onSelect = ({ key }: { key: string | number }) => {
  openTab(String(key))
}
</script>
