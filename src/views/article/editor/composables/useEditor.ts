import {
  useClipboard,
  useFileDialog,
  useLocalStorage,
  useMagicKeys,
  watchDebounced,
  whenever,
} from '@vueuse/core'
import { message, Modal, type MenuProps } from 'antdv-next'
import { articleItems } from '../../data'
import { STORAGE_KEYS, TEMPLATE_MAP, createInitialDocuments } from '../data'
import type {
  DeviceMode,
  EditorComment,
  EditorContentExpose,
  EditorDocument,
  EditorMode,
  EditorVersion,
  OutlineItem,
} from '../types'
import {
  buildExportHtml,
  buildSummary,
  downloadTextFile,
  extractOutline,
  formatDateTime,
  htmlToMarkdown,
  htmlToText,
  normalizeImportedContent,
  sanitizeFilename,
  sanitizeHtml,
} from '../utils'

const initialDocuments = createInitialDocuments()
const initialDocumentIds = new Set(initialDocuments.map((item) => item.id))

articleItems.forEach((article) => {
  if (initialDocumentIds.has(article.id)) return
  initialDocuments.push({
    id: article.id,
    title: article.title,
    summary: article.summary,
    content: `<h2>${article.title}</h2><p>${article.summary}</p>`,
    tags: [...article.tags],
    status: article.status,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
  })
})

