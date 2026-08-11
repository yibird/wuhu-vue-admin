export { default as Highlight } from './src/index.vue'
export {
  createHighlightSegments,
  findLiteralHighlightMatches,
  normalizeHighlightKeywords,
} from './src/utils.ts'
export type {
  HighlightClassValue,
  HighlightKeyword,
  HighlightMatch,
  HighlightMatcher,
  HighlightMatcherContext,
  HighlightMatchSegment,
  HighlightProps,
  HighlightSegment,
  HighlightTag,
  HighlightTextSegment,
} from './src/types.ts'
