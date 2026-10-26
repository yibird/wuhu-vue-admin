<template>
  <div
    class="columns-1 gap-16 sm:columns-2 md:columns-3 xl:columns-4 2xl:columns-5"
  >
    <div
      v-for="(height, index) in SKELETON_HEIGHTS"
      :key="index"
      class="mb-16 break-inside-avoid overflow-hidden rounded-8 b-1-muted bg-container"
    >
      <div class="bg-muted" :style="{ height: `${height}px` }" />
      <div class="p-12">
        <a-skeleton
          active
          :title="{ width: '72%' }"
          :paragraph="{ rows: 2, width: ['100%', '82%'] }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SKELETON_HEIGHTS } from '../data'
</script>
