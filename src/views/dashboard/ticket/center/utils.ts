import type { TicketRecord } from './types'

/**
 * 工单筛选维度
 */
export interface TicketFilterDimension {
  status?: string
  category?: string
  priority?: string
  team?: string
}

/**
 * 判断工单指定字段中是否存在命中关键词的值(不区分大小写)
 *
 * @param ticket 工单记录
 * @param keyword 已归一化(去空格+小写)的关键词,为空时视为命中
 * @param fields 参与匹配的字段
 * @returns 是否命中
 */
export function matchesKeyword(
  ticket: TicketRecord,
  keyword: string,
  fields: Array<keyof TicketRecord>
) {
  if (!keyword) return true

  return fields.some((field) => {
    const value = ticket[field]
    return (
      typeof value === 'string' && value.toLocaleLowerCase().includes(keyword)
    )
  })
}

/**
 * 判断工单是否命中所有已选择的筛选维度
 *
 * 未选择或选择「全部」的维度不参与过滤。
 *
 * @param ticket 工单记录
 * @param filters 各维度的筛选值
 * @returns 是否命中
 */
export function matchesFilters(
  ticket: TicketRecord,
  filters: TicketFilterDimension
) {
  return (
    matchesDimension(filters.status, ticket.status) &&
    matchesDimension(filters.category, ticket.category) &&
    matchesDimension(filters.priority, ticket.priority) &&
    matchesDimension(filters.team, ticket.team)
  )
}

function matchesDimension(selected: string | undefined, target: string) {
  return selected === undefined || selected === 'all' || selected === target
}
