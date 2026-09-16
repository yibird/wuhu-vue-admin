/**
 * 低代码应用 Schema 类型定义。
 *
 * Schema 是整个平台的唯一事实来源（Single Source of Truth）：
 * 设计器编辑 Schema，Runtime 解析 Schema，AI/导入导出同样围绕 Schema 工作。
 * 本文件只包含类型与常量（仅 type-only 引用 vue 的 Component 类型）。
 */
import type { Component } from 'vue'

/** 表达式：统一的动态值描述（受控沙箱内求值） */
export type Expression = string

/**
 * 组件种类：
 * - 0 普通组件：叶节点，例如 Button / Input
 * - 1 容器组件：可通过 children 嵌套其它组件，例如 Flex / Grid / Form
 * - 2 物料组件：来自物料中心的远程组件
 */
export type ComponentKind = 0 | 1 | 2

export const COMPONENT_KIND = {
  normal: 0,
  container: 1,
  material: 2,
} as const satisfies Record<string, ComponentKind>

/** 布局模式：决定画布拖拽行为与运行时排布方式 */
export type LayoutMode = 'block' | 'flex' | 'grid' | 'free'

export type AlignItems = 'start' | 'center' | 'end' | 'stretch'
export type JustifyContent =
  | 'start'
  | 'center'
  | 'end'
  | 'between'
  | 'around'
  | 'evenly'

/** 响应式断点（设计器设备与运行时视口共用） */
export type Breakpoint = 'tablet' | 'mobile'

/** 组件样式（设计器只产出描述，渲染层统一转换为 CSS 变量/内联样式） */
export interface StyleSchema {
  // 尺寸
  width?: string | number
  height?: string | number
  minWidth?: string | number
  maxWidth?: string | number
  minHeight?: string | number
  maxHeight?: string | number
  // 间距
  padding?: string
  margin?: string
  gap?: number
  // 自由布局定位
  position?: 'static' | 'relative' | 'absolute'
  left?: number
  top?: number
  zIndex?: number
  // 容器布局
  layout?: LayoutMode
  direction?: 'row' | 'column'
  align?: AlignItems
  justify?: JustifyContent
  wrap?: boolean
  columns?: number
  span?: number
  // 外观
  background?: string
  color?: string
  fontSize?: number
  fontWeight?: number | 'normal' | 'bold'
  textAlign?: 'left' | 'center' | 'right'
  borderWidth?: number
  borderStyle?: 'solid' | 'dashed' | 'dotted'
  borderColor?: string
  borderRadius?: number
  shadow?: string
  opacity?: number
  overflow?: 'visible' | 'hidden' | 'auto'
  className?: string
  /** 断点样式覆盖：PC 为基础样式，平板/移动端在其基础上覆盖 */
  responsive?: Partial<Record<Breakpoint, Omit<StyleSchema, 'responsive'>>>
}

/** 事件：声明组件事件触发哪些 Action（按顺序执行） */
export interface EventSchema {
  name: string
  actions: string[]
  /** 运行时拦截开关：false 时设计器不派发（例如预览态禁用） */
  enabled?: boolean
}

/**
 * 组件实例 Schema。
 * 只描述实例（配置/绑定/事件/层级），不描述组件实现；
 * 组件能力、属性、事件由 ComponentDefinition 提供。
 */
export interface ComponentSchema {
  /** 唯一节点 ID */
  id: string
  /** 组件种类，见 ComponentKind */
  __type: ComponentKind
  /** 组件类型（对应 ComponentRegistry 中的 type） */
  type: string
  /** 设计器内显示名称，未设置时使用定义的 title */
  name?: string
  /** 静态配置 */
  props?: Record<string, unknown>
  /** 动态表达式绑定：propName -> Expression */
  bindings?: Record<string, Expression>
  /** 子组件 */
  children?: ComponentSchema[]
  /** 事件绑定 */
  events?: EventSchema[]
  /** 显示条件表达式 */
  visible?: Expression
  /** 禁用条件表达式 */
  disabled?: Expression
  /** 样式 */
  style?: StyleSchema
  /** 设计器锁定（不允许在画布上选择/拖动） */
  locked?: boolean
  /** 设计器隐藏 */
  hidden?: boolean
}

/** 数据源 */
export interface DataSourceSchema {
  id: string
  name: string
  type: 'static' | 'rest'
  config: {
    url?: string
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    headers?: Record<string, string>
    /** 静态数据源的值（支持 ValueSchema） */
    value?: ValueSchema
    /** 请求超时（ms） */
    timeout?: number
  }
}

/** 静态值或表达式 */
export type ValueSchema =
  | {
      type: 'value'
      value: unknown
    }
  | {
      type: 'expression'
      value: Expression
    }

/** 查询：数据源 + 参数 + 结果转换 */
export interface QuerySchema {
  id: string
  name: string
  dataSourceId: string
  /** 查询参数 */
  params?: Record<string, ValueSchema>
  /** 结果转换表达式，可通过 queries.<id> 引用结果或用 `_` 指向当前结果 */
  transform?: Expression
  /** 触发时机：手动 / 页面加载 / 轮询 */
  trigger?: 'manual' | 'pageLoad'
  /** 轮询间隔（ms），设置后 trigger 视为 interval */
  interval?: number
  /** 查询失败时是否抛出中断（默认 false，仅记录错误） */
  strict?: boolean
}

/** Action 实例：最小可执行行为单元 */
export interface ActionSchema {
  id: string
  name?: string
  /** Action 类型，由 ActionRegistry 提供实现 */
  type: string
  /** 参数，值支持静态值或表达式 */
  params?: Record<string, ValueSchema>
}

