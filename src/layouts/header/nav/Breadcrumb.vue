<template>
  <div v-if="header.showBreadcrumb" class="mx-10">
    <n-breadcrumb>
      <n-breadcrumb-item v-for="item in items">
        <n-dropdown :options="menusToOptions(item.children)" @select="onSelect">
          <div class="flex items-center gap-4">
            <Icon
              v-if="header.showBreadCrumbIcon && item.icon"
              :name="item.icon"
              :size="14"
            />
            <span>{{ item.title }}</span>
          </div>
        </n-dropdown>
      </n-breadcrumb-item>
    </n-breadcrumb>
  </div>
</template>
<script lang="ts" setup>
import { useTabs } from '@/composables'
import { appStore, permissionStore } from '@/store'
import { menusToOptions } from '@/utils'
import { getParentNodes } from 'okay-core'

const { header } = appStore()
const { menus } = permissionStore()
const { currentTab, openTab } = useTabs()

const items = computed(() => {
  if (!currentTab.value) return []
  return getParentNodes(menus, currentTab.value.name)
})

const onSelect = (key: string | number) => {
  openTab(String(key))
}
</script>
