import type { DictItem } from './types'

export const emptyDictItemPage = {
  list: [] as DictItem[],
  current: 1,
  pageSize: 10,
  total: 0,
  totalPage: 0,
}
