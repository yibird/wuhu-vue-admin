<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { Editor } from '@/components/editor'
import type { EditorExpose } from '@/components/editor'
import DocumentPreview from './DocumentPreview.vue'
import type { DeviceMode, EditorContentExpose, EditorMode } from '../types'
import { deviceOptions } from '../data'

const props = defineProps<{
  activeMode: EditorMode
  deviceMode: DeviceMode
  editingContent: string
  sourceContent: string
  safeContent: string
  previewWidthClass: string
}>()

const emit = defineEmits<{
  (e: 'update:editingContent', value: string): void
  (e: 'update:sourceContent', value: string): void
  (e: 'update:deviceMode', value: DeviceMode): void
  (e: 'insert-template', type: 'meeting' | 'release' | 'todo'): void
  (e: 'open-preview'): void
}>()

const editorRef = useTemplateRef<EditorExpose>('editor')

function getHTML() {
  return editorRef.value?.getHTML() ?? props.editingContent
}

function setHTML(value: string) {
  editorRef.value?.setHTML(value)
}

function insertHTML(value: string) {
  editorRef.value?.insertHTML(value)
}

defineExpose<EditorContentExpose>({
  getHTML,
  setHTML,
  insertHTML,
})
</script>

<template>
  <section class="min-w-0 flex flex-1 flex-col">
    <div
      class="mb-10 flex flex-wrap items-center justify-between gap-10 rounded-6 border-1 border-solid border-color-1 bg-container px-12 py-10"
    >
      <div class="flex flex-wrap items-center gap-8">
        <a-button size="small" @click="emit('insert-template', 'meeting')">
          会议纪要
        </a-button>
        <a-button size="small" @click="emit('insert-template', 'release')">
          发布计划
        </a-button>
        <a-button size="small" @click="emit('insert-template', 'todo')">
          行动清单
        </a-button>
      </div>
      <div class="flex flex-wrap items-center gap-8">
        <a-segmented
          :value="props.deviceMode"
          :options="deviceOptions"
          @update:value="
            (v: string | number) => emit('update:deviceMode', v as DeviceMode)
          "
        >
          <template #labelRender="payload">
            <div class="inline-flex items-center gap-2">
              <Icon
                v-if="payload.iconName"
                :name="payload.iconName"
                :size="16"
              />
              <span>{{ payload.label }}</span>
            </div>
          </template>
        </a-segmented>
        <a-button @click="emit('open-preview')">
          <template #icon>
            <Icon name="i-lucide:scan-eye" />
          </template>
          全屏预览
        </a-button>
      </div>
    </div>

    <div class="min-h-0 flex flex-1 justify-center overflow-hidden">
      <div
        :class="[
          'min-h-0 w-full transition-[max-width] duration-200',
          props.previewWidthClass,
        ]"
      >
        <Editor
          v-if="props.activeMode === 'edit'"
          ref="editor"
          :model-value="props.editingContent"
          class="h-full"
          :show-select-controls="false"
          placeholder="开始编写你的文档..."
          min-height="100%"
          @update:model-value="(v: string) => emit('update:editingContent', v)"
        />

        <Scrollbar
          v-else-if="props.activeMode === 'preview'"
          class="h-full rounded-8 border-1 border-solid border-color-1 bg-container"
          content-class="p-34 max-sm:p-18"
        >
          <DocumentPreview :html="props.safeContent" />
        </Scrollbar>

        <div
          v-else
          class="h-full overflow-hidden rounded-8 border-1 border-solid border-color-1 bg-container"
        >
          <textarea
            :value="props.sourceContent"
            class="box-border full resize-none border-0 bg-container p-16 font-mono text-sm text-main leading-22px outline-none"
            spellcheck="false"
            @input="
              emit(
                'update:sourceContent',
                ($event.target as HTMLTextAreaElement).value
              )
            "
          />
        </div>
      </div>
    </div>
  </section>
</template>
