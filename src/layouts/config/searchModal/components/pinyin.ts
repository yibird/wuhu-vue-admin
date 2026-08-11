import PinyinMatch from 'pinyin-match'

export interface PinyinSearchMatch {
  end: number
  score: number
  start: number
}

export interface SearchTextSegment {
  matched: boolean
  text: string
}

const pinyinScoreOffset = 1000

export const getPinyinSearchMatch = (
  text: string,
  keyword: string
): PinyinSearchMatch | null => {
  const normalizedKeyword = keyword.trim().toLowerCase()
  if (!normalizedKeyword) return null

  const directIndex = text.toLowerCase().indexOf(normalizedKeyword)
  if (directIndex !== -1) {
    return {
      start: directIndex,
      end: directIndex + normalizedKeyword.length - 1,
      score: directIndex,
    }
  }

  const range = PinyinMatch.match(text, normalizedKeyword)
  if (!range) return null

  const [start, end] = range
  return {
    start,
    end,
    score: pinyinScoreOffset + start * 10 + end - start,
  }
}

export const getSearchTextSegments = (
  text: string,
  match?: Pick<PinyinSearchMatch, 'end' | 'start'>
): SearchTextSegment[] => {
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
