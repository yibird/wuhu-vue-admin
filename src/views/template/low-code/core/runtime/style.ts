import type { CSSProperties } from 'vue'
import type {
  Breakpoint,
  ComponentSchema,
  LayoutMode,
  StyleSchema,
} from '../schema/types'

export type DeviceKind = 'pc' | 'tablet' | 'mobile' | 'custom'

const JUSTIFY_MAP: Record<string, CSSProperties['justifyContent']> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
}

const ALIGN_MAP: Record<string, CSSProperties['alignItems']> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
}

function px(value: string | number | undefined) {
  if (value === undefined || value === '') return undefined
  return typeof value === 'number' ? `${value}px` : value
}

/** 合并断点覆盖样式 */
export function mergeStyle(
  style: StyleSchema | undefined,
  device: DeviceKind
): StyleSchema {
  if (!style) return {}
  const breakpoint = getBreakpoint(device)
  if (!breakpoint) return style
  const override = style.responsive?.[breakpoint]
  return override ? { ...style, ...override } : style
}

/** 设备对应的断点，PC/自定义返回 undefined */
function getBreakpoint(device: DeviceKind): Breakpoint | undefined {
  if (device === 'tablet') return 'tablet'
  if (device === 'mobile') return 'mobile'
  return undefined
}

/**
 * 窄屏容器的自适应兜底
 *
 * 断点内没有显式配置时收敛默认布局，避免容器按 PC 配置渲染导致子元素溢出：
 * 栅格列数随屏幕收敛、横向弹性容器允许换行。
 */
function applyResponsiveDefaults(
  style: StyleSchema,
  device: DeviceKind
): StyleSchema {
  const breakpoint = getBreakpoint(device)
  if (!breakpoint) return style

  const override = style.responsive?.[breakpoint] ?? {}
  const layout = style.layout ?? 'block'
  const next: StyleSchema = { ...style }

  if (layout === 'grid' && override.columns === undefined) {
    const maxColumns = breakpoint === 'mobile' ? 1 : 2
    next.columns = Math.max(1, Math.min(next.columns ?? 2, maxColumns))
  }

  if (
    layout === 'flex' &&
    (next.direction ?? 'column') === 'row' &&
    override.wrap === undefined
  ) {
    next.wrap = true
  }

  return next
}

export function getLayout(style: StyleSchema | undefined): LayoutMode {
  return style?.layout ?? 'block'
}

/**
 * 将 StyleSchema 转换为 CSS 属性（与框架解耦的统一样式出口）。
 * parentLayout 用于 grid/free 等依赖父容器的样式计算。
 */
export function resolveNodeStyle(
  node: ComponentSchema,
  options: {
    device: DeviceKind
    parentLayout?: LayoutMode
    /** 父容器为弹性布局时的排列方向 */
    parentDirection?: 'row' | 'column'
    /** 是否为容器组件（可容纳子节点），容器默认铺满父容器 */
    isContainer?: boolean
  }
): CSSProperties {
  const style = applyResponsiveDefaults(
    mergeStyle(node.style, options.device),
    options.device
  )
  const css: CSSProperties = {}
  const layout = getLayout(style)

  // 尺寸
  if (style.width !== undefined) {
    css.width = px(style.width)
  } else if (options.isContainer) {
    // 容器未设置宽度时默认铺满父容器，保证切换设备尺寸后仍与容器等宽：
    // 横向弹性布局中改用 flex 伸展，避免挤压同一行的兄弟节点
    if (options.parentLayout === 'flex' && options.parentDirection === 'row') {
      css.flex = '1 1 0'
      css.minWidth = css.minWidth ?? 0
    } else {
      css.width = '100%'
    }
  }
  if (style.height !== undefined) css.height = px(style.height)
  if (style.minWidth !== undefined) css.minWidth = px(style.minWidth)
  if (style.maxWidth !== undefined) css.maxWidth = px(style.maxWidth)
  if (style.minHeight !== undefined) css.minHeight = px(style.minHeight)
  if (style.maxHeight !== undefined) css.maxHeight = px(style.maxHeight)

  // 尺寸相对容器收敛：未显式设置最大宽度时不允许超出父容器，
  // 避免固定像素宽度/固有宽度在切换设备尺寸后依旧按原尺寸溢出
  if (style.maxWidth === undefined) {
    css.maxWidth = '100%'
  }

  // 间距
  if (style.padding !== undefined) css.padding = px(style.padding)
  if (style.margin !== undefined) css.margin = px(style.margin)
  if (style.gap !== undefined) css.gap = px(style.gap)

  // 容器布局
  if (layout === 'flex') {
    css.display = 'flex'
    css.flexDirection = style.direction ?? 'column'
    css.alignItems = style.align ? ALIGN_MAP[style.align] : 'stretch'
    if (style.justify) css.justifyContent = JUSTIFY_MAP[style.justify]
    css.flexWrap = style.wrap ? 'wrap' : 'nowrap'
  } else if (layout === 'grid') {
    css.display = 'grid'
    const columns = Math.max(1, style.columns ?? 2)
    css.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`
    css.alignItems = style.align ? ALIGN_MAP[style.align] : undefined
    if (style.span && options.parentLayout === 'grid') {
      css.gridColumn = `span ${Math.min(style.span, columns)}`
    }
  } else if (layout === 'free') {
    css.position = 'relative'
  }

  // 自由布局子节点定位
  if (style.position === 'absolute') {
    css.position = 'absolute'
    if (style.left !== undefined) css.left = px(style.left)
    if (style.top !== undefined) css.top = px(style.top)
    if (style.zIndex !== undefined) css.zIndex = style.zIndex
  } else if (options.parentLayout === 'free' && !style.position) {
    css.position = 'absolute'
    css.left = px(style.left ?? 0)
    css.top = px(style.top ?? 0)
    if (style.zIndex !== undefined) css.zIndex = style.zIndex
  }

  // 外观
  if (style.background) css.background = style.background
  if (style.color) css.color = style.color
  if (style.fontSize !== undefined) css.fontSize = px(style.fontSize)
  if (style.fontWeight !== undefined) css.fontWeight = style.fontWeight
  if (style.textAlign) css.textAlign = style.textAlign
  if (style.borderWidth !== undefined) css.borderWidth = px(style.borderWidth)
  if (style.borderStyle) css.borderStyle = style.borderStyle
  if (style.borderColor) css.borderColor = style.borderColor
  if (style.borderRadius !== undefined)
    css.borderRadius = px(style.borderRadius)
  if (style.shadow) css.boxShadow = style.shadow
  if (style.opacity !== undefined) css.opacity = style.opacity
  if (style.overflow) css.overflow = style.overflow
  if (style.zIndex !== undefined && css.position) css.zIndex = style.zIndex

  return css
}

/** 根据画布/视口宽度推断设计设备 */
export function detectDevice(width: number): Breakpoint {
  if (width < 768) return 'mobile'
  if (width < 1280) return 'tablet'
  return 'pc' as Breakpoint
}
