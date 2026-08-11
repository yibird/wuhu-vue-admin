<script setup lang="ts">
import { Editor as TiptapEditorCore, EditorContent } from '@tiptap/vue-3'
import {
  computed,
  onBeforeUnmount,
  shallowRef,
  useTemplateRef,
  watch,
} from 'vue'
import { useDeferred } from '@/composables'
import EditorFooter from './components/EditorFooter.vue'
import EditorToolbar from './components/EditorToolbar.vue'
import { createEditorExtensions } from './extensions'
import {
  blockOptions as defaultBlockOptions,
  defaultEditorLocale,
  defaultFontFamilyOptions,
  fontSizeOptions as defaultFontSizeOptions,
  highlightColorOptions as defaultHighlightColorOptions,
  textColorOptions as defaultTextColorOptions,
} from './constants'
import { sizeValue } from './utils'
import { useEditorCommands } from './composables/useEditorCommands'
import { useEditorState } from './composables/useEditorState'
import { useEditorToolbar } from './composables/useEditorToolbar'
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
const emit = defineEmits<EditorEmits>()

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

const fontFamilyOptions = computed(() =>
  props.fontFamilyOptions?.length
    ? props.fontFamilyOptions
    : defaultFontFamilyOptions
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
  if (!currentEditor || value === currentEditor.getHTML()) return
  currentEditor.commands.setContent(value, { emitUpdate: false })
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
  onImageUploadError: (error, file) => emit('imageUploadError', error, file),
  onImageUploadSuccess: (url, file) => emit('imageUploadSuccess', url, file),
  locale: () => locale.value,
})
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
      :font-family-options="fontFamilyOptions"
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
      @set-link="commands.setLink"
      @clear-formatting="commands.clearFormatting"
      @undo="commands.undo"
      @redo="commands.redo"
    />

    <Scrollbar
      class="w-editor__surface min-h-0 flex-1 overflow-hidden bg-container"
      content-class="min-h-full"
      :style="contentStyle"
    >
      <EditorContent :editor="editor" />
    </Scrollbar>

    <EditorFooter
      :character-count="characterCount"
      :word-count="wordCount"
      :locale="locale"
    />

    <input
      ref="imageInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="commands.handleImageSelect"
    />
  </div>
</template>

<style lang="less" scoped src="./styles.less"></style>
