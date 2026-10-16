import type { ColProps } from 'antdv-next'
import type { FormPlusBreakpoint, FormPlusGrid } from './types'

/**
 * 断点顺序,与 antd Col 的响应式 props 由小到大一致
 */
const BREAKPOINT_ORDER: readonly FormPlusBreakpoint[] = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'xxl',
  'xxxl',
]

/**
 * 列数换算占位格数
 *
 * @param cols 列数
 */
function toSpan(cols: number) {
  return Math.max(1, Math.floor(24 / Math.max(1, cols)))
}

/**
 * 取出响应式列数里已声明的断点,按断点从小到大返回
 *
 * @param cols 响应式列数配置
 */
function getDeclaredCols(cols: Partial<Record<FormPlusBreakpoint, number>>) {
  const declared: Array<[FormPlusBreakpoint, number]> = []
  for (const breakpoint of BREAKPOINT_ORDER) {
    const value = cols[breakpoint]
    if (typeof value === 'number') declared.push([breakpoint, value])
  }
  return declared
}

/**
 * 计算字段的栅格占位
 *
 * - `span` 优先,直接作为占位格数;
 * - 列数为数字时换算成固定 span;
 * - 列数为对象时换算成各断点的 span,未声明的低断点沿用最小的已声明列数
 *   (antd 的断点 props 是 min-width 语义,不补 xs 会让小屏没有占位)。
 *
 * @param cols 栅格列数配置
 * @param span 字段自己声明的占位格数
 */
export function resolveGridSpan(
  cols: FormPlusGrid['cols'] | undefined,
  span?: number
): ColProps {
  if (span !== undefined) return { span }
  if (typeof cols === 'number') return { span: toSpan(cols) }
  if (!cols) return { span: toSpan(1) }

  const declared = getDeclaredCols(cols)
  const first = declared[0]
  if (!first) return { span: toSpan(1) }

  const result: ColProps = { xs: toSpan(first[1]) }
  for (const [breakpoint, count] of declared) {
    result[breakpoint] = toSpan(count)
  }
  return result
}
