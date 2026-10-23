<template>
  <div
    class="min-h-0 min-w-0 flex flex-1 flex-col overflow-hidden rounded-8 border-1 border-solid border-color-2 bg-container shadow-[var(--w-shadow-card)]"
    data-testid="rich-editor"
    :class="{ 'opacity-76': disabled }"
    :style="rootStyle"
  >
    <EditorToolbar
      :disabled="disabled"
      :show-select-controls="showSelectControls"
      :current-block="currentBlock"
      :current-font-family="currentFontFamily"
      :current-font-size="currentFontSize"
      :current-text-color="currentTextColor"
      :current-highlight-color="currentHighlightColor"
      :block-options="blockOptions"
      :font-family-options="fontOptions"
      :font-size-options="fontSizeOptions"
      :text-color-options="textColorOptions"
      :highlight-color-options="highlightColorOptions"
      :inline-items="inlineItems"
      :block-items="blockItems"
      :align-items="alignItems"
      :image-menu="imageMenu"
      :table-menu="tableMenu"
      :can-undo="canUndo"
      :can-redo="canRedo"
      :is-link-active="isLinkActive"
      :is-table-active="isTableActive"
      :button-class="toolbar.getToolbarButtonClass"
      :state-version="editorStateVersion"
      :locale="locale"
      @set-block="commands.setBlock"
      @set-font-family="commands.setFontFamily"
      @set-font-size="commands.setFontSize"
      @set-text-color="commands.setTextColor"
      @set-highlight-color="commands.setHighlightColor"
      @open-link="commands.openLinkDialog"
      @clear-formatting="commands.clearFormatting"
      @undo="commands.undo"
      @redo="commands.redo"
    />

    <div
      class="w-editor__surface min-h-0 flex-1 w-full h-full bg-container overflow-x-hidden overflow-y-auto"
      :style="contentStyle"
    >
      <EditorContent :editor="editor" />
    </div>

    <EditorFooter
      :character-count="characterCount"
      :word-count="wordCount"
      :locale="locale"
    />

    <input
      ref="imageInput"
      type="file"
      accept="image/*"
      class="!hidden"
      @change="commands.handleImageSelect"
    />

    <EditorUrlDialog
      v-model:open="linkDialogOpen"
      :initial-value="linkInitialValue"
      :placeholder="locale.linkPrompt"
      :title="locale.link"
      @apply="applyLink"
    />
    <EditorUrlDialog
      v-model:open="imageDialogOpen"
      :placeholder="locale.imagePrompt"
      :title="locale.image"
      @apply="applyImageUrl"
    />
  </div>
</template>

<script setup lang="ts">
import { Editor as TiptapEditorCore, EditorContent } from '@tiptap/vue-3'
import { useDeferred } from '@/hooks'
import EditorFooter from './components/editor-footer.vue'
import EditorToolbar from './components/editor-toolbar.vue'
import EditorUrlDialog from './components/editor-url-dialog.vue'
import { createEditorExtensions } from './extensions'
import { sanitizeEditorHtml } from './sanitize'
import {
  blockOptions as defaultBlockOptions,
  defaultEditorLocale,
  defaultFontFamilyOptions,
  fontSizeOptions as defaultFontSizeOptions,
  highlightColorOptions as defaultHighlightColorOptions,
  textColorOptions as defaultTextColorOptions,
} from './constants'
import { sizeValue } from './utils'
import { useEditorCommands, useEditorState, useEditorToolbar } from './hooks'
import type { Editor as TiptapEditor } from '@tiptap/vue-3'
import type { CSSProperties } from 'vue'
import type {
  EditorEmits,
  EditorExpose,
  EditorLocale,
  EditorProps,
} from './types'

const props = withDefaults(defineProps<EditorProps>(), {
  placeholder: '请输入内容...',
  minHeight: 420,
  disabled: false,
  showSelectControls: true,
  maxImageSize: 2 * 1024 * 1024,
})
const emits = defineEmits<EditorEmits>()

const model = defineModel<string>({ default: '' })

const editor = shallowRef<TiptapEditor>()
const editorStateVersion = shallowRef(0)
const imageInputRef = useTemplateRef<HTMLInputElement>('imageInput')
let editorStateFrame: number | undefined

