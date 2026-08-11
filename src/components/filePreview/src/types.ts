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
  filename: string
  url?: string
  mimeType?: string
  size?: number
  kind?: FilePreviewKind
}

export interface FilePreviewProps {
  open: boolean
  file?: FilePreviewSource | null
  /** 文本预览允许读取的最大字节数。 */
  maxTextBytes?: number
  /** 可由业务 i18n 层注入的显示文案。 */
  locale?: Partial<FilePreviewLocale>
}

export interface FilePreviewLocale {
  defaultTitle: string
  emptyText: string
  enterFullscreen: string
  exitFullscreen: string
  missingTextUrl: string
  pdfTitle: string
  textAriaSuffix: string
  textLoadFailed: string
  textLoading: string
  textTooLarge: (maxSize: string) => string
  unsupportedDescription: string
  unsupportedDescriptionWithUrl: string
  unsupportedTitles: Record<
    'archive' | 'excel' | 'powerpoint' | 'unknown' | 'word',
    string
  >
  unsupportedTypeDescriptions: Partial<
    Record<'excel' | 'powerpoint' | 'word', string>
  >
}
