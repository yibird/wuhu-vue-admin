import PinyinMatch from 'pinyin-match'

type SearchValue = string | number | null | undefined

const chineseTextPattern = /[\u3400-\u9fff]/
const pinyinKeywordPattern = /^[a-z\s]+$/
const PINYIN_SCORE_OFFSET = 1000

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

  const range = PinyinMatch.match(text, keyword)
  if (!range) return null

  const [start, end] = range
  return {
    start,
    end,
    score: PINYIN_SCORE_OFFSET + start * 10 + end - start,
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
