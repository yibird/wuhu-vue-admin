import type { Component, StyleValue, VNodeChild } from 'vue'

/** A single keyword or a readonly list of keywords to highlight. */
export type HighlightKeyword = string | readonly string[]

/**
 * Native HTML tags cover the common case, while Component keeps wrapper and
 * mark rendering extensible for design-system components.
 */
export type HighlightTag = keyof HTMLElementTagNameMap | Component

/** Values accepted by Vue's class normalization at runtime. */
export type HighlightClassValue =
  | string
  | Readonly<Record<string, boolean | null | undefined>>
  | readonly HighlightClassValue[]
  | false
  | null
  | undefined

/**
 * A match uses UTF-16 offsets, matching String#slice, RegExp#index and the
 * offsets returned by most JavaScript search libraries.
 */
export interface HighlightMatch {
  /** Inclusive UTF-16 start offset. */
  readonly start: number
  /** Exclusive UTF-16 end offset. */
  readonly end: number
  /** Optional source keyword, exposed to the match slot. */
  readonly keyword?: string
}

/** Context supplied to a custom matcher. */
export interface HighlightMatcherContext {
  readonly text: string
  /** Empty keywords are removed and duplicate keywords are collapsed. */
  readonly keywords: readonly string[]
  readonly caseSensitive: boolean
  readonly wholeWord: boolean
  /** Zero means unlimited. The component applies this limit after matching. */
  readonly maxMatches: number
}

/**
 * Custom matchers make non-literal strategies possible, such as pinyin,
 * fuzzy search or server-provided match ranges. Returned ranges are validated,
 * sorted and merged before rendering.
 */
export type HighlightMatcher = (
  context: HighlightMatcherContext
) => readonly HighlightMatch[]

interface HighlightSegmentBase {
  /** Stable position in the final segment list. */
  readonly index: number
  /** Inclusive UTF-16 offset in the original text. */
  readonly start: number
  /** Exclusive UTF-16 offset in the original text. */
  readonly end: number
  /** Exact text sliced from the original input. */
  readonly text: string
  /** Raw matches contributing to this segment. Empty for plain text. */
  readonly matches: readonly HighlightMatch[]
}

export interface HighlightTextSegment extends HighlightSegmentBase {
  readonly kind: 'text'
}

export interface HighlightMatchSegment extends HighlightSegmentBase {
  readonly kind: 'match'
}

export type HighlightSegment = HighlightTextSegment | HighlightMatchSegment

export interface HighlightProps {
  /** Source text. It is rendered as text nodes and is never parsed as HTML. */
  text: string
  /** Keyword or keywords to highlight. Empty values are ignored. */
  keyword?: HighlightKeyword
  /** Compare keyword casing exactly. @default false */
  caseSensitive?: boolean
  /** Match only at Unicode letter/number/underscore boundaries. @default false */
  wholeWord?: boolean
  /** Maximum raw matches to render. Zero means unlimited. @default 0 */
  maxMatches?: number
  /** Optional custom matching strategy. */
  matcher?: HighlightMatcher
  /** Root element or component. @default 'span' */
  tag?: HighlightTag
  /** Element or component used for matched segments. @default 'mark' */
  highlightTag?: HighlightTag
  /** Additional class value applied to every matched segment. */
  highlightClass?: HighlightClassValue
  /** Additional inline style applied to every matched segment. */
  highlightStyle?: StyleValue
}

/** Strongly typed named slots for complete segment-level customization. */
export interface HighlightSlots {
  match?: (props: HighlightMatchSegment) => VNodeChild
  text?: (props: HighlightTextSegment) => VNodeChild
}
