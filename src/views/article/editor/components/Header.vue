<script setup lang="ts">
import type { EditorDocument, EditorMode } from '../types'
import { modeOptions } from '../data'

const props = defineProps<{
  activeDocument: EditorDocument | undefined
  isRenaming: boolean
  renameValue: string
  activeMode: EditorMode
  documentStatusText: string
  saveText: string
  wordCount: number
  readingMinutes: number
}>()

const emit = defineEmits<{
  (e: 'mode-change', value: string | number): void
  (e: 'save'): void
  (e: 'reset'): void
  (e: 'start-rename'): void
  (e: 'confirm-rename'): void
  (e: 'cancel-rename'): void
  (e: 'update:renameValue', value: string): void
  (e: 'open-drawer'): void
}>()
</script>

<template>
  <header
    class="h-82 flex flex-wrap items-center justify-between gap-12 border-b-1 border-b-solid border-color-1 bg-container px-18 py-12"
  >
    <div class="min-w-0 flex-1">
      <div class="flex items-center gap-8">
        <button
          type="button"
          class="button size-34 rounded-6 text-secondary transition-colors hover:(bg-hover text-primary) lg:hidden"
          title="文档列表"
          @click="emit('open-drawer')"
        >
          <Icon name="i-lucide:panel-left-open" :size="17" />
        </button>
        <input
          v-if="props.isRenaming"
          :value="props.renameValue"
          data-editor-title-input
          class="h-34 min-w-0 max-w-520 flex-1 rounded-6 border-1 border-solid border-color-primary bg-container px-10 text-lg text-main outline-none"
          @update:value="(v: string) => emit('update:renameValue', v)"
          @keyup.enter="emit('confirm-rename')"
          @keyup.esc="emit('cancel-rename')"
          @blur="emit('confirm-rename')"
        />
        <h1 v-else class="m-0 truncate text-xl text-main font-650">
          {{ props.activeDocument?.title }}
        </h1>
        <button
          type="button"
          class="button size-30 rounded-6 text-secondary transition-colors hover:(bg-hover text-primary)"
          title="重命名"
          @click="emit('start-rename')"
        >
          <Icon name="i-lucide:pencil" :size="16" />
        </button>
      </div>
      <div
        class="mt-4 flex flex-wrap items-center gap-x-12 gap-y-4 text-xs text-secondary"
      >
        <span>{{ props.documentStatusText }}</span>
        <span>{{ props.saveText }}</span>
        <span>{{ props.wordCount }} 字</span>
        <span>预计 {{ props.readingMinutes }} 分钟阅读</span>
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-end gap-8">
      <a-segmented
        :value="props.activeMode"
        :options="modeOptions"
        @change="(v: string | number) => emit('mode-change', v)"
      >
        <template #labelRender="payload">
          <div class="inline-flex items-center gap-2">
            <Icon v-if="payload.iconName" :name="payload.iconName" :size="16" />
            <span>{{ payload.label }}</span>
          </div>
        </template>
      </a-segmented>
      <a-button @click="emit('reset')">
        <template #icon>
          <Icon name="i-lucide:rotate-ccw" />
        </template>
        恢复
      </a-button>
      <a-button type="primary" @click="emit('save')">
        <template #icon>
          <Icon name="i-lucide:save" />
        </template>
        保存
      </a-button>
    </div>
  </header>
</template>
