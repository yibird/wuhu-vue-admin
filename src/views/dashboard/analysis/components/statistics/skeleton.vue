<template>
  <Card
    class="min-h-483 max-md:min-h-539 overflow-hidden rounded-8 b-1-regular shadow-card"
    variant="borderless"
    :styles="{ body: { padding: '0' } }"
    aria-hidden="true"
  >
    <div
      class="flex flex-wrap items-center justify-between gap-12 b-b-1-regular bg-container px-14 py-12 sm:px-18"
    >
      <div class="min-w-0">
        <div
          class="h-14 w-84 rounded-4 bg-muted animate-pulse motion-reduce:animate-none"
        />
        <div
          class="mt-5 h-10 w-170 rounded-4 bg-secondary animate-pulse motion-reduce:animate-none"
        />
      </div>
      <div class="min-w-0 flex flex-wrap items-center justify-end gap-8">
        <div class="flex items-center">
          <div
            v-for="range in 6"
            :key="range"
            class="h-32 w-54 b-1-regular bg-secondary animate-pulse motion-reduce:animate-none first:rounded-l-4 last:rounded-r-4"
          />
        </div>
        <div
          class="h-32 w-240 rounded-4 bg-secondary animate-pulse motion-reduce:animate-none max-sm:w-full"
        />
      </div>
    </div>

    <div class="h-46 flex shrink-0 items-center gap-20 b-b-1-regular px-18">
      <div
        class="h-12 w-58 rounded-4 bg-muted animate-pulse motion-reduce:animate-none"
      />
      <div
        class="h-12 w-58 rounded-4 bg-secondary animate-pulse motion-reduce:animate-none"
      />
    </div>

    <div class="h-360 rounded-8 p-12 max-md:h-300">
      <div class="relative h-full overflow-hidden rounded-6 bg-secondary p-12">
        <div
          v-for="line in 4"
          :key="line"
          class="absolute left-12 right-12 b-t-1-regular"
          :style="{ top: `${line * 20}%` }"
        />
        <div class="relative h-full flex items-end gap-8 pt-12">
          <div
            v-for="(height, index) in chartBars"
            :key="index"
            class="flex-1 rounded-t-6 bg-muted animate-pulse motion-reduce:animate-none"
            :style="{ height: `${height}%` }"
          />
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@/components'

const chartBars = [42, 58, 48, 72, 54, 84, 64, 76, 50, 68, 56, 78]
</script>
