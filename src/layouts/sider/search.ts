import PinyinMatch from 'pinyin-match'

import type { IMenu } from '#/config'

const PINYIN_SCORE_OFFSET = 1000
const CONTEXT_SCORE_OFFSET = 2000
const CONTEXT_PINYIN_SCORE_OFFSET = 3000

function getPinyinScore(text: string, keyword: string, offset: number) {
  const range = PinyinMatch.match(text, keyword)
  if (!range) return Number.POSITIVE_INFINITY

  const [start, end] = range
  return offset + start * 10 + end - start
}

export function getMenuSearchScore(
  item: IMenu,
  keyword: string,
  breadcrumb = ''
) {
  const normalizedKeyword = keyword.trim().toLowerCase()
  if (!normalizedKeyword) return Number.POSITIVE_INFINITY

  const title = item.title.toLowerCase()
  if (title === normalizedKeyword) return 0
  if (title.startsWith(normalizedKeyword)) return 1

  const titleIndex = title.indexOf(normalizedKeyword)
  if (titleIndex !== -1) return 2 + titleIndex

  const pinyinScore = getPinyinScore(
    item.title,
    normalizedKeyword,
    PINYIN_SCORE_OFFSET
  )
  if (Number.isFinite(pinyinScore)) return pinyinScore

  const context = `${breadcrumb} ${item.path ?? ''}`.trim().toLowerCase()
  const contextIndex = context.indexOf(normalizedKeyword)
  if (contextIndex !== -1) return CONTEXT_SCORE_OFFSET + contextIndex

  return getPinyinScore(
    breadcrumb,
    normalizedKeyword,
    CONTEXT_PINYIN_SCORE_OFFSET
  )
}

export function matchesMenuTree(item: IMenu, keyword: string): boolean {
  if (Number.isFinite(getMenuSearchScore(item, keyword))) return true
  return (
    item.children?.some((child) => matchesMenuTree(child, keyword)) ?? false
  )
}
