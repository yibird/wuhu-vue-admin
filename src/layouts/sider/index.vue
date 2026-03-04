<template>
  <component :is="activeComponent" />
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { appStore } from '@/store'
import { MenuMode } from '@/constant'
import { VerticalSider, MixSider, SplitSider } from './components'

const { app, sider } = storeToRefs(appStore())

const components = {
  [MenuMode.Vertical]: VerticalSider,
  [MenuMode.Mix]: MixSider,
  [MenuMode.Split]: SplitSider,
}

const activeComponent = computed(() => {
  const showSider = sider.value.show
  const menuMode = app.value.menuMode
  if (!showSider || menuMode === MenuMode.Horizontal) return
  return components[menuMode]
})
</script>
