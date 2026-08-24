<template>
  <component v-if="activeComponent" :is="activeComponent" />
</template>
<script lang="ts" setup>
import { MenuMode } from '@/constants'
import VerticalSider from './VerticalSider.vue'
import { useCollapse, useSider } from './composables'

const components = {
  [MenuMode.Vertical]: VerticalSider,
  [MenuMode.Mix]: defineAsyncComponent(() => import('./MixSider.vue')),
  [MenuMode.Split]: defineAsyncComponent(() => import('./SplitSider.vue')),
}

const { activeComponent } = useSider(components)
useCollapse()
</script>
