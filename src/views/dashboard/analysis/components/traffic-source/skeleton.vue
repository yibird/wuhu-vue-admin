<template>
  <Card class="min-h-474" aria-hidden="true">
    <template #title>
      <span
        class="block h-14 w-84 rounded-4 bg-muted animate-pulse motion-reduce:animate-none"
      />
    </template>

    <div class="h-200 w-full">
      <div class="relative h-full overflow-hidden rounded-6 bg-secondary p-12">
        <div
          class="absolute inset-0 m-auto size-160 rounded-full bg-muted animate-pulse motion-reduce:animate-none"
        >
          <div
            class="absolute inset-0 m-auto size-104 rounded-full bg-secondary"
          />
        </div>
      </div>
    </div>

    <div class="mt-10 flex flex-col">
      <div
        v-for="row in 4"
        :key="row"
        class="flex items-center gap-8 px-4 py-7"
      >
        <span
          class="size-8 shrink-0 rounded-999 bg-muted animate-pulse motion-reduce:animate-none"
        />
        <span
          class="h-12 min-w-0 flex-1 rounded-4 bg-secondary animate-pulse motion-reduce:animate-none"
        />
        <span
          class="h-10 w-32 shrink-0 rounded-4 bg-secondary animate-pulse motion-reduce:animate-none"
        />
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@/components/card'
</script>
