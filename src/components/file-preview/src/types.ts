/**
 * 文件预览类型
 */
export type FilePreviewKind =
  | 'image'
  | 'video'
  | 'audio'
  | 'text'
  | 'pdf'
  | 'word'
  | 'excel'
  | 'powerpoint'
  | 'archive'
  | 'unknown'

export interface FilePreviewSource {
  /**
   * 文件名，同时作为预览标题
   */
  filename: string
  /**
   * 文件地址
   */
  url?: string
  /**
   * 文件 MIME 类型
   */
  mimeType?: string
  /**
   * 文件大小，单位为字节
   */
  size?: number
  /**
   * 指定的预览类型，未提供时根据文件名与 MIME 类型推断
   */
  kind?: FilePreviewKind
}

export interface FilePreviewProps {
  /**
   * @desc 是否打开预览
   */
  open: boolean
  /**
   * @desc 预览文件
   * @default null
   */
  file?: FilePreviewSource | null
  /**
   * @desc 文本预览允许读取的最大字节数
   * @default 2 * 1024 * 1024
   */
  maxTextBytes?: number
  /**
   * @desc 可由业务 i18n 层注入的显示文案
   */
  locale?: Partial<FilePreviewLocale>
}

/**
 * 文件预览内置文案
 */
export interface FilePreviewLocale {
  /**
   * 默认标题
   */
  defaultTitle: string
  /**
   * 空状态提示文案
   */
  emptyText: string
  /**
   * 进入全屏操作的辅助说明文案
   */
  enterFullscreen: string
  /**
   * 退出全屏操作的辅助说明文案
   */
  exitFullscreen: string
  /**
   * 文本文件缺少可读取地址时的提示文案
   */
  missingTextUrl: string
  /**
   * PDF 预览标题
   */
  pdfTitle: string
  /**
   * 文本预览区域 aria-label 的后缀文案
   */
  textAriaSuffix: string
  /**
   * 文本读取失败时的提示文案
   */
  textLoadFailed: string
  /**
   * 文本读取中的提示文案
   */
  textLoading: string
  /**
   * 文本超过大小限制时的提示文案
   */
  textTooLarge: (maxSize: string) => string
  /**
   * 文件没有可预览地址时的说明文案
   */
  unsupportedDescription: string
  /**
   * 文件有地址但类型不支持预览时的说明文案
   */
  unsupportedDescriptionWithUrl: string
  /**
   * 各类型不支持在线预览时的标题文案
   */
  unsupportedTitles: Record<
    'archive' | 'excel' | 'powerpoint' | 'unknown' | 'word',
    string
  >
  /**
   * 部分类型不支持在线预览时的补充说明文案
   */
  unsupportedTypeDescriptions: Partial<
    Record<'excel' | 'powerpoint' | 'word', string>
  >
}
