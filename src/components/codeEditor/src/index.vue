<script setup lang="ts">
import { json } from '@codemirror/lang-json'
import { Compartment, EditorState } from '@codemirror/state'
import type { Extension } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { basicSetup } from 'codemirror'
import {
  onBeforeUnmount,
  onMounted,
  shallowRef,
  useTemplateRef,
  watch,
} from 'vue'
import type { CodeEditorLanguage } from './types'

const props = withDefaults(
  defineProps<{
    language?: CodeEditorLanguage
    modelValue: string
    readonly?: boolean
  }>(),
  {
    language: 'json',
    readonly: false,
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editorRef = useTemplateRef<HTMLDivElement>('editorRef')
const view = shallowRef<EditorView>()
const externalUpdate = shallowRef(false)
const editableCompartment = new Compartment()
const languageCompartment = new Compartment()

const editorTheme = EditorView.theme({
  '&': {
    height: '100%',
    fontSize: '13px',
    backgroundColor: 'rgb(var(--w-bg-container))',
    color: 'rgb(var(--w-text-main))',
  },
  '.cm-scroller': {
    fontFamily:
      '"Cascadia Code", "JetBrains Mono", Consolas, "SFMono-Regular", monospace',
    lineHeight: '1.65',
  },
  '.cm-gutters': {
    backgroundColor: 'rgb(var(--w-bg-fill))',
    color: 'rgb(var(--w-text-muted))',
    borderRight: '1px solid rgb(var(--w-border-color-2))',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'rgb(var(--w-color-primary) / 8%)',
  },
  '.cm-activeLine': {
    backgroundColor: 'rgb(var(--w-color-primary) / 6%)',
  },
  '.cm-content': {
    padding: '14px 0',
  },
  '.cm-line': {
    padding: '0 14px',
  },
  '.cm-selectionBackground': {
    backgroundColor: 'rgb(var(--w-color-primary) / 20%) !important',
  },
  '.cm-focused': {
    outline: 'none',
  },
})

function languageExtension(language: CodeEditorLanguage): Extension {
  if (language === 'json') return json()
  return []
}

function createEditor() {
  if (!editorRef.value) return

  view.value = new EditorView({
    parent: editorRef.value,
    state: EditorState.create({
      doc: props.modelValue,
      extensions: [
        basicSetup,
        languageCompartment.of(languageExtension(props.language)),
        editorTheme,
        editableCompartment.of(EditorView.editable.of(!props.readonly)),
        EditorView.updateListener.of((update) => {
          if (!update.docChanged || externalUpdate.value) return
          emit('update:modelValue', update.state.doc.toString())
        }),
      ],
    }),
  })
}

onMounted(createEditor)

watch(
  () => props.modelValue,
  (value) => {
    const editor = view.value
    if (!editor || value === editor.state.doc.toString()) return

    externalUpdate.value = true
    try {
      editor.dispatch({
        changes: {
          from: 0,
          to: editor.state.doc.length,
          insert: value,
        },
      })
    } finally {
      externalUpdate.value = false
    }
  }
)

watch(
  () => props.language,
  (language) => {
    view.value?.dispatch({
      effects: languageCompartment.reconfigure(languageExtension(language)),
    })
  }
)

watch(
  () => props.readonly,
  (readonly) => {
    view.value?.dispatch({
      effects: editableCompartment.reconfigure(
        EditorView.editable.of(!readonly)
      ),
    })
  }
)

onBeforeUnmount(() => {
  view.value?.destroy()
  view.value = undefined
})
</script>

<template>
  <div
    ref="editorRef"
    class="h-full min-h-0 overflow-hidden bg-container border-1 border-solid border-color-2 rounded-8"
  />
</template>

<style lang="less" scoped>
:deep(.cm-editor) {
  height: 100%;
}
</style>
