<template>
  <div
    v-if="showNav"
    class="relative h-50 pr-10 flex items-center justify-between overflow-hidden"
  >
    <Collapsed />
    <Breadcrumb />
  </div>
  <Menu v-else />
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store'
import { MenuMode, type MenuModeType } from '@/constants'
import Collapsed from './Collapsed.vue'
import Breadcrumb from './Breadcrumb.vue'
import Menu from './Menu.vue'

const { app } = useAppStore()

const showNav = computed(() => {
  const modes = [MenuMode.Vertical, MenuMode.Split] as MenuModeType[]
  return modes.includes(app.value.menuMode)
})
</script>
