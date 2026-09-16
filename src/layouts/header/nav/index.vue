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
import { MenuMode } from '@/constants'
import type { MenuMode as MenuModeValue } from '@/config'
import Collapsed from './Collapsed.vue'
import Breadcrumb from './Breadcrumb.vue'
import Menu from './Menu.vue'

const { app } = useAppStore()

const showNav = computed(() => {
  const modes: MenuModeValue[] = [MenuMode.Vertical, MenuMode.Split]
  return modes.includes(app.value.menuMode)
})
</script>
