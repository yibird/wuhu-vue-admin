<template>
  <Card class="min-h-268" aria-hidden="true">
    <template #title>
      <span
        class="block h-14 w-84 rounded-4 bg-fill-tertiary animate-pulse motion-reduce:animate-none"
      />
    </template>

    <div class="flex flex-wrap items-end justify-between gap-12">
      <div class="min-w-0">
        <div
          class="h-28 w-96 rounded-4 bg-fill-tertiary animate-pulse motion-reduce:animate-none"
        />
        <div
          class="mt-8 h-10 w-180 rounded-4 bg-fill-secondary animate-pulse motion-reduce:animate-none"
        />
      </div>
      <div
        class="h-22 w-88 rounded-6 bg-fill-secondary animate-pulse motion-reduce:animate-none"
      />
    </div>

    <div
      class="mt-14 h-9 rounded-999 bg-fill-tertiary animate-pulse motion-reduce:animate-none"
    />

    <div class="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-3">
      <div
        v-for="stage in 3"
        :key="stage"
        class="rounded-8 bg-fill-1 px-10 py-9"
      >
        <div class="flex items-center justify-between gap-8">
          <span
            class="h-10 w-54 rounded-4 bg-fill-secondary animate-pulse motion-reduce:animate-none"
          />
          <span
            class="h-10 w-32 rounded-4 bg-fill-secondary animate-pulse motion-reduce:animate-none"
          />
        </div>
        <div
          class="mt-7 h-5 rounded-999 bg-fill-tertiary animate-pulse motion-reduce:animate-none"
        />
        <div
          class="mt-6 h-10 w-70 rounded-4 bg-fill-secondary animate-pulse motion-reduce:animate-none"
        />
      </div>
    </div>

    <div
      class="mt-12 h-10 w-200 rounded-4 bg-fill-secondary animate-pulse motion-reduce:animate-none"
    />
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@/components'
</script>
