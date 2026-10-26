<template>
  <header
    class="h-82 flex flex-wrap items-center justify-between gap-12 b-b-1-muted bg-container px-18 py-12"
  >
    <div class="min-w-0 flex-1">
      <div class="flex items-center gap-8">
        <button
          type="button"
          class="button size-34 rounded-6 text-secondary transition-colors hover:(bg-hover text-primary) lg:hidden"
          title="文档列表"
          @click="emits('open-drawer')"
        >
          <Icon name="i-lucide:panel-left-open" :size="17" />
        </button>
        <input
          v-if="props.isRenaming"
          :value="props.renameValue"
          data-editor-title-input
          class="h-34 min-w-0 max-w-520 flex-1 rounded-6 b-1-primary bg-container px-10 text-lg text-main outline-none"
          @update:value="(v: string) => emits('update:renameValue', v)"
          @keyup.enter="emits('confirm-rename')"
          @keyup.esc="emits('cancel-rename')"
          @blur="emits('confirm-rename')"
        />
        <h1 v-else class="m-0 truncate text-xl text-main font-650">
          {{ props.activeDocument?.title }}
        </h1>
        <button
          type="button"
          class="button size-30 rounded-6 text-secondary transition-colors hover:(bg-hover text-primary)"
          title="重命名"
          @click="emits('start-rename')"
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
        @change="(v: string | number) => emits('mode-change', v)"
      >
        <template #labelRender="payload">
          <div class="inline-flex items-center gap-2">
            <Icon v-if="payload.iconName" :name="payload.iconName" :size="16" />
            <span>{{ payload.label }}</span>
          </div>
        </template>
      </a-segmented>
      <a-button @click="emits('reset')">
        <template #icon>
          <Icon name="i-lucide:rotate-ccw" />
        </template>
        恢复
      </a-button>
      <a-button type="primary" @click="emits('save')">
        <template #icon>
          <Icon name="i-lucide:save" />
        </template>
        保存
      </a-button>
    </div>
  </header>
</template>

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

const emits = defineEmits<{
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
