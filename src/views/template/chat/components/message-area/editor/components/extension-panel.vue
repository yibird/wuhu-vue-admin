<template>
  <div class="w-320 max-w-[calc(100vw-32px)] p-10">
    <div class="mb-10 flex items-center justify-between">
      <div>
        <div class="text-sm text-main font-600">更多发送方式</div>
        <div class="mt-2 text-xs text-secondary">选择常用内容或快捷能力</div>
      </div>
      <button
        type="button"
        class="button size-28 rounded-6 text-secondary hover:(bg-hover text-primary)"
        aria-label="关闭更多发送方式"
        @click="emits('close')"
      >
        <Icon name="i-lucide:x" :size="15" />
      </button>
    </div>

    <div class="grid grid-cols-2 gap-8">
      <button
        v-for="action in actions"
        :key="action.key"
        type="button"
        class="button min-h-66 justify-start gap-10 rounded-8 b-1-muted bg-container px-10 py-9 text-left transition-colors hover:(border-primary bg-hover)"
        @click="emits('select', action)"
      >
        <span
          class="size-34 shrink-0 flex items-center justify-center rounded-8"
          :class="action.iconClass"
        >
          <Icon :name="action.icon" :size="17" />
        </span>
        <span class="min-w-0 flex flex-col items-start gap-2">
          <span class="text-sm text-main">{{ action.label }}</span>
          <span class="text-xs text-secondary">{{ action.description }}</span>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EditorAction, ExtensionPanelProps } from '../types'

defineProps<ExtensionPanelProps>()

const emits = defineEmits<{
  close: []
  select: [action: EditorAction]
}>()
</script>
