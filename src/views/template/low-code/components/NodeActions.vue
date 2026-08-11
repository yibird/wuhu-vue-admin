<script setup lang="ts">
import type { DesignerNodeActionKey, DesignerNodeAction } from '../types'

defineProps<{
  actions: DesignerNodeAction[]
  nodeType: string
  style?: Record<string, string>
}>()

defineEmits<{
  action: [key: DesignerNodeActionKey]
}>()
</script>

<template>
  <div
    data-low-code-node-action
    class="h-40 px-5 py-2 flex items-center gap-5 rounded-8 border-1 border-color-2 border-solid bg-container/96 shadow-[0_14px_34px_rgb(15_23_42_/_18%)] backdrop-blur-12 z-1000"
    :style="style"
  >
    <button
      v-for="action in actions"
      :key="action.key"
      type="button"
      :class="[
        'low-code-designer-node__action pointer-events-auto inline-flex size-31 cursor-pointer items-center justify-center rounded-6 border-0 bg-transparent text-muted transition hover:bg-hover disabled:cursor-not-allowed disabled:text-placeholder',
        action.danger ? 'hover:text-error' : 'hover:text-primary',
      ]"
      :aria-label="action.label"
      :title="action.label"
      :disabled="action.disabled"
      @pointerdown.stop
      @click.stop.prevent="$emit('action', action.key)"
    >
      <Icon :name="action.icon" :size="18" />
    </button>
  </div>
</template>
