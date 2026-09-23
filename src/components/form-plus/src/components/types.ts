export interface QueryButtonProps {
  /**
   * @desc 是否显示查询按钮
   */
  showSearch?: boolean
  /**
   * @desc 是否显示重置按钮
   */
  showReset?: boolean
  /**
   * @desc 查询按钮文案
   * @default "查询"
   */
  searchText?: string
  /**
   * @desc 重置按钮文案
   * @default "重置"
   */
  resetText?: string
  /**
   * @desc 查询回调
   */
  onSearch?: () => void
  /**
   * @desc 重置回调
   */
  onReset?: () => void
}
