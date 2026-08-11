export interface EditorSelectOption {
  readonly label: string
  readonly value: string
}

export interface EditorColorOption extends EditorSelectOption {
  readonly color: string
}

export type EditorHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export interface EditorToolbarItem {
  readonly key: string
  readonly icon: string
  readonly title: string | (() => string)
  readonly active?: () => boolean
  readonly disabled?: () => boolean
  readonly action: () => void
}

export interface EditorLocale {
  addColumnAfter: string
  addColumnBefore: string
  addRowAfter: string
  addRowBefore: string
  alignCenter: string
  alignJustify: string
  alignLeft: string
  alignRight: string
  blockquote: string
  bold: string
  bulletList: string
  characterUnit: string
  clearFormatting: string
  code: string
  codeBlock: string
  deleteColumn: string
  deleteRow: string
  deleteTable: string
  editorName: string
  horizontalRule: string
  image: string
  imageEmpty: string
  imageInvalid: string
  imagePrompt: string
  imageReadFailed: string
  imageTooLarge: (limitMb: number) => string
  insertTable: string
  italic: string
  link: string
  linkPrompt: string
  localImage: string
  mergeOrSplit: string
  orderedList: string
  redo: string
  strike: string
  subscript: string
  superscript: string
  table: string
  taskList: string
  toggleHeaderColumn: string
  toggleHeaderRow: string
  underline: string
  undo: string
  urlImage: string
  wordUnit: string
}

export interface EditorProps {
  /**
   * @desc 占位符文本
   * @default '请输入内容...'
   */
  placeholder?: string
  /**
   * @desc 编辑器最小高度
   * @default 420
   */
  minHeight?: number | string
  /**
   * @desc 编辑器最大高度
   */
  maxHeight?: number | string
  /**
   * @desc 是否禁用编辑器
   * @default false
   */
  disabled?: boolean
  /**
   * @desc 自定义字体选项
   */
  fontFamilyOptions?: readonly EditorSelectOption[]
  blockOptions?: readonly EditorSelectOption[]
  fontSizeOptions?: readonly EditorSelectOption[]
  textColorOptions?: readonly EditorColorOption[]
  highlightColorOptions?: readonly EditorColorOption[]
  locale?: Partial<EditorLocale>
  showSelectControls?: boolean
  /** 图片允许的最大字节数，默认 2 MB。 */
  maxImageSize?: number
  /** 上传图片并返回可长期访问的 URL；未提供时使用受大小限制的 Base64。 */
  uploadImage?: (file: File) => Promise<string>
}

export interface EditorEmits {
  imageUploadError: [error: Error, file: File]
  imageUploadSuccess: [url: string, file: File]
}

export interface EditorToolbarProps {
  /**
   * @desc 是否禁用工具栏
   */
  readonly disabled?: boolean
  readonly showSelectControls?: boolean
  /**
   * @desc 当前区块类型
   */
  readonly currentBlock: string
  /**
   * @desc 当前字体族
   */
  readonly currentFontFamily: string
  /**
   * @desc 当前字体大小
   */
  readonly currentFontSize: string
  /**
   * @desc 当前文本颜色
   */
  readonly currentTextColor: string
  /**
   * @desc 当前高亮颜色
   */
  readonly currentHighlightColor: string
  /**
   * @desc 区块选项
   */
  readonly blockOptions: readonly EditorSelectOption[]
  /**
   * @desc 字体族选项
   */
  readonly fontFamilyOptions: readonly EditorSelectOption[]
  /**
   * @desc 字体大小选项
   */
  readonly fontSizeOptions: readonly EditorSelectOption[]
  /**
   * @desc 文本颜色选项
   */
  readonly textColorOptions: readonly EditorColorOption[]
  /**
   * @desc 高亮颜色选项
   */
  readonly highlightColorOptions: readonly EditorColorOption[]
  /**
   * @desc 行内工具项
   */
  readonly inlineItems: readonly EditorToolbarItem[]
  /**
   * @desc 区块工具项
   */
  readonly blockItems: readonly EditorToolbarItem[]
  /**
   * @desc 对齐工具项
   */
  readonly alignItems: readonly EditorToolbarItem[]
  /**
   * @desc 图片菜单
   */
  readonly imageMenu: import('antdv-next').MenuProps
  /**
   * @desc 表格菜单
   */
  readonly tableMenu: import('antdv-next').MenuProps
  /**
   * @desc 是否可撤销
   */
  readonly canUndo: boolean
  /**
   * @desc 是否可重做
   */
  readonly canRedo: boolean
  /**
   * @desc 链接是否激活
   */
  readonly isLinkActive: boolean
  /**
   * @desc 表格是否激活
   */
  readonly isTableActive: boolean
  /**
   * @desc 按钮样式类名函数
   */
  readonly buttonClass: (active?: boolean) => string
  readonly stateVersion: number
  readonly locale: EditorLocale
}

export interface EditorToolbarEmits {
  setBlock: [value: string | number]
  setFontFamily: [value: string | number]
  setFontSize: [value: string | number]
  setTextColor: [value: string | number]
  setHighlightColor: [value: string | number]
  setLink: []
  clearFormatting: []
  undo: []
  redo: []
}

export interface EditorExpose {
  focus: () => void
  clear: () => void
  getHTML: () => string
  getText: () => string
  setHTML: (value: string) => void
  insertHTML: (value: string) => void
}
