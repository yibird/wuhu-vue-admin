type PinyinMatchModule = typeof import('pinyin-match')

/**
 * 拼音匹配库的按需加载状态
 *
 * pinyin-match 体积不小(解压后约 30KB),而只有「纯字母关键词 + 中文文本」这一条分支
 * 才会用到;菜单搜索、全局搜索、各类 picker 的过滤又都是同步 API(computed、filterOption),
 * 因此这里保留同步签名:已加载就直接用,未加载则就地触发加载并在本次调用降级为纯文本匹配,
 * 下一次输入(几乎都是同一个 tick 之后)即可命中拼音匹配。
 */
let pinyinMatch: PinyinMatchModule['default'] | undefined
let pinyinMatchLoading: Promise<void> | undefined

/**
 * 预加载拼音匹配库,供搜索类入口在用户输入前预热
 * @returns 加载完成后的 Promise,重复调用复用同一次请求
 */
export function loadPinyinMatch() {
  if (pinyinMatch) return Promise.resolve()

  pinyinMatchLoading ??= import('pinyin-match').then((module) => {
    pinyinMatch = module.default
  })

  return pinyinMatchLoading
}

type SearchValue = string | number | null | undefined

const chineseTextPattern = /[\u3400-\u9fff]/
const pinyinKeywordPattern = /^[a-z\s]+$/
/** 拼音匹配的排序基准分,保证拼音命中排在直接文本命中之后 */
export const PINYIN_SCORE_OFFSET = 1000

export type SearchMatchSource = 'text' | 'pinyin'

export interface SearchMatch {
  end: number
  score: number
  source: SearchMatchSource
  start: number
}

export interface SearchTextSegment {
  matched: boolean
  text: string
}

export function normalizeSearchKeyword(inputValue: string) {
  return inputValue.trim().toLowerCase()
}

/**
 * 计算拼音匹配的排序分
 * @param start 匹配起始下标
 * @param end 匹配结束下标(含)
 * @param offset 排序基准分,用于区分不同匹配层级
 */
export function getPinyinMatchScore(
  start: number,
  end: number,
  offset: number
) {
  return offset + start * 10 + end - start
}

/** Finds the first direct or pinyin match in a text value. */
export function getSearchMatch(
  text: string,
  inputValue: string
): SearchMatch | null {
  const keyword = normalizeSearchKeyword(inputValue)
  if (!keyword) return null

  const normalizedText = text.toLowerCase()
  const directIndex = normalizedText.indexOf(keyword)
  if (directIndex !== -1) {
    return {
      start: directIndex,
      end: directIndex + keyword.length - 1,
      score: directIndex,
      source: 'text',
    }
  }

  if (!pinyinKeywordPattern.test(keyword) || !chineseTextPattern.test(text)) {
    return null
  }

  // 只有走到这一步才真的需要拼音匹配:未加载时先降级,同时把库拉起来
  if (!pinyinMatch) {
    loadPinyinMatch()
    return null
  }

  const range = pinyinMatch.match(text, keyword)
  if (!range) return null

  const [start, end] = range
  return {
    start,
    end,
    score: getPinyinMatchScore(start, end, PINYIN_SCORE_OFFSET),
    source: 'pinyin',
  }
}

export function matchesOption(inputValue: string, ...values: SearchValue[]) {
  const keyword = normalizeSearchKeyword(inputValue)
  if (!keyword) return true

  const text = values
    .filter((value): value is string | number => value != null && value !== '')
    .map(String)
    .join(' ')

  return Boolean(getSearchMatch(text, keyword))
}

export function getSearchTextSegments(
  text: string,
  match?: Pick<SearchMatch, 'end' | 'start'>
): SearchTextSegment[] {
  if (!match) return [{ text, matched: false }]

  const segments: SearchTextSegment[] = []
  if (match.start > 0) {
    segments.push({ text: text.slice(0, match.start), matched: false })
  }

  segments.push({
    text: text.slice(match.start, match.end + 1),
    matched: true,
  })

  if (match.end < text.length - 1) {
    segments.push({ text: text.slice(match.end + 1), matched: false })
  }

  return segments
}
