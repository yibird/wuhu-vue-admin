export type JsonPrimitive = string | number | boolean | null

export type JsonValue =
  | JsonPrimitive
  | { [key: string]: JsonValue }
  | JsonValue[]

export type JsonViewProps = {
  /**
   * @desc 要展示的 JSON 数据。
   * @default
   */
  data?: JsonValue
  /**
   * @desc 深层原地修改 data 时递增此版本以触发重新格式化。
   * @default
   */
  version?: string | number
  /**
   * @desc 是否禁止编辑。
   * @default true
   */
  readonly?: boolean
  /**
   * @desc JSON 缩进空格数，传 0 时使用紧凑格式。
   * @default
   */
  indent?: number
  /**
   * @desc 编辑器容器高度，数字按 px 处理。
   * @default
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
  (event: 'update:data', data: JsonValue): void
  (event: 'copy', data: JsonValue): void
}
