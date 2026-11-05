<template>
  <Suspense>
    <Skeleton v-bind="skeletonOptions" :loading="loading && showSkeleton">
      <slot />
    </Skeleton>
    <template #fallback>
      <Skeleton v-bind="skeletonOptions" :loading="showSkeleton" />
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import Skeleton from 'boneyard-js/vue'
import type { ViewSectionProps } from './types'

const props = withDefaults(defineProps<ViewSectionProps>(), {
  name: 'default',
  loading: false,
  showSkeleton: true,
})

const skeletonOptions = computed(() => {
  return {
    name: 'default',
    color: 'rgba(0,0,0,0.06)',
    ...props.skeletonOptions,
  }
})
</script>
