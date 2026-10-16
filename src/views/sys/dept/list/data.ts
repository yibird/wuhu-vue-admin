import type { DeptType } from '@/apis'

/**
 * 组织架构节点的视觉配置
 */
export interface DeptAccent {
  /**
   * @desc 渐变与光晕的主色
   */
  color: string
  /**
   * @desc 节点图标
   */
  icon: string
  /**
   * @desc 类型名称
   */
  label: string
}

/** 根节点:跟随主题主色 */
const ROOT_ACCENT: DeptAccent = {
  color: 'rgb(var(--w-color-primary))',
  icon: 'i-lucide:network',
  label: '组织架构',
}

/** 部门:跟随主题主色,换肤时无需改这里 */
const DEPT_ACCENT: DeptAccent = {
  color: 'rgb(var(--w-color-primary))',
  icon: 'i-lucide:building-2',
  label: '部门',
}

/** 岗位:沿用列表页 Tag 的紫色,让两处对位 */
const POST_ACCENT: DeptAccent = {
  color: '#722ed1',
  icon: 'i-lucide:user-round',
  label: '岗位',
}

/**
 * 解析节点视觉配置
 *
 * 节点卡片、详情面板与图例都从这里取值,避免三处的类型名、图标与配色各写一遍。
 */
export function resolveDeptAccent(type: DeptType, root = false): DeptAccent {
  if (root) return ROOT_ACCENT
  return type === 2 ? POST_ACCENT : DEPT_ACCENT
}
