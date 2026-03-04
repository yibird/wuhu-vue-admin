<template>
  <n-layout-header
    class="h-50! px-10! bg-white! flex items-center justify-between dark:bg-dark-primary!"
  >
    <HeaderNav v-if="showNav" />
    <HeaderMenu v-else />
    <HeaderToolbar />
  </n-layout-header>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { appStore } from '@/store'
import HeaderNav from './nav/index.vue'
import HeaderMenu from './menu/index.vue'
import HeaderToolbar from './toolbar/index.vue'
import { MenuMode, type MenuModeType } from '@/constant'

const { app } = storeToRefs(appStore())

const showNav = computed(() => {
  return ([MenuMode.Vertical, MenuMode.Split] as MenuModeType[]).includes(
    app.value.menuMode
  )
})
</script>
