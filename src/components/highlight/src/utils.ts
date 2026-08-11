import type {
  HighlightKeyword,
  HighlightMatch,
  HighlightMatcherContext,
  HighlightSegment,
} from './types'

const REGEXP_SPECIAL_CHARACTERS = /[.*+?^${}()|[\]\\]/g
const WORD_CHARACTER = /[\p{L}\p{N}_]/u
const EMPTY_MATCHES: readonly HighlightMatch[] = []

interface MergedHighlightRange {
  end: number
  matches: HighlightMatch[]
  start: number
}

function escapeRegExp(value: string) {
  return value.replace(REGEXP_SPECIAL_CHARACTERS, '\\$&')
}

/**
 * Reads one full Unicode code point at an offset. String indexing alone can
 * return half of a surrogate pair, which would produce incorrect word-boundary
 * decisions for supplementary-plane letters.
 */
function codePointAt(text: string, offset: number) {
  if (offset < 0 || offset >= text.length) return ''
  const codePoint = text.codePointAt(offset)
  return codePoint === undefined ? '' : String.fromCodePoint(codePoint)
}

/** Reads the complete Unicode code point immediately before an offset. */
function codePointBefore(text: string, offset: number) {
  if (offset <= 0 || offset > text.length) return ''

  const lastUnit = text.charCodeAt(offset - 1)
  const isLowSurrogate = lastUnit >= 0xdc00 && lastUnit <= 0xdfff
  if (isLowSurrogate && offset >= 2) {
    const firstUnit = text.charCodeAt(offset - 2)
    const isHighSurrogate = firstUnit >= 0xd800 && firstUnit <= 0xdbff
    if (isHighSurrogate) return text.slice(offset - 2, offset)
  }

  return text.charAt(offset - 1)
}

function isWordCharacter(value: string) {
  return value !== '' && WORD_CHARACTER.test(value)
}

/**
 * A boundary is required only when the corresponding edge of the match is a
 * word character. This keeps punctuation-only keywords such as "C++" useful.
 */
function isWholeWordMatch(text: string, start: number, end: number) {
  const startsWithWord = isWordCharacter(codePointAt(text, start))
  const endsWithWord = isWordCharacter(codePointBefore(text, end))
  const hasWordBefore = isWordCharacter(codePointBefore(text, start))
  const hasWordAfter = isWordCharacter(codePointAt(text, end))

  return (!startsWithWord || !hasWordBefore) && (!endsWithWord || !hasWordAfter)
}

/**
 * Removes empty and duplicate keywords while preserving caller order. The
 * order is retained as useful metadata when several keywords overlap.
 */
export function normalizeHighlightKeywords(
  keyword: HighlightKeyword | undefined,
  caseSensitive = false
): readonly string[] {
  const source = typeof keyword === 'string' ? [keyword] : (keyword ?? [])
  const result: string[] = []
  const seen = new Set<string>()

  for (const value of source) {
    if (value.length === 0) continue
    const identity = caseSensitive ? value : value.toLocaleLowerCase()
    if (seen.has(identity)) continue
    seen.add(identity)
    result.push(value)
  }

  return result
}

/**
 * Default literal matcher. Each keyword is escaped before being compiled, so
 * user input cannot become a regular expression. RegExp is used instead of a
 * lower-cased copy of the source because Unicode case folding can change string
 * length and invalidate offsets.
 */
export function findLiteralHighlightMatches(
  context: Omit<HighlightMatcherContext, 'maxMatches'>
): HighlightMatch[] {
  const { text, keywords, caseSensitive, wholeWord } = context
  if (!text || keywords.length === 0) return []

  const flags = caseSensitive ? 'gu' : 'giu'
  const matches: HighlightMatch[] = []

  for (const keyword of keywords) {
    const expression = new RegExp(escapeRegExp(keyword), flags)
    for (const result of text.matchAll(expression)) {
      const start = result.index
      const end = start + result[0].length
      if (!wholeWord || isWholeWordMatch(text, start, end)) {
        matches.push({ start, end, keyword })
      }
    }
  }

  return matches
}

function sanitizeMatches(
  textLength: number,
  matches: readonly HighlightMatch[],
  maxMatches: number
) {
  const sanitized: HighlightMatch[] = []

  for (const match of matches) {
    if (!Number.isFinite(match.start) || !Number.isFinite(match.end)) continue

    const start = Math.min(textLength, Math.max(0, Math.trunc(match.start)))
    const end = Math.min(textLength, Math.max(0, Math.trunc(match.end)))
    if (start >= end) continue

    sanitized.push({
      start,
      end,
      keyword: typeof match.keyword === 'string' ? match.keyword : undefined,
    })
  }

  sanitized.sort(
    (left, right) => left.start - right.start || right.end - left.end
  )

  const limit = Number.isFinite(maxMatches)
    ? Math.max(0, Math.trunc(maxMatches))
    : 0
  return limit > 0 ? sanitized.slice(0, limit) : sanitized
}

/**
 * Overlapping and adjacent matches are merged into one visual range. Besides
 * preventing duplicated text, this bounds the rendered DOM to at most
 * `2 * mergedMatches + 1` nodes. Original matches remain available to slots.
 */
function mergeMatches(matches: readonly HighlightMatch[]) {
  const ranges: MergedHighlightRange[] = []

  for (const match of matches) {
    const current = ranges.at(-1)
    if (current && match.start <= current.end) {
      current.end = Math.max(current.end, match.end)
      current.matches.push(match)
      continue
    }

    ranges.push({
      start: match.start,
      end: match.end,
      matches: [match],
    })
  }

  return ranges
}

/**
 * Converts arbitrary match ranges into render-ready, non-overlapping segments.
 * Invalid custom ranges are ignored and out-of-bounds ranges are clamped.
 */
export function createHighlightSegments(
  text: string,
  matches: readonly HighlightMatch[],
  maxMatches = 0
): HighlightSegment[] {
  if (!text) return []

  const ranges = mergeMatches(sanitizeMatches(text.length, matches, maxMatches))
  if (ranges.length === 0) {
    return [
      {
        kind: 'text',
        index: 0,
        start: 0,
        end: text.length,
        text,
        matches: EMPTY_MATCHES,
      },
    ]
  }

  const segments: HighlightSegment[] = []
  let cursor = 0

  for (const range of ranges) {
    if (range.start > cursor) {
      segments.push({
        kind: 'text',
        index: segments.length,
        start: cursor,
        end: range.start,
        text: text.slice(cursor, range.start),
        matches: EMPTY_MATCHES,
      })
    }

    segments.push({
      kind: 'match',
      index: segments.length,
      start: range.start,
      end: range.end,
      text: text.slice(range.start, range.end),
      matches: range.matches,
    })
    cursor = range.end
  }

  if (cursor < text.length) {
    segments.push({
      kind: 'text',
      index: segments.length,
      start: cursor,
      end: text.length,
      text: text.slice(cursor),
      matches: EMPTY_MATCHES,
    })
  }

  return segments
}
