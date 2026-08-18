export type JsonPrimitive = string | number | boolean | null

export type JsonValue =
  | JsonPrimitive
  | { [key: string]: JsonValue }
  | JsonValue[]

export type JsonViewProps = {
  /** 要展示的 JSON 数据。 */
  data?: JsonValue

  /**
   * 是否禁止编辑。
   * @default true
   */
  readonly?: boolean
  /** JSON 缩进空格数，传 0 时使用紧凑格式。 */
  indent?: number
  /** 编辑器容器高度，数字按 px 处理。 */
  height?: number | string

  /**
   * 是否显示边框。
   * @default true
   */
  bordered?: boolean
  /**
   * 是否显示复制按钮。
   * @default true
   */
  showCopy?: boolean
}

export interface JsonViewEmits {
  (event: 'update:data', data: JsonValue): void
  (event: 'copy', data: JsonValue): void
}
