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
import { SKELETON_SNAPSHOT_CONFIG } from '@/constants'
import type { ViewSectionProps } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ViewSectionProps>(), {
  skeletonName: 'default',
  loading: false,
  showSkeleton: true,
})

const attrs = useAttrs()

const skeletonOptions = computed(() => {
  return {
    name: props.skeletonName,
    color: 'rgba(0, 0, 0, 0.06)',
    darkColor: '#1f1f1f',
    transition: 200,
    snapshotConfig: SKELETON_SNAPSHOT_CONFIG,
    ...props.skeletonOptions,
    class: (attrs.class as string | undefined) ?? props.skeletonOptions?.class,
  }
})
</script>
