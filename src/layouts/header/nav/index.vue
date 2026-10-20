<template>
  <div
    v-if="show"
    class="relative h-50 pr-10 flex items-center justify-between overflow-hidden"
  >
    <Collapsed />
    <Breadcrumb />
  </div>
  <Menu v-else />
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store'
import { MENU_MODE } from '@/constants'
import type { MenuMode as MenuModeValue } from '@/constants'
import Collapsed from './collapsed.vue'
import Breadcrumb from './breadcrumb.vue'
import Menu from './menu.vue'

const { app } = useAppStore()

const show = computed(() => {
  const modes: MenuModeValue[] = [MENU_MODE.Vertical, MENU_MODE.Split]
  return modes.includes(app.value.menuMode)
})
</script>
