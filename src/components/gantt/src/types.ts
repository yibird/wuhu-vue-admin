import type {
  FrappeGanttOptions,
  FrappeGanttTask,
  FrappeGanttViewMode,
  FrappeGanttViewModeDefinition,
} from 'frappe-gantt'

export type GanttViewMode = FrappeGanttViewMode
export type GanttViewModeDefinition = FrappeGanttViewModeDefinition

export interface GanttTask extends FrappeGanttTask {
  /**
   * 任务唯一标识
   */
  id: string
  /**
   * 任务名称
   */
  name: string
  /**
   * 任务开始时间
   */
  start: string
  /**
   * 任务结束时间
   */
  end: string
  /**
   * 任务进度,取值 0-100
   */
  progress: number
  /**
   * 依赖的任务 id 列表
   */
  dependencies?: string[]
  /**
   * 任务自定义 class
   */
  custom_class?: string
  /**
   * 任务描述
   */
  description?: string
}

export interface GanttContextMenuEvent {
  /**
   * 触发右键菜单的任务
   */
  readonly task: GanttTask
  /**
   * 原始鼠标事件
   */
  readonly nativeEvent: MouseEvent
  /**
   * 菜单位置 x 坐标
   */
  readonly x: number
  /**
   * 菜单位置 y 坐标
   */
  readonly y: number
}

export interface GanttProps {
  /**
   * @desc 甘特图任务列表
   * @default []
   */
  tasks: GanttTask[]
  /**
   * @desc 视图模式
   * @default "Week"
   */
  viewMode?: GanttViewMode
  /**
   * @desc 透传给 frappe-gantt 的配置
   * @default {}
   */
  options?: FrappeGanttOptions
  /**
   * @desc 是否只读
   * @default false
   */
  readonly?: boolean
  /**
   * @desc 容器尺寸变化时是否自动调整视图
   * @default true
   */
  autoresize?: boolean
  /**
   * @desc 空数据提示文案
   * @default "暂无甘特图数据"
   */
  emptyText?: string
}

export interface GanttEmits {
  /**
   * @desc 点击任务时触发
   */
  click: [task: GanttTask]
  /**
   * @desc 双击任务时触发
   */
  doubleClick: [task: GanttTask]
  /**
   * @desc 任务日期变更时触发
   */
  dateChange: [task: GanttTask, start: Date, end: Date]
  /**
   * @desc 任务进度变更时触发
   */
  progressChange: [task: GanttTask, progress: number]
  /**
   * @desc 视图模式切换时触发
   */
  viewChange: [mode: GanttViewModeDefinition]
  /**
   * @desc 点击日期时触发,点击空白处 date 为 null
   */
  dateClick: [date: string | null]
  /**
   * @desc 任务上触发右键菜单时触发
   */
  contextMenu: [payload: GanttContextMenuEvent]
}
