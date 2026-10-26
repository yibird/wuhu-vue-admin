<template>
  <Card class="min-h-483 max-md:min-h-361" aria-hidden="true">
    <template #title>
      <span
        class="block h-14 w-84 rounded-4 bg-muted animate-pulse motion-reduce:animate-none"
      />
    </template>

    <div class="h-380 w-full p-12 max-md:h-260">
      <div class="relative h-full overflow-hidden rounded-6 bg-secondary p-12">
        <div
          v-for="line in 4"
          :key="line"
          class="absolute left-12 right-12 b-t-1-regular"
          :style="{ top: `${line * 20}%` }"
        />
        <div
          class="absolute bottom-42 left-12 right-12 h-120 rounded-[50%] bg-[rgb(var(--w-bg-secondary)_/_60%)] blur-8 animate-pulse motion-reduce:animate-none"
        />
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@/components/card'
</script>
