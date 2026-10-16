<template>
  <Card class="min-h-483 max-md:min-h-383" aria-hidden="true">
    <template #title>
      <span
        class="block h-14 w-84 rounded-4 bg-fill-tertiary animate-pulse motion-reduce:animate-none"
      />
    </template>

    <div class="h-380 w-full p-12 max-md:h-280">
      <div class="relative h-full overflow-hidden rounded-6 bg-fill-1 p-12">
        <div
          class="absolute inset-0 m-auto size-200 rounded-full bg-fill-tertiary animate-pulse motion-reduce:animate-none"
        >
          <div
            class="absolute inset-0 m-auto size-128 rounded-full bg-fill-1"
          />
        </div>
        <div
          class="absolute bottom-16 left-12 right-12 flex flex-wrap items-center justify-center gap-12"
        >
          <div
            v-for="legend in 5"
            :key="legend"
            class="h-10 w-58 rounded-4 bg-fill-secondary animate-pulse motion-reduce:animate-none"
          />
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@/components'
</script>
