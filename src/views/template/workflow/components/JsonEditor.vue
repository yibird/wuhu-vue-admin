<script setup lang="ts">
import { Compartment, EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { basicSetup } from 'codemirror'
import { json } from '@codemirror/lang-json'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editorRef = useTemplateRef<HTMLDivElement>('editorRef')
const view = shallowRef<EditorView>()
const externalUpdate = shallowRef(false)
const editableCompartment = new Compartment()

const editorTheme = EditorView.theme({
  '&': {
    height: '100%',
    fontSize: '13px',
    backgroundColor: 'rgb(var(--w-bg-main))',
    color: 'rgb(var(--w-text-main))',
  },
  '.cm-scroller': {
    fontFamily:
      '"Cascadia Code", "JetBrains Mono", Consolas, "SFMono-Regular", monospace',
    lineHeight: '1.65',
  },
  '.cm-gutters': {
    backgroundColor: 'rgb(var(--w-fill-quaternary))',
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

onMounted(() => {
  if (!editorRef.value) return

  view.value = new EditorView({
    parent: editorRef.value,
    state: EditorState.create({
      doc: props.modelValue,
      extensions: [
        basicSetup,
        json(),
        editorTheme,
        editableCompartment.of(EditorView.editable.of(true)),
        EditorView.updateListener.of((update) => {
          if (!update.docChanged || externalUpdate.value) return
          emit('update:modelValue', update.state.doc.toString())
        }),
      ],
    }),
  })
})

watch(
  () => props.modelValue,
  (value) => {
    const editor = view.value
    if (!editor || value === editor.state.doc.toString()) return

    externalUpdate.value = true
    editor.dispatch({
      changes: {
        from: 0,
        to: editor.state.doc.length,
        insert: value,
      },
    })
    externalUpdate.value = false
  }
)

onBeforeUnmount(() => {
  view.value?.destroy()
  view.value = undefined
})
</script>

<template>
  <div ref="editorRef" class="workflow-json-editor" />
</template>

<style scoped>
.workflow-json-editor {
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background: rgb(var(--w-bg-main));
  border: 1px solid rgb(var(--w-border-color-2));
  border-radius: 8px;
}

:deep(.cm-editor) {
  height: 100%;
}
</style>
