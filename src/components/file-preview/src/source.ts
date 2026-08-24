import { resolveSafeResourceUrl } from '@/utils'

import type { FilePreviewKind, FilePreviewSource } from './types'

const imageExtensions = new Set([
  'apng',
  'avif',
  'bmp',
  'gif',
  'heic',
  'heif',
  'ico',
  'jpeg',
  'jpg',
  'png',
  'svg',
  'tif',
  'tiff',
  'webp',
])
const videoExtensions = new Set([
  'avi',
  'flv',
  'm4v',
  'mkv',
  'mov',
  'mp4',
  'webm',
  'wmv',
])
const audioExtensions = new Set(['aac', 'flac', 'm4a', 'mp3', 'ogg', 'wav'])
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
const excelExtensions = new Set(['csv', 'xls', 'xlsm', 'xlsx'])
const powerpointExtensions = new Set(['pot', 'potx', 'ppt', 'pptx'])
const archiveExtensions = new Set([
  '7z',
  'bz2',
  'gz',
  'rar',
  'tar',
  'tgz',
  'xz',
  'zip',
])

export function getFileExtension(filename: string) {
  const dotIndex = filename.lastIndexOf('.')
  if (dotIndex < 0 || dotIndex === filename.length - 1) return ''
  return filename.slice(dotIndex + 1).toLowerCase()
}

export function inferFilePreviewKind(
  file?: Pick<FilePreviewSource, 'filename' | 'mimeType'> | null
): FilePreviewKind {
  const type = file?.mimeType?.trim().toLowerCase() ?? ''
  const extension = getFileExtension(file?.filename ?? '')

  if (type.startsWith('image/')) return 'image'
  if (type.startsWith('video/')) return 'video'
  if (type.startsWith('audio/')) return 'audio'
  if (type === 'application/pdf') return 'pdf'
  if (
    type.startsWith('text/') ||
    ['application/json', 'application/javascript', 'application/xml'].includes(
      type
    )
  ) {
    return 'text'
  }

  if ((!type || type === 'application/octet-stream') && extension === 'pdf') {
    return 'pdf'
  }
  if (wordExtensions.has(extension)) return 'word'
  if (excelExtensions.has(extension)) return 'excel'
  if (powerpointExtensions.has(extension)) return 'powerpoint'
  if (archiveExtensions.has(extension)) return 'archive'
  if (textExtensions.has(extension)) return 'text'
  if (imageExtensions.has(extension)) return 'image'
  if (videoExtensions.has(extension)) return 'video'
  if (audioExtensions.has(extension)) return 'audio'

  return 'unknown'
}

export function resolveFilePreviewUrl(file?: FilePreviewSource | null) {
  return resolveSafeResourceUrl(file?.url)
}
