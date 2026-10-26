<template>
  <Card class="min-h-446" aria-hidden="true">
    <template #title>
      <span
        class="block h-14 w-84 rounded-4 bg-muted animate-pulse motion-reduce:animate-none"
      />
    </template>

    <div class="flex flex-col gap-6">
      <div v-for="row in 6" :key="row" class="flex items-center gap-10 py-9">
        <span
          class="size-26 shrink-0 rounded-8 bg-muted animate-pulse motion-reduce:animate-none"
        />
        <div class="min-w-0 flex-1">
          <div class="flex items-center justify-between gap-8">
            <span
              class="h-12 w-70 rounded-4 bg-secondary animate-pulse motion-reduce:animate-none"
            />
            <span
              class="h-12 w-56 rounded-4 bg-secondary animate-pulse motion-reduce:animate-none"
            />
          </div>
          <div
            class="mt-7 h-5 rounded-999 bg-muted animate-pulse motion-reduce:animate-none"
          />
        </div>
        <span
          class="h-10 w-40 shrink-0 rounded-4 bg-secondary animate-pulse motion-reduce:animate-none"
        />
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@/components'
</script>
