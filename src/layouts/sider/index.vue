<template>
  <component v-if="activeComponent" :is="activeComponent" />
</template>
<script lang="ts" setup>
import { MenuMode } from '@/constants'
import { VerticalSider } from './components'
import { useCollapse, useSider } from './hooks'

const components = {
  [MenuMode.Vertical]: VerticalSider,
  [MenuMode.Mix]: defineAsyncComponent(
    () => import('./components/MixSider.vue')
  ),
  [MenuMode.Split]: defineAsyncComponent(
    () => import('./components/SplitSider.vue')
  ),
}

const { activeComponent } = useSider(components)
useCollapse()
</script>
