<script setup lang="ts">
import type { EditorToolbarItem } from '../types'

defineProps<{
  readonly items: readonly EditorToolbarItem[]
  readonly disabled?: boolean
  readonly buttonClass: (active?: boolean) => string
  readonly stateVersion: number
}>()

const resolveTitle = (item: EditorToolbarItem) =>
  typeof item.title === 'function' ? item.title() : item.title
</script>

<template>
  <div
    class="flex items-center gap-2 rounded-8 border-1 border-solid border-color-2 bg-container p-3"
  >
    <a-tooltip
      v-for="item in items"
      :key="item.key"
      :title="resolveTitle(item)"
    >
      <button
        type="button"
        class="button size-30 rounded-6 transition-colors"
        :class="buttonClass(item.active?.())"
        :disabled="disabled || item.disabled?.()"
        :aria-label="resolveTitle(item)"
        @click="item.action"
      >
        <Icon :name="item.icon" :size="16" />
      </button>
    </a-tooltip>
  </div>
</template>
