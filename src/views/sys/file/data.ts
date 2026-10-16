import type { FileKind } from '@/apis'

/**
 * 文件分类展示配置
 */
export const fileKindMeta: Record<
  FileKind,
  {
    /**
     * @desc 分类名称
     */
    label: string
    /**
     * @desc 分类图标(lucide 类名)
     */
    icon: string
    /**
     * @desc 标签颜色
     */
    color: string
  }
> = {
  image: { label: '图片', icon: 'i-lucide:image', color: 'blue' },
  video: { label: '视频', icon: 'i-lucide:video', color: 'purple' },
  audio: { label: '音频', icon: 'i-lucide:music', color: 'cyan' },
  document: { label: '文档', icon: 'i-lucide:file-text', color: 'geekblue' },
  archive: { label: '压缩包', icon: 'i-lucide:file-archive', color: 'orange' },
  other: { label: '其他', icon: 'i-lucide:file', color: 'default' },
}

/**
 * 取文件分类的展示配置
 *
 * 表格插槽里的 record 是 any,这里收敛一次类型并兜底未知分类
 *
 * @param kind 文件分类
 */
export function resolveFileKindMeta(kind: FileKind) {
  return fileKindMeta[kind] ?? fileKindMeta.other
}

/**
 * 文件分类下拉选项
 */
export const fileKindOptions = (Object.keys(fileKindMeta) as FileKind[]).map(
  (value) => ({
    label: fileKindMeta[value].label,
    value,
  })
)

const archiveExtensions = new Set([
  'zip',
  'rar',
  '7z',
  'tar',
  'gz',
  'tgz',
  'bz2',
])
const documentExtensions = new Set([
  'csv',
  'doc',
  'docx',
  'json',
  'log',
  'md',
  'pdf',
  'ppt',
  'pptx',
  'sql',
  'txt',
  'xls',
  'xlsx',
  'xml',
  'yaml',
  'yml',
])

/**
 * 根据 MIME 类型与文件名推断文件分类
 *
 * @param mimeType 文件 MIME 类型
 * @param name 文件名
 */
export function inferFileKind(mimeType: string, name: string): FileKind {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('audio/')) return 'audio'
  if (mimeType === 'application/pdf') return 'document'

  const extension = name.includes('.')
    ? name.split('.').pop()!.toLowerCase()
    : ''
  if (archiveExtensions.has(extension)) return 'archive'
  if (documentExtensions.has(extension)) return 'document'
  return 'other'
}

/**
 * 格式化文件大小
 *
 * @param size 文件大小(字节)
 */
export function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`

  const units = ['KB', 'MB', 'GB', 'TB']
  let value = size / 1024
  let unitIndex = 0
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }
  return `${value.toFixed(value >= 100 ? 0 : 1)} ${units[unitIndex]}`
}

/**
 * 读取文件内容为 dataURL
 *
 * mock 环境用它替代真实上传,接入后端后可换成上传接口
 *
 * @param file 待读取的文件
 */
export function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(String(reader.result)))
    reader.addEventListener('error', () => reject(reader.error))
    reader.readAsDataURL(file)
  })
}
