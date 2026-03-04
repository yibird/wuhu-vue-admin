<template>
  <n-layout-sider
    :width="240"
    :collapsed="sider.collapsed"
    :collapsed-width="sider.collapsedWidth"
    :content-style="getContentStyle"
    class="layout-sider-vertical"
  >
    <div class="h-full flex flex-col gap-10 overflow-hidden">
      <Logo />
      <Search
        v-model:value="searchValue"
        :collapsed="sider.collapsed"
        :collapsed-width="sider.collapsedWidth"
      />
      <n-scrollbar class="flex-1 overflow-hidden">
        <AppMenu
          :items="items"
          :collapsed="sider.collapsed"
          :collapsed-width="sider.collapsedWidth"
          @open="sider.collapsed = !sider.collapsed"
        />
      </n-scrollbar>
    </div>
  </n-layout-sider>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { appStore, permissionStore } from '@/store'
import { AppMenu } from '@/components'
import Logo from './logo.vue'
import Search from './search.vue'

const { sider } = storeToRefs(appStore())
const { menus } = storeToRefs(permissionStore())
const searchValue = ref('')

const items = computed(() => {
  const v = searchValue.value
  if (v.trim().length === 0) return menus.value
  return menus.value.filter((item) =>
    item.title.toLowerCase().includes(v.toLowerCase())
  )
})

const getContentStyle = computed(() => {
  const { collapsed, collapsedWidth, width } = sider.value
  const minWidth = collapsed ? `${collapsedWidth}px` : `${width}px`
  return {
    width: minWidth,
    minWidth,
    maxWidth: minWidth,
    overflow: 'hidden',
  }
})
</script>
<style lang="css" scoped>
.layout-sider-vertical {
  box-shadow: 8px 0 12px -6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  overflow: hidden;
}
</style>
