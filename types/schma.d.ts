export interface PageMeta {
  /**
   * 页面权限
   */
  permissions?: string[]

  /**
   * 页面是否缓存
   */
  keepAlive?: boolean
}

export interface PageSchema {
  /**
   * 页面ID
   */
  id: string
  /**
   * 页面名称
   */
  name: string
  /**
   * 版本号
   */
  version: string
  /**
   * 页面元数据
   */
  meta?: PageMeta
  /**
   * 创建时间
   */
  createdAt?: string | null
  /**
   * 更新时间
   */
  updatedAt?: string | null
}

export interface NodeEvent<TArgs = unknown, TReturn = unknown> {
  /**
   * 事件名称, 例如 click、change
   */
  name: string

  type?: number
  /**
   * 事件参数
   */
  args?: TArgs
  /**
   * 事件参数长度,可变参数为-1
   */
  argLength?: number
  /**
   * 事件返回值
   */
  returnType?: TReturn
}

export interface NodeSchema<
  TProps extends Record<string, unknown> = Record<string, unknown>,
> {
  /**
   * 节点ID
   */
  id: string
  /**
   * 节点name
   */
  name: string
  /**
   * 节点类型
   */
  type: string
  /**
   * 节点props
   */
  props: TProps
  /**
   * 节点事件
   */
  events?: NodeEvent[]
  /**
   * 节点子元素
   */
  children: NodeSchema<TProps>[]
}

export interface Schema {
  /**
   * 页面信息
   */
  page: PageSchema

  /**
   * 节点列表
   */
  nodes: NodeSchema[]
}