const contentStyle = computed<CSSProperties>(() => ({
  minHeight: sizeValue(props.minHeight),
  maxHeight: sizeValue(props.maxHeight),
}))

const rootStyle = computed<CSSProperties>(() => ({
  minHeight: sizeValue(props.minHeight),
}))

const fontOptions = computed(() =>
  props.fontOptions?.length ? props.fontOptions : defaultFontFamilyOptions
)
const blockOptions = computed(() =>
  props.blockOptions?.length ? props.blockOptions : defaultBlockOptions
)
const fontSizeOptions = computed(() =>
  props.fontSizeOptions?.length ? props.fontSizeOptions : defaultFontSizeOptions
)
const textColorOptions = computed(() =>
  props.textColorOptions?.length
    ? props.textColorOptions
    : defaultTextColorOptions
)
const highlightColorOptions = computed(() =>
  props.highlightColorOptions?.length
    ? props.highlightColorOptions
    : defaultHighlightColorOptions
)
const locale = computed<EditorLocale>(() => ({
  ...defaultEditorLocale,
  ...props.locale,
}))

function refreshEditorState() {
  if (editorStateFrame !== undefined) return
  editorStateFrame = window.requestAnimationFrame(() => {
    editorStateFrame = undefined
    editorStateVersion.value += 1
  })
}

const { cancel: cancelCreateEditor } = useDeferred(() => {
  if (editor.value) return

  editor.value = new TiptapEditorCore({
    editable: !props.disabled,
    content: model.value,
    editorProps: {
      attributes: {
        class: 'w-editor-content__body',
      },
    },
    extensions: createEditorExtensions(props.placeholder),
    onUpdate({ editor }) {
      const html = editor.getHTML()
      if (html !== model.value) {
        model.value = html
      }
    },
    onTransaction: refreshEditorState,
  })
  refreshEditorState()
})

onBeforeUnmount(() => {
  cancelCreateEditor()
  if (editorStateFrame !== undefined) {
    window.cancelAnimationFrame(editorStateFrame)
    editorStateFrame = undefined
  }
  editor.value?.destroy()
  editor.value = undefined
})

watch(
  () => props.disabled,
  (disabled) => {
    editor.value?.setEditable(!disabled)
  }
)

watch(model, (value) => {
  const currentEditor = editor.value
  if (!currentEditor) return

  // 编辑器自身回写的值已经是当前内容,先比对再清洗:
  // 否则每次输入都要跑一遍 DOMPurify 与 getHTML 序列化,还可能因序列化差异重置光标
  if (value === currentEditor.getHTML()) return

  // 回填的 HTML 可能来自接口,先清洗再交给编辑器
  const nextValue = sanitizeEditorHtml(value)
  if (nextValue === currentEditor.getHTML()) return
  currentEditor.commands.setContent(nextValue, { emitUpdate: false })
  refreshEditorState()
})

const editorState = useEditorState(editor, editorStateVersion)
const {
  currentBlock,
  currentFontFamily,
  currentFontSize,
  currentTextColor,
  currentHighlightColor,
  canUndo,
  canRedo,
  isLinkActive,
  isTableActive,
  characterCount,
  wordCount,
} = editorState
const commands = useEditorCommands({
  editor,
  model,
  disabled: () => props.disabled,
  imageInputRef,
  refreshEditorState,
  maxImageSize: () => props.maxImageSize,
  uploadImage: () => props.uploadImage,
  onImageUploadError: (error, file) => emits('imageUploadError', error, file),
  onImageUploadSuccess: (url, file) => emits('imageUploadSuccess', url, file),
  locale: () => locale.value,
})
const {
  linkDialogOpen,
  linkInitialValue,
  applyLink,
  imageDialogOpen,
  applyImageUrl,
} = commands
const toolbar = useEditorToolbar(editor, commands, () => locale.value)
const { inlineItems, blockItems, alignItems, imageMenu, tableMenu } = toolbar

defineExpose<EditorExpose>({
  focus: commands.focus,
  clear: commands.clear,
  getHTML: commands.getHTML,
  getText: commands.getText,
  setHTML: commands.setHTML,
  insertHTML: commands.insertHTML,
})
</script>

<style lang="less" scoped src="./styles.less"></style>
