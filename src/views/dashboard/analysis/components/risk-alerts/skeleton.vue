<template>
  <Card class="min-h-374" aria-hidden="true">
    <template #title>
      <span
        class="block h-14 w-84 rounded-4 bg-muted animate-pulse motion-reduce:animate-none"
      />
    </template>

    <div class="flex flex-col gap-4">
      <div v-for="row in 4" :key="row" class="flex items-start gap-10 py-10">
        <span
          class="size-28 shrink-0 rounded-8 bg-muted animate-pulse motion-reduce:animate-none"
        />
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-6">
            <span
              class="h-12 w-160 rounded-4 bg-muted animate-pulse motion-reduce:animate-none"
            />
            <span
              class="h-14 w-36 shrink-0 rounded-4 bg-secondary animate-pulse motion-reduce:animate-none"
            />
          </div>
          <div
            class="mt-6 h-10 w-240 rounded-4 bg-secondary animate-pulse motion-reduce:animate-none"
          />
        </div>
        <span
          class="h-10 w-52 shrink-0 rounded-4 bg-secondary animate-pulse motion-reduce:animate-none"
        />
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@/components'
</script>
