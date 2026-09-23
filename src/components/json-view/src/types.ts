/**
 * JSON 原始值
 */
export type JsonPrimitive = string | number | boolean | null

/**
 * JSON 值
 */
export type JsonValue =
  | JsonPrimitive
  | { [key: string]: JsonValue }
  | JsonValue[]

export type JsonViewProps = {
  /**
   * @desc 要展示的 JSON 数据。
   * @default {}
   */
  data?: JsonValue
  /**
   * @desc 深层原地修改 data 时递增此版本以触发重新格式化。
   */
  version?: string | number
  /**
   * @desc 是否禁止编辑。
   * @default true
   */
  readonly?: boolean
  /**
   * @desc JSON 缩进空格数，传 0 时使用紧凑格式。
   * @default 2
   */
  indent?: number
  /**
   * @desc 编辑器容器高度，数字按 px 处理。
   * @default 320
   */
  height?: number | string
  /**
   * @desc 是否显示边框。
   * @default true
   */
  bordered?: boolean
  /**
   * @desc 是否显示复制按钮。
   * @default true
   */
  showCopy?: boolean
}

export interface JsonViewEmits {
  /**
   * @desc 数据更新事件
   * @param data 更新后的 JSON 数据
   */
  (event: 'update:data', data: JsonValue): void
  /**
   * @desc 复制事件
   * @param data 被复制的 JSON 数据
   */
  (event: 'copy', data: JsonValue): void
}
