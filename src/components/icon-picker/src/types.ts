/**
 * 图标选择器的尺寸
 */
export type IconSelectorSize = 'small' | 'middle' | 'large'

/**
 * 图标选项
 */
export interface IconSelectorOption {
  /**
   * 所属分类
   */
  category?: string
  /**
   * 是否禁用该选项
   */
  disabled?: boolean
  /**
   * 搜索关键词
   */
  keywords?: string[]
  /**
   * 选项显示文本
   */
  label: string
  /**
   * 选项值，即图标名称
   */
  value: string
}

/**
 * 图标分类项
 */
export interface IconCategoryItem {
  /**
   * 该分类包含的图标数量
   */
  count: number
  /**
   * 分类图标名称
   */
  icon: string
  /**
   * 分类唯一标识
   */
  key: string
  /**
   * 分类显示名称
   */
  label: string
}

/**
 * 图标选项输入，支持直接传入图标名称
 */
export type IconSelectorOptionInput = string | IconSelectorOption

export interface IconSelectorProps {
  /**
   * @desc 是否允许清空已选图标
   * @default true
   */
  allowClear?: boolean
  /**
   * @desc 清空按钮文案
   * @default 'Clear icon'（仅 IconPicker）
   */
  clearText?: string
  /**
   * @desc 是否禁用
   * @default false
   */
  disabled?: boolean
  /**
   * @desc 空状态文本
   * @default 'No icons found'
   */
  emptyText?: string
  /**
   * @desc 图标尺寸
   * @default IconSelector 为 18，IconPicker 为 20
   */
  iconSize?: number
  /**
   * @desc 图标数据，未提供时使用内置图标数据
   */
  icons?: IconSelectorOptionInput[]
  /**
   * @desc 图标网格列数
   * @default IconSelector 为 6，IconPicker 为 7
   */
  gridColumns?: number
  /**
   * @desc 最多展示的图标数量，0 表示不限制
   * @default 0
   */
  maxVisible?: number
  /**
   * @desc 弹层是否展开
   * @default false
   */
  open?: boolean
  /**
   * @desc 占位文本
   * @default 'Select icon'
   */
  placeholder?: string
  /**
   * @desc 弹层最大高度
   * @default 420
   */
  popupMaxHeight?: number
  /**
   * @desc 弹层宽度
   * @default 620（仅 IconSelector）
   */
  popupWidth?: number | string
  /**
   * @desc 搜索框占位文本
   * @default 'Search icons'
   */
  searchPlaceholder?: string
  /**
   * @desc 是否显示分类导航
   * @default true
   */
  showCategories?: boolean
  /**
   * @desc 控件尺寸
   * @default 'middle'
   */
  size?: IconSelectorSize
  /**
   * @desc 标题
   * @default 'Select icon'
   */
  title?: string
  /**
   * @desc 触发器的可访问名称，未提供时由标题和占位文本拼接
   */
  triggerLabel?: string
  /**
   * @desc 已选图标名称
   */
  value?: string
  /**
   * @desc 虚拟列表预渲染数量
   * @default 4
   */
  virtualOverscan?: number
  /**
   * @desc 弹窗宽度
   * @default 760（仅 IconPicker）
   */
  width?: number | string
}

export interface IconOptionEmits {
  /**
   * @desc 选中图标变化时触发
   */
  (e: 'update:value', value: string | undefined): void
  /**
   * @desc 选中图标变化时触发，同时携带完整选项
   */
  (e: 'change', value: string | undefined, option?: IconSelectorOption): void
  /**
   * @desc 选中某个图标时触发
   */
  (e: 'select', value: string, option: IconSelectorOption): void
  /**
   * @desc 清空选中图标时触发
   */
  (e: 'clear'): void
  /**
   * @desc 搜索关键词变化时触发
   */
  (e: 'search', keyword: string): void
}

export interface IconSelectorEmits extends IconOptionEmits {
  /**
   * @desc 弹层展开状态变化时触发
   */
  (e: 'update:open', open: boolean): void
}

/**
 * 图标选择器（弹窗模式）属性
 */
export type IconPickerProps = IconSelectorProps
export interface IconPickerEmits extends IconOptionEmits {
  /**
   * @desc 弹窗展开状态变化时触发
   */
  (e: 'update:open', open: boolean): void
}
