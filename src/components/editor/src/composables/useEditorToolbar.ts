import type { EditorCommands } from './useEditorCommands'
import type { EditorLocale, EditorToolbarItem } from '../types'
import type { Editor as TiptapEditor } from '@tiptap/vue-3'
import type { MenuProps } from 'antdv-next'
import type { ShallowRef } from 'vue'
import { computed } from 'vue'

export function useEditorToolbar(
  editor: ShallowRef<TiptapEditor | undefined>,
  commands: EditorCommands,
  locale: () => EditorLocale
) {
  const inlineItems: EditorToolbarItem[] = [
    {
      key: 'bold',
      icon: 'i-lucide:bold',
      title: () => locale().bold,
      active: () => editor.value?.isActive('bold') ?? false,
      action: () =>
        commands.runCommand((editor) =>
          editor.chain().focus().toggleBold().run()
        ),
    },
    {
      key: 'italic',
      icon: 'i-lucide:italic',
      title: () => locale().italic,
      active: () => editor.value?.isActive('italic') ?? false,
      action: () =>
        commands.runCommand((editor) =>
          editor.chain().focus().toggleItalic().run()
        ),
    },
    {
      key: 'underline',
      icon: 'i-lucide:underline',
      title: () => locale().underline,
      active: () => editor.value?.isActive('underline') ?? false,
      action: () =>
        commands.runCommand((editor) =>
          editor.chain().focus().toggleUnderline().run()
        ),
    },
    {
      key: 'strike',
      icon: 'i-lucide:strikethrough',
      title: () => locale().strike,
      active: () => editor.value?.isActive('strike') ?? false,
      action: () =>
        commands.runCommand((editor) =>
          editor.chain().focus().toggleStrike().run()
        ),
    },
    {
      key: 'code',
      icon: 'i-lucide:braces',
      title: () => locale().code,
      active: () => editor.value?.isActive('code') ?? false,
      action: () =>
        commands.runCommand((editor) =>
          editor.chain().focus().toggleCode().run()
        ),
    },
    {
      key: 'subscript',
      icon: 'i-lucide:subscript',
      title: () => locale().subscript,
      active: () => editor.value?.isActive('subscript') ?? false,
      action: () =>
        commands.runCommand((editor) =>
          editor.chain().focus().toggleSubscript().run()
        ),
    },
    {
      key: 'superscript',
      icon: 'i-lucide:superscript',
      title: () => locale().superscript,
      active: () => editor.value?.isActive('superscript') ?? false,
      action: () =>
        commands.runCommand((editor) =>
          editor.chain().focus().toggleSuperscript().run()
        ),
    },
  ]

  const blockItems: EditorToolbarItem[] = [
    {
      key: 'bulletList',
      icon: 'i-lucide:list',
      title: () => locale().bulletList,
      active: () => editor.value?.isActive('bulletList') ?? false,
      action: () =>
        commands.runCommand((editor) =>
          editor.chain().focus().toggleBulletList().run()
        ),
    },
    {
      key: 'orderedList',
      icon: 'i-lucide:list-ordered',
      title: () => locale().orderedList,
      active: () => editor.value?.isActive('orderedList') ?? false,
      action: () =>
        commands.runCommand((editor) =>
          editor.chain().focus().toggleOrderedList().run()
        ),
    },
    {
      key: 'taskList',
      icon: 'i-lucide:list-checks',
      title: () => locale().taskList,
      active: () => editor.value?.isActive('taskList') ?? false,
      action: () =>
        commands.runCommand((editor) =>
          editor.chain().focus().toggleTaskList().run()
        ),
    },
    {
      key: 'blockquote',
      icon: 'i-lucide:quote',
      title: () => locale().blockquote,
      active: () => editor.value?.isActive('blockquote') ?? false,
      action: () =>
        commands.runCommand((editor) =>
          editor.chain().focus().toggleBlockquote().run()
        ),
    },
    {
      key: 'codeBlock',
      icon: 'i-lucide:code-2',
      title: () => locale().codeBlock,
      active: () => editor.value?.isActive('codeBlock') ?? false,
      action: () =>
        commands.runCommand((editor) =>
          editor.chain().focus().toggleCodeBlock().run()
        ),
    },
    {
      key: 'horizontalRule',
      icon: 'i-lucide:minus',
      title: () => locale().horizontalRule,
      action: () =>
        commands.runCommand((editor) =>
          editor.chain().focus().setHorizontalRule().run()
        ),
    },
  ]

  const alignItems: EditorToolbarItem[] = [
    {
      key: 'left',
      icon: 'i-lucide:align-left',
      title: () => locale().alignLeft,
      active: () => editor.value?.isActive({ textAlign: 'left' }) ?? false,
      action: () =>
        commands.runCommand((editor) =>
          editor.chain().focus().setTextAlign('left').run()
        ),
    },
    {
      key: 'center',
      icon: 'i-lucide:align-center',
      title: () => locale().alignCenter,
      active: () => editor.value?.isActive({ textAlign: 'center' }) ?? false,
      action: () =>
        commands.runCommand((editor) =>
          editor.chain().focus().setTextAlign('center').run()
        ),
    },
    {
      key: 'right',
      icon: 'i-lucide:align-right',
      title: () => locale().alignRight,
      active: () => editor.value?.isActive({ textAlign: 'right' }) ?? false,
      action: () =>
        commands.runCommand((editor) =>
          editor.chain().focus().setTextAlign('right').run()
        ),
    },
    {
      key: 'justify',
      icon: 'i-lucide:align-justify',
      title: () => locale().alignJustify,
      active: () => editor.value?.isActive({ textAlign: 'justify' }) ?? false,
      action: () =>
        commands.runCommand((editor) =>
          editor.chain().focus().setTextAlign('justify').run()
        ),
    },
  ]

  const tableMenu = computed<MenuProps>(() => ({
    items: [
      { key: 'insertTable', label: locale().insertTable },
      { type: 'divider' },
      { key: 'addColumnBefore', label: locale().addColumnBefore },
      { key: 'addColumnAfter', label: locale().addColumnAfter },
      { key: 'deleteColumn', label: locale().deleteColumn },
      { type: 'divider' },
      { key: 'addRowBefore', label: locale().addRowBefore },
      { key: 'addRowAfter', label: locale().addRowAfter },
      { key: 'deleteRow', label: locale().deleteRow },
      { type: 'divider' },
      { key: 'toggleHeaderRow', label: locale().toggleHeaderRow },
      { key: 'toggleHeaderColumn', label: locale().toggleHeaderColumn },
      { key: 'mergeOrSplit', label: locale().mergeOrSplit },
      { type: 'divider' },
      { key: 'deleteTable', label: locale().deleteTable, danger: true },
    ],
    onClick: ({ key }) => commands.handleTableAction(String(key)),
  }))

  const imageMenu = computed<MenuProps>(() => ({
    items: [
      { key: 'url', label: locale().urlImage },
      { key: 'upload', label: locale().localImage },
    ],
    onClick: ({ key }) => {
      if (key === 'url') {
        commands.insertImageFromUrl()
        return
      }
      commands.openImageUpload()
    },
  }))

  function getToolbarButtonClass(active?: boolean) {
    return active
      ? 'bg-primary-tint text-primary'
      : 'text-secondary hover:(bg-hover text-primary)'
  }

  return {
    inlineItems,
    blockItems,
    alignItems,
    tableMenu,
    imageMenu,
    getToolbarButtonClass,
  }
}
