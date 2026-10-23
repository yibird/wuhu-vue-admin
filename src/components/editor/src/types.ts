/**
 * 编辑器下拉选项
 */
export interface EditorSelectOption {
  /**
   * 选项显示文本
   */
  readonly label: string
  /**
   * 选项值
   */
  readonly value: string
}

/**
 * 编辑器颜色选项
 */
export interface EditorColorOption extends EditorSelectOption {
  /**
   * 选项色值
   */
  readonly color: string
}

/**
 * 编辑器标题级别
 */
export type EditorHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

/**
 * 编辑器工具栏按钮项
 */
export interface EditorToolbarItem {
  /**
   * 按钮唯一标识
   */
  readonly key: string
  /**
   * 按钮图标名称
   */
  readonly icon: string
  /**
   * 按钮提示文本
   */
  readonly title: string | (() => string)
  /**
   * 按钮激活状态判断函数
   */
  readonly active?: () => boolean
  /**
   * 按钮禁用状态判断函数
   */
  readonly disabled?: () => boolean
  /**
   * 按钮点击时执行的回调
   */
  readonly action: () => void
}

/**
 * 编辑器界面文案
 */
export interface EditorLocale {
  /**
   * 右侧插入列
   */
  addColumnAfter: string
  /**
   * 左侧插入列
   */
  addColumnBefore: string
  /**
   * 下方插入行
   */
  addRowAfter: string
  /**
   * 上方插入行
   */
  addRowBefore: string
  /**
   * 居中对齐
   */
  alignCenter: string
  /**
   * 两端对齐
   */
  alignJustify: string
  /**
   * 左对齐
   */
  alignLeft: string
  /**
   * 右对齐
   */
  alignRight: string
  /**
   * 引用块
   */
  blockquote: string
  /**
   * 加粗
   */
  bold: string
  /**
   * 无序列表
   */
  bulletList: string
  /**
   * 字符数单位
   */
  characterUnit: string
  /**
   * 清除格式
   */
  clearFormatting: string
  /**
   * 行内代码
   */
  code: string
  /**
   * 代码块
   */
  codeBlock: string
  /**
   * 删除当前列
   */
  deleteColumn: string
  /**
   * 删除当前行
   */
  deleteRow: string
  /**
   * 删除表格
   */
  deleteTable: string
  /**
   * 编辑器名称
   */
  editorName: string
  /**
   * 分割线
   */
  horizontalRule: string
  /**
   * 图片
   */
  image: string
  /**
   * 图片上传结果为空提示
   */
  imageEmpty: string
  /**
   * 非图片文件提示
   */
  imageInvalid: string
  /**
   * 图片地址输入提示
   */
  imagePrompt: string
  /**
   * 图片读取失败提示
   */
  imageReadFailed: string
  /**
   * 图片超出大小限制提示，参数为限制的 MB 数
   */
  imageTooLarge: (limitMb: number) => string
  /**
   * 插入表格
   */
  insertTable: string
  /**
   * 斜体
   */
  italic: string
  /**
   * 链接
   */
  link: string
  /**
   * 链接地址输入提示
   */
  linkPrompt: string
  /**
   * 本地图片
   */
  localImage: string
  /**
   * 合并或拆分单元格
   */
  mergeOrSplit: string
  /**
   * 有序列表
   */
  orderedList: string
  /**
   * 重做
   */
  redo: string
  /**
   * 删除线
   */
  strike: string
  /**
   * 下标
   */
  subscript: string
  /**
   * 上标
   */
  superscript: string
  /**
   * 表格
   */
  table: string
  /**
   * 任务列表
   */
  taskList: string
  /**
   * 切换表头列
   */
  toggleHeaderColumn: string
  /**
   * 切换表头行
   */
  toggleHeaderRow: string
  /**
   * 下划线
   */
  underline: string
  /**
   * 撤销
   */
  undo: string
  /**
   * 图片链接
   */
  urlImage: string
  /**
   * 词数单位
   */
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
  fontOptions?: readonly EditorSelectOption[]
  /**
   * @desc 自定义区块选项
   */
  blockOptions?: readonly EditorSelectOption[]
  /**
   * @desc 自定义字号选项
   */
  fontSizeOptions?: readonly EditorSelectOption[]
  /**
   * @desc 自定义文本颜色选项
   */
  textColorOptions?: readonly EditorColorOption[]
  /**
   * @desc 自定义高亮颜色选项
   */
  highlightColorOptions?: readonly EditorColorOption[]
  /**
   * @desc 自定义界面文案，会与内置文案合并
   */
  locale?: Partial<EditorLocale>
  /**
   * @desc 是否显示工具栏中的下拉控件
   * @default true
   */
  showSelectControls?: boolean
  /**
   * @desc 图片允许的最大字节数
   * @default 2 * 1024 * 1024
   */
  maxImageSize?: number
  /**
   * @desc 上传图片并返回可长期访问的 URL；未提供时使用受大小限制的 Base64
   */
  uploadImage?: (file: File) => Promise<string>
}

export interface EditorEmits {
  /**
   * @desc 图片上传失败时触发
   */
  imageUploadError: [error: Error, file: File]
  /**
   * @desc 图片上传成功时触发
   */
  imageUploadSuccess: [url: string, file: File]
}

export interface EditorToolbarProps {
  /**
   * @desc 是否禁用工具栏
   */
  readonly disabled?: boolean
  /**
   * @desc 是否显示下拉控件
   */
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
  readonly fontOptions: readonly EditorSelectOption[]
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
  /**
   * @desc 编辑器状态版本号，用于触发工具栏更新
   */
  readonly stateVersion: number
  /**
   * @desc 界面文案
   */
  readonly locale: EditorLocale
}

export interface EditorToolbarEmits {
  /**
   * @desc 设置区块类型时触发
   */
  setBlock: [value: string | number]
  /**
   * @desc 设置字体族时触发
   */
  setFontFamily: [value: string | number]
  /**
   * @desc 设置字体大小时触发
   */
  setFontSize: [value: string | number]
  /**
   * @desc 设置文本颜色时触发
   */
  setTextColor: [value: string | number]
  /**
   * @desc 设置高亮颜色时触发
   */
  setHighlightColor: [value: string | number]
  /**
   * @desc 点击链接按钮时触发,由上层打开链接弹窗
   */
  openLink: []
  /**
   * @desc 清除格式时触发
   */
  clearFormatting: []
  /**
   * @desc 撤销时触发
   */
  undo: []
  /**
   * @desc 重做时触发
   */
  redo: []
}

export interface EditorExpose {
  /**
   * @desc 聚焦编辑器
   */
  focus: () => void
  /**
   * @desc 清空编辑器内容
   */
  clear: () => void
  /**
   * @desc 获取 HTML 内容
   */
  getHTML: () => string
  /**
   * @desc 获取纯文本内容
   */
  getText: () => string
  /**
   * @desc 设置 HTML 内容
   */
  setHTML: (value: string) => void
  /**
   * @desc 插入 HTML 内容
   */
  insertHTML: (value: string) => void
}
