<script setup lang="ts">
import type { ChartSchemaHistoryEntry } from '../composables/useSchemaWorkspace'

defineProps<{
  history: readonly ChartSchemaHistoryEntry[]
}>()

const open = defineModel<boolean>('open', { required: true })

defineEmits<{
  restore: [entry: ChartSchemaHistoryEntry]
}>()
</script>

<template>
  <a-modal v-model:open="open" :footer="null" title="历史版本" width="680px">
    <div class="h-[56vh] min-h-0 overflow-hidden">
      <Scrollbar class="min-h-0" content-class="grid gap-10">
        <a-button
          v-for="entry in history"
          :key="entry.id"
          class="chart-history-entry-button mb-10 w-full"
          @click="$emit('restore', entry)"
        >
          <span class="block w-full text-left">
            <div class="flex items-center justify-between gap-10">
              <strong class="text-14px text-primary">{{ entry.title }}</strong>
              <span class="text-12px text-tertiary">{{ entry.createdAt }}</span>
            </div>
            <p class="m-0 mt-6 line-clamp-2 font-mono text-11px text-secondary">
              {{ entry.schemaText }}
            </p>
          </span>
        </a-button>
        <div
          v-if="history.length === 0"
          class="rounded-8 bg-fill p-18 text-center text-13px text-secondary"
        >
          还没有历史版本。
        </div>
      </Scrollbar>
    </div>
  </a-modal>
</template>

<style scoped>
.chart-history-entry-button {
  height: auto;
  padding: 12px;
  border-radius: 8px;
}
</style>
