<template>
  <component v-if="activeComponent" :is="activeComponent" />
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useAppStore } from '@/store'
import { MenuMode } from '@/constants'
import VerticalSider from './VerticalSider.vue'
import MixSider from './MixSider.vue'
import SplitSider from './SplitSider.vue'

const components = {
  [MenuMode.Vertical]: VerticalSider,
  [MenuMode.Mix]: MixSider,
  [MenuMode.Split]: SplitSider,
}

const { app, sider } = useAppStore()

const activeComponent = computed(() => {
  const showSider = sider.value.show
  const menuMode = app.value.menuMode
  if (!showSider || menuMode === MenuMode.Horizontal) return null
  return components[menuMode]
})
</script>
