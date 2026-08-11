<script setup lang="ts">
import type { DesignerVersion } from '../types'

defineProps<{
  versions: DesignerVersion[]
}>()

const open = defineModel<boolean>('open', { default: false })

defineEmits<{
  restore: [version: DesignerVersion]
}>()
</script>

<template>
  <a-modal v-model:open="open" title="历史版本" :footer="null" :width="680">
    <div class="grid gap-10">
      <button
        v-for="version in versions"
        :key="version.id"
        type="button"
        class="rounded-8 border-1 border-color-2 border-solid bg-container p-12 text-left transition hover:(border-color-primary bg-primary-tint)"
        @click="$emit('restore', version)"
      >
        <div class="flex items-start justify-between gap-12">
          <div class="min-w-0">
            <div class="truncate text-sm text-main font-700">
              {{ version.name }}
            </div>
            <div class="mt-4 text-xs text-secondary">
              {{ version.time }} / {{ version.nodes.length }} 个组件
            </div>
          </div>
          <Icon name="i-lucide:rotate-ccw" :size="16" class="mt-2 text-muted" />
        </div>
      </button>
    </div>
  </a-modal>
</template>
