declare module 'frappe-gantt' {
  export type FrappeGanttViewMode =
    | 'Hour'
    | 'Quarter Day'
    | 'Half Day'
    | 'Day'
    | 'Week'
    | 'Month'
    | 'Year'
    | string

  export interface FrappeGanttViewModeDefinition {
    name: FrappeGanttViewMode
    padding?: string | [string, string]
    step: string
    lower_text?:
      | string
      | ((date: Date, previousDate: Date | null, language: string) => string)
    upper_text?:
      | string
      | ((date: Date, previousDate: Date | null, language: string) => string)
    upper_text_frequency?: number
    thick_line?: (date: Date) => boolean
    date_format?: string
    column_width?: number
    snap_at?: string
  }

  export interface FrappeGanttTask {
    id: string | number
    name: string
    start: string | Date
    end?: string | Date
    duration?: string
    progress?: number
    dependencies?: string | string[]
    custom_class?: string
    description?: string
    _start?: Date
    _end?: Date
    [key: string]: unknown
  }

  export interface FrappeGanttPopupContext {
    task: FrappeGanttTask
    chart: FrappeGantt
    get_title: () => HTMLElement
    set_title: (title: string) => void
    get_subtitle: () => HTMLElement
    set_subtitle: (subtitle: string) => void
    get_details: () => HTMLElement
    set_details: (details: string) => void
    add_action: (
      html: string | ((task: FrappeGanttTask) => string),
      callback: (
        task: FrappeGanttTask,
        chart: FrappeGantt,
        event: MouseEvent
      ) => void
    ) => void
  }

  export interface FrappeGanttOptions {
    arrow_curve?: number
    auto_move_label?: boolean
    bar_corner_radius?: number
    bar_height?: number
    container_height?: 'auto' | number
    column_width?: number | null
    date_format?: string
    upper_header_height?: number
    lower_header_height?: number
    snap_at?: string | null
    infinite_padding?: boolean
    holidays?: Record<
      string,
      'weekend' | Array<string | Date | { date: string | Date; label?: string }>
    >
    ignore?:
      | string
      | Date
      | Array<string | Date | ((date: Date) => boolean)>
      | ((date: Date) => boolean)
    language?: string
    lines?: 'none' | 'vertical' | 'horizontal' | 'both'
    move_dependencies?: boolean
    padding?: number
    popup?:
      | false
      | ((context: FrappeGanttPopupContext) => string | false | void)
    popup_on?: 'click' | 'hover'
    readonly_progress?: boolean
    readonly_dates?: boolean
    readonly?: boolean
    hover_on_date?: boolean
    fixed_duration?: boolean
    scroll_to?: 'today' | 'start' | 'end' | string | null
    show_expected_progress?: boolean
    today_button?: boolean
    view_mode?: FrappeGanttViewMode | FrappeGanttViewModeDefinition
    view_mode_select?: boolean
    view_modes?: Array<FrappeGanttViewMode | FrappeGanttViewModeDefinition>
    is_weekend?: (date: Date) => boolean
    on_click?: (task: FrappeGanttTask) => void
    on_double_click?: (task: FrappeGanttTask) => void
    on_date_change?: (task: FrappeGanttTask, start: Date, end: Date) => void
    on_progress_change?: (task: FrappeGanttTask, progress: number) => void
    on_view_change?: (mode: FrappeGanttViewModeDefinition) => void
    on_date_click?: (date: string | null) => void
    on_hover?: (
      task: FrappeGanttTask,
      x: number,
      y: number,
      event: MouseEvent
    ) => void
  }

  export default class FrappeGantt {
    constructor(
      wrapper: string | HTMLElement | SVGElement,
      tasks: FrappeGanttTask[],
      options?: FrappeGanttOptions
    )

    tasks: FrappeGanttTask[]
    $container: HTMLElement

    update_options(options: FrappeGanttOptions): void
    refresh(tasks: FrappeGanttTask[]): void
    change_view_mode(
      mode?: FrappeGanttViewMode | FrappeGanttViewModeDefinition,
      maintainPosition?: boolean
    ): void
    scroll_current(): void
    update_task(id: string | number, details: Partial<FrappeGanttTask>): void
    hide_popup(): void
  }
}
