import {
  FILE_TYPE,
  type FileCategory,
  type FileSortBy,
  type FileType,
  type FileTypeValue,
  type FileViewMode,
} from './types'

export interface FileOption<T extends string> {
  label: string
  value: T
}

export const fileCategoryOptions: FileOption<FileCategory>[] = [
  { label: '全部', value: 'all' },
  { label: '图片', value: 'image' },
  { label: '文档', value: 'document' },
  { label: '视频', value: 'video' },
  { label: '音频', value: 'audio' },
  { label: '压缩包', value: 'archive' },
  { label: '代码', value: 'code' },
  { label: '回收站', value: 'trash' },
  { label: '其他', value: 'other' },
]

export const fileSortOptions: FileOption<FileSortBy>[] = [
  { label: '最近更新', value: 'updateTime' },
  { label: '文件名称', value: 'name' },
  { label: '文件大小', value: 'size' },
  { label: '文件类型', value: 'type' },
]

export const fileViewOptions: FileOption<FileViewMode>[] = [
  { label: '网格', value: 'grid' },
  { label: '列表', value: 'list' },
]

const extensionCategoryMap: Record<FileType, string[]> = {
  image: [
    'apng',
    'avif',
    'bmp',
    'gif',
    'heic',
    'heif',
    'ico',
    'jpg',
    'jpeg',
    'png',
    'svg',
    'tif',
    'tiff',
    'webp',
  ],
  document: [
    'txt',
    'md',
    'pdf',
    'doc',
    'docx',
    'xls',
    'xlsx',
    'csv',
    'ppt',
    'pptx',
  ],
  video: ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm', 'm4v'],
  audio: ['mp3', 'wav', 'm4a', 'flac', 'aac', 'ogg'],
  archive: ['zip', 'rar', '7z', 'tar', 'gz', 'tgz', 'bz2', 'xz'],
  code: [
    'css',
    'html',
    'js',
    'json',
    'less',
    'scss',
    'ts',
    'tsx',
    'vue',
    'xml',
    'yaml',
    'yml',
  ],
  other: [],
}

const fileCategoryTypeMap: Record<FileType, FileTypeValue> = {
  image: FILE_TYPE.IMAGE,
  document: FILE_TYPE.DOCUMENT,
  video: FILE_TYPE.VIDEO,
  audio: FILE_TYPE.AUDIO,
  archive: FILE_TYPE.ARCHIVE,
  code: FILE_TYPE.CODE,
  other: FILE_TYPE.OTHER,
}

const fileTypeCategoryMap: Record<FileTypeValue, FileType> = {
  [FILE_TYPE.OTHER]: 'other',
  [FILE_TYPE.IMAGE]: 'image',
  [FILE_TYPE.DOCUMENT]: 'document',
  [FILE_TYPE.VIDEO]: 'video',
  [FILE_TYPE.AUDIO]: 'audio',
  [FILE_TYPE.ARCHIVE]: 'archive',
  [FILE_TYPE.CODE]: 'code',
}

export function getFileExtension(fileName: string) {
  const dotIndex = fileName.lastIndexOf('.')
  if (dotIndex < 0 || dotIndex === fileName.length - 1) return ''
  return fileName.slice(dotIndex + 1).toLowerCase()
}

export function getFileNameWithoutExtension(fileName: string) {
  const dotIndex = fileName.lastIndexOf('.')
  return dotIndex > 0 ? fileName.slice(0, dotIndex) : fileName
}

export function getFileCategory(fileName: string, rawType = ''): FileType {
  const type = rawType.toLowerCase()
  if (type.startsWith('image/')) return 'image'
  if (type.startsWith('video/')) return 'video'
  if (type.startsWith('audio/')) return 'audio'

  const extension = getFileExtension(fileName)
  const category = Object.entries(extensionCategoryMap).find(([, extensions]) =>
    extensions.includes(extension)
  )?.[0]

  return (category as FileType | undefined) ?? 'other'
}

export function getFileTypeByName(fileName: string, rawType = '') {
  return fileCategoryTypeMap[getFileCategory(fileName, rawType)]
}

export function getFileCategoryByType(fileType: FileTypeValue) {
  return fileTypeCategoryMap[fileType] ?? 'other'
}

export function getFileCategoryLabel(
  categoryOrType: FileCategory | FileTypeValue
) {
  const category =
    typeof categoryOrType === 'number'
      ? getFileCategoryByType(categoryOrType)
      : categoryOrType
  return (
    fileCategoryOptions.find((item) => item.value === category)?.label ?? '其他'
  )
}

export function formatFileSize(size = 0) {
  if (!Number.isFinite(size) || size <= 0) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const index = Math.min(
    Math.floor(Math.log(size) / Math.log(1024)),
    units.length - 1
  )
  const value = size / 1024 ** index
  return `${value >= 10 || index === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[index]}`
}

export function getUniqueFilename(fileName: string, existingNames: string[]) {
  const names = new Set(existingNames.map((item) => item.toLowerCase()))
  if (!names.has(fileName.toLowerCase())) return fileName

  const dotIndex = fileName.lastIndexOf('.')
  const name = dotIndex > 0 ? fileName.slice(0, dotIndex) : fileName
  const extension = dotIndex > 0 ? fileName.slice(dotIndex) : ''
  let index = 1
  let nextFileName = `${name} (${index})${extension}`

  while (names.has(nextFileName.toLowerCase())) {
    index += 1
    nextFileName = `${name} (${index})${extension}`
  }

  return nextFileName
}
