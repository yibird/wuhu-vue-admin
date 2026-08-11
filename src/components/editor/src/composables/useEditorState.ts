import { computed } from 'vue'
import { editorHeadingLevels } from '../constants'
import { getStringAttribute } from '../utils'
import type { Editor as TiptapEditor } from '@tiptap/vue-3'
import type { ShallowRef } from 'vue'

export function useEditorState(
  editor: ShallowRef<TiptapEditor | undefined>,
  editorStateVersion: ShallowRef<number>
) {
  const currentBlock = computed(() => {
    void editorStateVersion.value
    const currentEditor = editor.value
    if (!currentEditor) return 'paragraph'

    for (const level of editorHeadingLevels) {
      if (currentEditor.isActive('heading', { level })) return String(level)
    }

    return 'paragraph'
  })

  const currentTextStyle = computed<Record<string, unknown>>(() => {
    void editorStateVersion.value
    return editor.value?.getAttributes('textStyle') ?? {}
  })

  const currentFontFamily = computed(() =>
    getStringAttribute(currentTextStyle.value, 'fontFamily')
  )
  const currentFontSize = computed(() =>
    getStringAttribute(currentTextStyle.value, 'fontSize')
  )
  const currentTextColor = computed(() =>
    getStringAttribute(currentTextStyle.value, 'color')
  )

  const currentHighlightColor = computed(() => {
    void editorStateVersion.value
    return getStringAttribute(
      editor.value?.getAttributes('highlight') ?? {},
      'color'
    )
  })

  const characterCount = computed(() => {
    void editorStateVersion.value
    return editor.value?.storage.characterCount?.characters() ?? 0
  })

  const wordCount = computed(() => {
    void editorStateVersion.value
    return editor.value?.storage.characterCount?.words() ?? 0
  })

  const canUndo = computed(() => {
    void editorStateVersion.value
    return editor.value?.can().undo() ?? false
  })

  const canRedo = computed(() => {
    void editorStateVersion.value
    return editor.value?.can().redo() ?? false
  })

  const isLinkActive = computed(() => {
    void editorStateVersion.value
    return editor.value?.isActive('link') ?? false
  })

  const isTableActive = computed(() => {
    void editorStateVersion.value
    return editor.value?.isActive('table') ?? false
  })

  return {
    currentBlock,
    currentFontFamily,
    currentFontSize,
    currentTextColor,
    currentHighlightColor,
    characterCount,
    wordCount,
    canUndo,
    canRedo,
    isLinkActive,
    isTableActive,
  }
}
