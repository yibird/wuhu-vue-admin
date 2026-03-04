<template>
  <n-layout-sider
    :width="sider.width"
    collapse-mode="width"
    :collapsed="sider.collapsed"
    :collapsed-width="sider.collapsedWidth"
    show-trigger="arrow-circle"
    class="layout-sider-mix"
    @update:collapsed="onCollapsed"
  >
    <div class="py-10">
      <Search />
    </div>
    <AppMenu
      :items="items"
      :collapsed="sider.collapsed"
      :collapsed-width="sider.collapsedWidth"
    />
  </n-layout-sider>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { AppMenu } from '@/components'
import { appStore, permissionStore } from '@/store'
import { emitter } from '@/utils'
import { Events } from '@/constant'

import Search from './search.vue'

const { sider } = storeToRefs(appStore())

const topMenuId = ref<string>()

const items = computed(() => {
  const flatMenus = permissionStore().flatMenus
  if (!topMenuId.value) return []
  return (
    flatMenus.find((item) => String(item.id) === topMenuId.value)?.children ??
    []
  )
})

emitter.on(Events.CHANGE_TOP_MENU_ID, (id) => {
  topMenuId.value = id
})

const onCollapsed = (collapsed: boolean) => {
  sider.value.collapsed = collapsed
}

// watch(
//   () => topMenu?.value,
//   (val) => {
//     if (!val) return
//     const node = getFirstBranch(val.children ?? []).at(-1)
//     if (!node) return
//     openTab(node)
//   },
//   { immediate: true }
// )
</script>
<style lang="css" scoped>
.layout-sider-mix {
  box-shadow: 8px 0 12px -6px rgba(0, 0, 0, 0.1);
  z-index: 10;
}
</style>