export function useEditor() {
  // ─── Storage ───
  const documents = useLocalStorage<EditorDocument[]>(
    STORAGE_KEYS.documents,
    initialDocuments
  )
  const storedDocumentIds = new Set(documents.value.map((item) => item.id))
  const missingDocuments = initialDocuments.filter(
    (item) => !storedDocumentIds.has(item.id)
  )
  if (missingDocuments.length) {
    documents.value = [
      ...documents.value,
      ...missingDocuments.map((item) => ({ ...item, tags: [...item.tags] })),
    ]
  }
  const activeDocumentId = useLocalStorage(
    STORAGE_KEYS.activeId,
    initialDocuments[0].id
  )
  const documentVersions = useLocalStorage<Record<string, EditorVersion[]>>(
    STORAGE_KEYS.versions,
    {}
  )
  const documentComments = useLocalStorage<Record<string, EditorComment[]>>(
    STORAGE_KEYS.comments,
    {}
  )

  // ─── Refs ───
  const editorContentRef = useTemplateRef<EditorContentExpose>('editorContent')
  const activeMode = shallowRef<EditorMode>('edit')
  const deviceMode = shallowRef<DeviceMode>('desktop')
  const keyword = shallowRef('')
  const editingContent = shallowRef('')
  const sourceContent = shallowRef('')
  const lastSavedAt = shallowRef('')
  const dirty = shallowRef(false)
  const titleDraft = shallowRef('')
  const previewOpen = shallowRef(false)
  const outlineOpen = shallowRef(true)
  const isRenaming = shallowRef(false)
  const renameValue = shallowRef('')
  const importModalOpen = shallowRef(false)
  const importContent = shallowRef('')
  const documentDrawerOpen = shallowRef(false)
  const commentDraft = shallowRef('')

  // ─── Clipboard & File ───
  const { copy, isSupported: isClipboardSupported } = useClipboard({
    legacy: true,
  })
  const { open: openFileDialog, onChange: onImportFileChange } = useFileDialog({
    accept: '.html,.htm,.txt,.md',
    multiple: false,
    reset: true,
  })

  // ─── Computed ───
  const activeDocument = computed(
    () =>
      documents.value.find((item) => item.id === activeDocumentId.value) ??
      documents.value[0]
  )

  const filteredDocuments = computed(() => {
    const text = keyword.value.trim().toLowerCase()
    if (!text) return documents.value
    return documents.value.filter(
      (item) =>
        item.title.toLowerCase().includes(text) ||
        item.summary.toLowerCase().includes(text) ||
        item.tags.some((tag) => tag.toLowerCase().includes(text))
    )
  })

  const safeContent = computed(() => sanitizeHtml(editingContent.value))
  const plainText = computed(() => htmlToText(editingContent.value))
  const wordCount = computed(() => plainText.value.length)
  const paragraphCount = computed(() => {
    const text = plainText.value.trim()
    if (!text) return 0
    return text.split(/\n+/).filter(Boolean).length
  })
  const readingMinutes = computed(() =>
    Math.max(1, Math.ceil(wordCount.value / 450))
  )
  const documentStatusText = computed(() => {
    const status = activeDocument.value?.status
    if (status === 'published') return '已发布'
    if (status === 'archived') return '已归档'
    return '草稿'
  })
  const saveText = computed(() => {
    if (dirty.value) return '有未保存更改'
    return lastSavedAt.value ? `已保存 ${lastSavedAt.value}` : '已保存'
  })
  const previewWidthClass = computed(() => {
    switch (deviceMode.value) {
      case 'mobile':
        return 'max-w-390'
      case 'tablet':
        return 'max-w-760'
      default:
        return 'max-w-full'
    }
  })
  const outline = computed<OutlineItem[]>(() =>
    extractOutline(editingContent.value)
  )
  const activeVersions = computed(
    () => documentVersions.value[activeDocumentId.value] ?? []
  )
  const activeComments = computed(
    () => documentComments.value[activeDocumentId.value] ?? []
  )
  const unresolvedCommentCount = computed(
    () => activeComments.value.filter((item) => !item.resolved).length
  )

  // ─── Watchers ───
  watch(activeDocumentId, () => loadActiveDocument(), { immediate: true })

  watch(editingContent, (value) => {
    if (!activeDocument.value) return
    dirty.value = value !== activeDocument.value.content
    if (activeMode.value !== 'source') {
      sourceContent.value = value
    }
  })

  watch(sourceContent, (value) => {
    if (activeMode.value !== 'source') return
    editingContent.value = value
    editorContentRef.value?.setHTML(value)
  })

  watchDebounced(
    editingContent,
    () => {
      if (dirty.value) {
        lastSavedAt.value = '自动保存待确认'
      }
    },
    { debounce: 800, maxWait: 2000 }
  )

  // ─── Keyboard shortcuts ───
  const keys = useMagicKeys({
    passive: false,
    onEventFired(event) {
      if (event.type !== 'keydown' || (!event.ctrlKey && !event.metaKey)) return
      if (event.key.toLowerCase() === 's') {
        event.preventDefault()
      }
    },
  })

  whenever(keys['Ctrl+S'], () => saveDocument())
  whenever(keys['Meta+S'], () => saveDocument())

  // ─── File import ───
  onImportFileChange(async (files) => {
    const file = files?.[0]
    if (!file) return
    importContent.value = await file.text()
    importModalOpen.value = true
  })

  // ─── Actions ───
  function loadActiveDocument() {
    const doc = activeDocument.value
    if (!doc) return
    titleDraft.value = doc.title
    editingContent.value = doc.content
    sourceContent.value = doc.content
    dirty.value = false
    lastSavedAt.value = doc.updatedAt
    activeMode.value = 'edit'
    nextTick(() => editorContentRef.value?.setHTML(doc.content))
  }

  function selectDocument(id: string) {
    if (!documents.value.some((item) => item.id === id)) return false
    activeDocumentId.value = id
    documentDrawerOpen.value = false
    return true
  }

  function createDocument() {
    const now = formatDateTime()
    const doc: EditorDocument = {
      id: `doc-${Date.now().toString(36)}`,
      title: '未命名文档',
      summary: '新的富文本文档',
      content: '<h2>未命名文档</h2><p>从这里开始编写内容。</p>',
      tags: ['草稿'],
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    }
    documents.value = [doc, ...documents.value]
    activeDocumentId.value = doc.id
    message.success('文档已创建')
    return doc
  }

  function duplicateDocument(doc: EditorDocument) {
    const now = formatDateTime()
    const clone: EditorDocument = {
      ...doc,
      id: `doc-${Date.now().toString(36)}`,
      title: `${doc.title} 副本`,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    }
    documents.value = [clone, ...documents.value]
    activeDocumentId.value = clone.id
    message.success('已复制文档')
  }

  function deleteDocument(doc: EditorDocument) {
    Modal.confirm({
      title: '删除文档',
      content: `确定删除「${doc.title}」吗？`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        const remaining = documents.value.filter((item) => item.id !== doc.id)
        documents.value = remaining.length
          ? remaining
          : createInitialDocuments()
        activeDocumentId.value = documents.value[0]?.id ?? ''
        message.success('文档已删除')
      },
    })
  }

  function getDocumentActionMenu(doc: EditorDocument): {
    items: MenuProps['items']
    onClick: MenuProps['onClick']
  } {
    return {
      items: [
        { key: 'copy', label: '复制文档' },
        { key: 'delete', label: '删除文档', danger: true },
      ],
      onClick: ({ key }) => {
        if (key === 'copy') {
          duplicateDocument(doc)
          return
        }
        deleteDocument(doc)
      },
    }
  }

  function getSelectedDocumentClass(documentId: string) {
    return activeDocumentId.value === documentId
      ? 'border-color-primary bg-selected'
      : 'border-color-1 bg-container-secondary'
  }

  function saveDocument() {
    const doc = activeDocument.value
    if (!doc) return
    const now = formatDateTime()
    documents.value = documents.value.map((item) =>
      item.id === doc.id
        ? {
            ...item,
            title: titleDraft.value.trim() || '未命名文档',
            summary: buildSummary(editingContent.value),
            content: editingContent.value,
            updatedAt: now,
          }
        : item
    )
    dirty.value = false
    lastSavedAt.value = now
    message.success('文档已保存')
  }

  function saveVersion() {
    const doc = activeDocument.value
    if (!doc) return
    const version: EditorVersion = {
      id: `version-${Date.now().toString(36)}`,
      content: editingContent.value,
      createdAt: formatDateTime(),
      documentId: doc.id,
      title: titleDraft.value.trim() || doc.title,
      wordCount: wordCount.value,
    }
    documentVersions.value = {
      ...documentVersions.value,
      [doc.id]: [version, ...(documentVersions.value[doc.id] ?? [])].slice(
        0,
        8
      ),
    }
    message.success('版本快照已保存')
  }

  function restoreVersion(version: EditorVersion) {
    Modal.confirm({
      title: '恢复版本',
      content: `确定恢复「${version.title}」吗？当前未保存内容会被覆盖。`,
      okText: '恢复',
      cancelText: '取消',
      onOk: () => {
        editingContent.value = version.content
        sourceContent.value = version.content
        titleDraft.value = version.title
        editorContentRef.value?.setHTML(version.content)
        dirty.value = true
        message.success('版本已恢复')
      },
    })
  }

  function addComment() {
    const doc = activeDocument.value
    const content = commentDraft.value.trim()
    if (!doc || !content) return
    const comment: EditorComment = {
      id: `comment-${Date.now().toString(36)}`,
      author: '协作者',
      content,
      createdAt: formatDateTime(),
      documentId: doc.id,
      resolved: false,
    }
    documentComments.value = {
      ...documentComments.value,
      [doc.id]: [comment, ...(documentComments.value[doc.id] ?? [])],
    }
    commentDraft.value = ''
  }

  function toggleCommentResolved(commentId: string) {
    const doc = activeDocument.value
    if (!doc) return
    documentComments.value = {
      ...documentComments.value,
      [doc.id]: activeComments.value.map((item) =>
        item.id === commentId ? { ...item, resolved: !item.resolved } : item
      ),
    }
  }

  function resetDocument() {
    const doc = activeDocument.value
    if (!doc) return
    Modal.confirm({
      title: '恢复上次保存',
      content: '当前未保存内容会被上次保存内容覆盖。',
      okText: '恢复',
      cancelText: '取消',
      onOk: () => {
        editingContent.value = doc.content
        sourceContent.value = doc.content
        titleDraft.value = doc.title
        dirty.value = false
        editorContentRef.value?.setHTML(doc.content)
      },
    })
  }

  function updateStatus(status: EditorDocument['status']) {
    const doc = activeDocument.value
    if (!doc) return
    const now = formatDateTime()
    documents.value = documents.value.map((item) =>
      item.id === doc.id ? { ...item, status, updatedAt: now } : item
    )
    message.success(status === 'published' ? '文档已发布' : '状态已更新')
  }

  function startRename() {
    renameValue.value = activeDocument.value?.title ?? ''
    isRenaming.value = true
    nextTick(() => {
      const input = document.querySelector<HTMLInputElement>(
        '[data-editor-title-input]'
      )
      input?.focus()
      input?.select()
    })
  }

  function confirmRename() {
    const value = renameValue.value.trim()
    if (!value || !activeDocument.value) {
      isRenaming.value = false
      return
    }
    titleDraft.value = value
    isRenaming.value = false
    saveDocument()
  }

  function insertTemplate(type: 'meeting' | 'release' | 'todo') {
    activeMode.value = 'edit'
    nextTick(() => {
      editorContentRef.value?.insertHTML(TEMPLATE_MAP[type])
      editingContent.value =
        editorContentRef.value?.getHTML() ?? editingContent.value
    })
  }

  function applyImportedContent() {
    const content = normalizeImportedContent(importContent.value)
    if (!content) {
      message.warning('没有可导入的内容')
      return
    }
    editingContent.value = content
    sourceContent.value = content
    editorContentRef.value?.setHTML(content)
    dirty.value = true
    importModalOpen.value = false
    message.success('内容已导入')
  }

  function copyDocumentHtml() {
    if (!isClipboardSupported.value) {
      message.warning('当前环境不支持复制')
      return
    }
    copy(editingContent.value).then(() => {
      message.success('HTML 已复制')
    })
  }

  function exportDocument(format: 'html' | 'md' | 'txt') {
    const doc = activeDocument.value
    if (!doc) return
    const content =
      format === 'html'
        ? buildExportHtml(doc, editingContent.value)
        : format === 'md'
          ? htmlToMarkdown(editingContent.value)
          : plainText.value
    const mimeType = {
      html: 'text/html;charset=utf-8',
      md: 'text/markdown;charset=utf-8',
      txt: 'text/plain;charset=utf-8',
    }[format]
    const filename = `${sanitizeFilename(doc.title)}.${format}`
    downloadTextFile(filename, content, mimeType)
  }

  function handleModeChange(mode: EditorMode) {
    activeMode.value = mode
    if (mode === 'source') {
      sourceContent.value = editingContent.value
    }
  }

  function handleSegmentedModeChange(value: string | number) {
    handleModeChange(value as EditorMode)
  }

  return {
    // refs
    editorContentRef,
    activeMode,
    deviceMode,
    keyword,
    editingContent,
    sourceContent,
    titleDraft,
    previewOpen,
    outlineOpen,
    isRenaming,
    renameValue,
    importModalOpen,
    importContent,
    documentDrawerOpen,
    commentDraft,
    // computed
    documents,
    activeDocument,
    filteredDocuments,
    safeContent,
    wordCount,
    paragraphCount,
    readingMinutes,
    documentStatusText,
    saveText,
    previewWidthClass,
    outline,
    activeVersions,
    activeComments,
    unresolvedCommentCount,
    dirty,
    lastSavedAt,
    // actions
    selectDocument,
    createDocument,
    getDocumentActionMenu,
    getSelectedDocumentClass,
    saveDocument,
    saveVersion,
    restoreVersion,
    addComment,
    toggleCommentResolved,
    resetDocument,
    updateStatus,
    startRename,
    confirmRename,
    insertTemplate,
    applyImportedContent,
    copyDocumentHtml,
    exportDocument,
    openFileDialog,
    handleModeChange,
    handleSegmentedModeChange,
  }
}
