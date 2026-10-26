<template>
  <Card class="min-h-621" aria-hidden="true">
    <template #title>
      <span
        class="block h-14 w-84 rounded-4 bg-muted animate-pulse motion-reduce:animate-none"
      />
    </template>

    <div class="h-124 rounded-10 bg-secondary p-12">
      <div class="flex items-start justify-between gap-10">
        <div class="min-w-0">
          <div class="flex items-center gap-7">
            <div
              class="size-26 shrink-0 rounded-8 bg-muted animate-pulse motion-reduce:animate-none"
            />
            <div
              class="h-12 w-70 rounded-4 bg-muted animate-pulse motion-reduce:animate-none"
            />
          </div>
          <div
            class="mt-10 h-18 w-130 rounded-4 bg-muted animate-pulse motion-reduce:animate-none"
          />
          <div class="mt-5 flex items-center gap-6">
            <div
              class="h-10 w-58 rounded-4 bg-secondary animate-pulse motion-reduce:animate-none"
            />
            <div
              class="h-10 w-58 rounded-4 bg-muted animate-pulse motion-reduce:animate-none"
            />
          </div>
        </div>
        <div class="shrink-0 text-right">
          <div
            class="h-28 w-70 rounded-4 bg-muted animate-pulse motion-reduce:animate-none"
          />
          <div
            class="mt-4 h-10 w-58 rounded-4 bg-secondary animate-pulse motion-reduce:animate-none"
          />
        </div>
      </div>
      <div class="mt-12 h-7 rounded-999 bg-muted" />
    </div>

    <div class="mt-10 flex flex-col">
      <div
        v-for="rank in rankingRates"
        :key="rank"
        class="h-48 flex items-center gap-10 rounded-8 px-4 py-9 sm:px-6"
      >
        <div
          class="size-26 shrink-0 rounded-8 bg-muted animate-pulse motion-reduce:animate-none"
        />
        <div class="min-w-0 flex-1">
          <div class="flex items-center justify-between gap-8">
            <div
              class="h-14 flex-1 rounded-4 bg-muted animate-pulse motion-reduce:animate-none"
            />
            <div
              class="h-14 w-40 rounded-4 bg-secondary animate-pulse motion-reduce:animate-none"
            />
          </div>
          <div class="mt-7 h-5 rounded-999 bg-secondary">
            <div
              class="h-full rounded-999 bg-muted animate-pulse motion-reduce:animate-none"
              :style="{ width: `${rank}%` }"
            />
          </div>
        </div>
        <div
          class="h-10 w-58 shrink-0 rounded-4 bg-secondary animate-pulse motion-reduce:animate-none"
        />
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@/components'

const rankingRates = Array.from({ length: 8 }, (_, index) => 92 - index * 4)
</script>
