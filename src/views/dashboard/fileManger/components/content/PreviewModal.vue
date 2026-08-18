<script setup lang="ts">
import { computed } from 'vue'
import {
  FilePreview as BaseFilePreviewModal,
  type FilePreviewKind,
  type FilePreviewSource,
} from '@/components/filePreview'
import type { IFile } from '../types'
import { getFileCategoryByType, getFileExtension } from '../utils'

const file = defineModel<IFile | null>('file', {
  required: true,
})

const open = computed({
  get: () => Boolean(file.value),
  set: (value) => {
    if (!value) file.value = null
  },
})

const previewSource = computed<FilePreviewSource | null>(() => {
  if (!file.value) return null

  return {
    filename: file.value.fileName,
    kind: getPreviewKind(file.value),
    mimeType: file.value.mimeType || file.value.fileRawType,
    size: file.value.fileSize,
    url: file.value.fileUrl,
  }
})

function getPreviewKind(item: IFile): FilePreviewKind {
  const extension = item.fileExtension || getFileExtension(item.fileName)
  const category = getFileCategoryByType(item.fileType)

  if (category === 'image') return 'image'
  if (category === 'video') return 'video'
  if (category === 'audio') return 'audio'
  if (category === 'code') return 'text'
  if (extension === 'pdf') return 'pdf'
  if (textExtensions.has(extension)) return 'text'
  if (wordExtensions.has(extension)) return 'word'
  if (excelExtensions.has(extension)) return 'excel'
  if (powerpointExtensions.has(extension)) return 'powerpoint'
  if (category === 'archive') return 'archive'

  return 'unknown'
}

const textExtensions = new Set([
  'css',
  'csv',
  'html',
  'js',
  'json',
  'log',
  'md',
  'ts',
  'tsx',
  'txt',
  'vue',
  'xml',
  'yaml',
  'yml',
])
const wordExtensions = new Set(['doc', 'docx', 'dot', 'dotx', 'rtf'])
const excelExtensions = new Set(['xls', 'xlsm', 'xlsx'])
const powerpointExtensions = new Set(['pot', 'potx', 'ppt', 'pptx'])
</script>

<template>
  <BaseFilePreviewModal v-model:open="open" :file="previewSource" />
</template>