/** Workflow 步骤 */
export interface ActionStepSchema {
  id: string
  type: 'action'
  action: string
}

export interface ConditionStepSchema {
  id: string
  type: 'condition'
  condition: Expression
  then: WorkflowStepSchema[]
  else?: WorkflowStepSchema[]
}

export interface ParallelStepSchema {
  id: string
  type: 'parallel'
  steps: WorkflowStepSchema[]
}

export interface LoopStepSchema {
  id: string
  type: 'loop'
  items: Expression
  item?: string
  steps: WorkflowStepSchema[]
}

export type WorkflowStepSchema =
  | ActionStepSchema
  | ConditionStepSchema
  | ParallelStepSchema
  | LoopStepSchema

/** 通用步骤包装：错误处理 */
export type WorkflowStep = WorkflowStepSchema & {
  onError?: WorkflowStepSchema[]
}

export interface TriggerSchema {
  type: 'manual' | 'pageLoad' | 'componentEvent' | 'schedule' | 'webhook'
  config?: Record<string, unknown>
}

export interface WorkflowSchema {
  id: string
  name: string
  description?: string
  trigger?: TriggerSchema
  steps: WorkflowStep[]
}

/** 应用变量 */
export interface VariableSchema {
  id: string
  name: string
  type: 'string' | 'number' | 'boolean' | 'json'
  initial?: ValueSchema
  /** 作用域：应用级 / 页面级 */
  scope: 'app' | 'page'
  description?: string
}

/** 主题 */
export interface ThemeSchema {
  primaryColor?: string
  borderRadius?: number
  fontSize?: number
  background?: string
  mode?: 'light' | 'dark'
}

/** 权限：资源 + 操作 */
export interface PermissionResourceSchema {
  resource: string
  actions: string[]
}

export interface PermissionRoleSchema {
  id: string
  name: string
  permissions: PermissionResourceSchema[]
}

export interface PermissionSchema {
  roles: PermissionRoleSchema[]
  /** 页面权限：pageId -> 允许的角色 id 列表（空表示不限制） */
  pages?: Record<string, string[]>
}

/** 页面 */
export interface PageSchema {
  id: string
  name: string
  path: string
  /** 页面组件树 */
  components: ComponentSchema[]
}

/** 应用配置 */
export interface AppSchema {
  id: string
  name: string
  description?: string
  version: string
}

/** Application Schema：平台唯一事实来源 */
export interface ApplicationSchema {
  /** Schema 版本，用于迁移 */
  version: string
  app: AppSchema
  pages: PageSchema[]
  dataSources: DataSourceSchema[]
  queries: QuerySchema[]
  actions: ActionSchema[]
  workflows: WorkflowSchema[]
  variables: VariableSchema[]
  theme?: ThemeSchema
  permissions?: PermissionSchema
}

/** 物料 Bundle：DB 只保存引用信息，不保存 Bundle 本身 */
export interface BundleSchema {
  url: string
  format: 'esm' | 'global'
  version: string
  /** 子资源完整性校验（如 sha384-xxx） */
  integrity?: string
  /** 需要额外加载的样式资源 */
  styles?: string[]
}

/** 物料注册信息 */
export interface MaterialSchema {
  id: string
  type: string
  name: string
  version: string
  description?: string
  icon?: string
  category?: string
  definition: ComponentDefinition
  bundle: BundleSchema
}

/** 属性字段类型（属性面板据此生成编辑器） */
export type PropFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'switch'
  | 'select'
  | 'radio'
  | 'slider'
  | 'color'
  | 'icon'
  | 'options'
  | 'columns'
  | 'rules'
  | 'json'

export interface PropFieldOption {
  label: string
  value: string | number | boolean
}

export interface PropField {
  key: string
  label: string
  type: PropFieldType
  description?: string
  placeholder?: string
  options?: PropFieldOption[]
  min?: number
  max?: number
  step?: number
  /** 默认值（用于新增时补齐） */
  defaultValue?: unknown
  /** 分组，属性面板按分组折叠展示 */
  group?: string
  /** 数值/文本输入后缀 */
  suffix?: string
  /** 是否支持表达式绑定，默认 true */
  bindable?: boolean
}

export interface EventField {
  name: string
  label: string
  description?: string
}

/** 组件定义：组件能力/属性/事件元数据（与组件实现解耦） */
export interface ComponentDefinition {
  type: string
  title: string
  description?: string
  category: string
  icon?: string
  kind: ComponentKind
  version?: string
  /** 容器是否可容纳子组件 */
  acceptsChildren?: boolean
  /** 容器允许的子组件类型（为空表示不限制） */
  allowedChildren?: string[]
  /** 是否允许在画布上调整尺寸 */
  resizable?: boolean
  props: PropField[]
  events: EventField[]
  defaultProps: Record<string, unknown>
  defaultStyle?: StyleSchema
  /** 默认子节点（拖入时初始化） */
  defaultChildren?: ComponentSchema[] | (() => ComponentSchema[])
  /** 默认插槽名，容器组件渲染 children 时使用 */
  slot?: string
  /**
   * 模型绑定声明：控件在 Form 内按字段名自动双向绑定
   * 例如 { prop: 'value', event: 'update:value' }
   */
  model?: { prop: string; event: string }
  /** 运行时提示（属性面板显示） */
  tips?: string[]
  /**
   * 内置组件实现。仅内置物料使用，序列化物料信息时必须剥离，
   * 远程组件实现由 BundleSchema 描述。
   */
  renderer?: Component
}
