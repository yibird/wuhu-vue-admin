export type FormPlusBreakpoint =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'xxl'
  | 'xxxl'

/**
 * 响应式列数配置,key 为断点,value 为该断点起的列数
 */
export type FormPlusResponsiveCols = Partial<Record<FormPlusBreakpoint, number>>

/**
 * 栅格布局配置
 */
export interface FormPlusGrid {
  /**
   * @desc 栅格列数,1 表示不使用栅格;
   * 传对象时按断点配置列数(如 `{ lg: 4, xxl: 6 }`),未声明的低断点沿用最小的已声明列数
   * @default 1
   */
  cols?: number | FormPlusResponsiveCols
  /**
   * @desc 水平间距
   */
  xGap?: number
  /**
   * @desc 垂直间距
   */
  yGap?: number
}

/**
 * 查询表单折叠配置
 */
export interface FormPlusCollapse {
  /**
   * @desc 折叠时可见的表单项数量
   * @default 3
   */
  visibleCount?: number
  /**
   * @desc 初始是否折叠
   * @default true
   */
  defaultCollapsed?: boolean
  /**
   * @desc 重置时是否恢复折叠态
   * @default true
   */
  resetOnReset?: boolean
}

/**
 * 操作区按钮配置
 */
