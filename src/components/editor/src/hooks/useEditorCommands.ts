import { isEditorHeadingLevel } from '../utils'
import type { EditorLocale } from '../types'
import type { Editor as TiptapEditor } from '@tiptap/vue-3'
import type { Ref, ShallowRef } from 'vue'

interface UseEditorCommandsOptions {
  readonly editor: ShallowRef<TiptapEditor | undefined>
  readonly model: Ref<string>
  readonly disabled: () => boolean
  readonly imageInputRef: Readonly<Ref<HTMLInputElement | null>>
  readonly refreshEditorState: () => void
  readonly maxImageSize: () => number
  readonly uploadImage: () => EditorImageUploader | undefined
  readonly onImageUploadError: (error: Error, file: File) => void
  readonly onImageUploadSuccess: (url: string, file: File) => void
  readonly locale: () => EditorLocale
}

type EditorImageUploader = (file: File) => Promise<string>

export function useEditorCommands(options: UseEditorCommandsOptions) {
  const {
    editor,
    model,
    disabled,
    imageInputRef,
    refreshEditorState,
    maxImageSize,
    uploadImage,
    onImageUploadError,
    onImageUploadSuccess,
    locale,
  } = options

  function runCommand(callback: (currentEditor: TiptapEditor) => void) {
    const currentEditor = editor.value
    if (!currentEditor || disabled()) return
    callback(currentEditor)
    currentEditor.commands.focus()
    refreshEditorState()
  }

  function setBlock(value: string | number) {
    runCommand((currentEditor) => {
      const block = String(value)
      if (block === 'paragraph') {
        currentEditor.chain().focus().setParagraph().run()
        return
      }

      const headingLevel = Number(block)
      if (!isEditorHeadingLevel(headingLevel)) return

      currentEditor.chain().focus().toggleHeading({ level: headingLevel }).run()
    })
  }

  function setFontFamily(value: string | number) {
    runCommand((currentEditor) => {
      const fontFamily = String(value)
      if (!fontFamily) {
        currentEditor.chain().focus().unsetFontFamily().run()
        return
      }

      currentEditor.chain().focus().setFontFamily(fontFamily).run()
    })
  }

  function setFontSize(value: string | number) {
    runCommand((currentEditor) => {
      const fontSize = String(value)
      const chain = currentEditor.chain().focus()
      if (!fontSize) {
        chain
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run()
        return
      }

      chain.setMark('textStyle', { fontSize }).run()
    })
  }

  function setTextColor(value: string | number) {
    runCommand((currentEditor) => {
      const color = String(value)
      if (!color) {
        currentEditor.chain().focus().unsetColor().run()
        return
      }

      currentEditor.chain().focus().setColor(color).run()
    })
  }

  function setHighlightColor(value: string | number) {
    runCommand((currentEditor) => {
      const color = String(value)
      if (!color) {
        currentEditor.chain().focus().unsetHighlight().run()
        return
      }

      currentEditor.chain().focus().toggleHighlight({ color }).run()
    })
  }

  function setLink() {
    runCommand((currentEditor) => {
      const href = currentEditor.getAttributes('link').href
      const previousUrl = typeof href === 'string' ? href : undefined
      const url = window.prompt(locale().linkPrompt, previousUrl ?? 'https://')

      if (url === null) return
      if (!url.trim()) {
        currentEditor.chain().focus().extendMarkRange('link').unsetLink().run()
        return
      }

      currentEditor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url.trim() })
        .run()
    })
  }

  function insertImageFromUrl() {
    runCommand((currentEditor) => {
      const url = window.prompt(locale().imagePrompt, 'https://')
      if (!url?.trim()) return
      currentEditor.chain().focus().setImage({ src: url.trim() }).run()
    })
  }

  function openImageUpload() {
    imageInputRef.value?.click()
  }

  async function handleImageSelect(event: Event) {
    const input = event.target
    if (!(input instanceof HTMLInputElement)) return
    const file = input.files?.[0]
    if (!file) return
    input.value = ''

    try {
      if (!file.type.startsWith('image/')) {
        throw new Error(locale().imageInvalid)
      }
      if (file.size > maxImageSize()) {
        const limit = Math.max(1, Math.round(maxImageSize() / 1024 / 1024))
        throw new Error(locale().imageTooLarge(limit))
      }

      const uploader = uploadImage()
      const src = uploader
        ? await uploader(file)
        : await readFileAsDataUrl(file)
      if (!src.trim()) throw new Error(locale().imageEmpty)
      runCommand((currentEditor) => {
        currentEditor.chain().focus().setImage({ src, alt: file.name }).run()
      })
      onImageUploadSuccess(src, file)
    } catch (error) {
      onImageUploadError(toError(error), file)
    }
  }

  function readFileAsDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result ?? ''))
      reader.onerror = () =>
        reject(reader.error ?? new Error(locale().imageReadFailed))
      reader.readAsDataURL(file)
    })
  }

  function toError(error: unknown) {
    return error instanceof Error ? error : new Error(String(error))
  }

  function handleTableAction(key: string) {
    runCommand((currentEditor) => {
      const chain = currentEditor.chain().focus()

      switch (key) {
        case 'insertTable':
          chain.insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          break
        case 'addColumnBefore':
          chain.addColumnBefore().run()
          break
        case 'addColumnAfter':
          chain.addColumnAfter().run()
          break
        case 'deleteColumn':
          chain.deleteColumn().run()
          break
        case 'addRowBefore':
          chain.addRowBefore().run()
          break
        case 'addRowAfter':
          chain.addRowAfter().run()
          break
        case 'deleteRow':
          chain.deleteRow().run()
          break
        case 'toggleHeaderRow':
          chain.toggleHeaderRow().run()
          break
        case 'toggleHeaderColumn':
          chain.toggleHeaderColumn().run()
          break
        case 'mergeOrSplit':
          chain.mergeOrSplit().run()
          break
        case 'deleteTable':
          chain.deleteTable().run()
          break
      }
    })
  }

  function clearFormatting() {
    runCommand((currentEditor) => {
      currentEditor
        .chain()
        .focus()
        .unsetColor()
        .unsetHighlight()
        .unsetFontFamily()
        .setMark('textStyle', { fontSize: null })
        .clearNodes()
        .unsetAllMarks()
        .removeEmptyTextStyle()
        .run()
    })
  }

  function undo() {
    runCommand((currentEditor) => currentEditor.chain().focus().undo().run())
  }

  function redo() {
    runCommand((currentEditor) => currentEditor.chain().focus().redo().run())
  }

  function focus() {
    editor.value?.commands.focus()
  }

  function clear() {
    model.value = ''
    if (!editor.value) return
    runCommand((currentEditor) => {
      currentEditor.commands.clearContent()
    })
  }

  function getHTML() {
    return editor.value?.getHTML() ?? model.value
  }

  function getText() {
    return editor.value?.state.doc.textContent ?? ''
  }

  function setHTML(value: string) {
    const currentEditor = editor.value
    model.value = value
    if (!currentEditor) return
    currentEditor.commands.setContent(value, { emitUpdate: false })
    refreshEditorState()
  }

  function insertHTML(value: string) {
    if (!editor.value) {
      model.value = `${model.value}${value}`
      return
    }

    runCommand((currentEditor) => {
      currentEditor.chain().focus().insertContent(value).run()
    })
  }

  return {
    runCommand,
    setBlock,
    setFontFamily,
    setFontSize,
    setTextColor,
    setHighlightColor,
    setLink,
    insertImageFromUrl,
    openImageUpload,
    handleImageSelect,
    handleTableAction,
    clearFormatting,
    undo,
    redo,
    focus,
    clear,
    getHTML,
    getText,
    setHTML,
    insertHTML,
  }
}

export type EditorCommands = ReturnType<typeof useEditorCommands>
