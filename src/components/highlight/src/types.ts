import type { Component, StyleValue, VNodeChild } from 'vue'

/**
 * 单个关键词或只读的关键词列表
 */
export type HighlightKeyword = string | readonly string[]

/**
 * 原生 HTML 标签覆盖常见场景，Component 则让包装元素与标记元素的渲染
 * 可扩展到设计系统组件
 */
export type HighlightTag = keyof HTMLElementTagNameMap | Component

/**
 * Vue class 规范化在运行时接受的值
 */
export type HighlightClassValue =
  | string
  | Readonly<Record<string, boolean | null | undefined>>
  | readonly HighlightClassValue[]
  | false
  | null
  | undefined

/**
 * 匹配区间使用 UTF-16 偏移量，与 String#slice、RegExp#index
 * 以及多数 JavaScript 搜索库返回的偏移量保持一致
 */
export interface HighlightMatch {
  /**
   * 包含起始位置的 UTF-16 偏移量
   */
  readonly start: number
  /**
   * 不包含结束位置的 UTF-16 偏移量
   */
  readonly end: number
  /**
   * 可选的来源关键词，会暴露给 match 插槽
   */
  readonly keyword?: string
}

/**
 * 提供给自定义匹配器的上下文
 */
export interface HighlightMatcherContext {
  /**
   * 待匹配的原始文本
   */
  readonly text: string
  /**
   * 已移除空关键词并折叠重复项的关键词列表
   */
  readonly keywords: readonly string[]
  /**
   * 是否区分大小写
   */
  readonly caseSensitive: boolean
  /**
   * 是否仅匹配完整单词
   */
  readonly wholeWord: boolean
  /**
   * 最大匹配数量，0 表示不限制；组件会在匹配完成后应用该限制
   */
  readonly maxMatches: number
}

/**
 * 自定义匹配器可实现非字面量策略，例如拼音、模糊搜索或服务端返回的匹配区间；
 * 返回的区间在渲染前会被校验、排序与合并
 */
export type HighlightMatcher = (
  context: HighlightMatcherContext
) => readonly HighlightMatch[]

interface HighlightSegmentBase {
  /**
   * 在最终分段列表中的稳定位置
   */
  readonly index: number
  /**
   * 在原始文本中包含起始位置的 UTF-16 偏移量
   */
  readonly start: number
  /**
   * 在原始文本中不包含结束位置的 UTF-16 偏移量
   */
  readonly end: number
  /**
   * 从原始输入中截取出的精确文本
   */
  readonly text: string
  /**
   * 构成本分段的原始匹配，纯文本分段的值为空
   */
  readonly matches: readonly HighlightMatch[]
}

/**
 * 纯文本分段
 */
export interface HighlightTextSegment extends HighlightSegmentBase {
  readonly kind: 'text'
}

/**
 * 匹配分段
 */
export interface HighlightMatchSegment extends HighlightSegmentBase {
  readonly kind: 'match'
}

/**
 * 高亮分段
 */
export type HighlightSegment = HighlightTextSegment | HighlightMatchSegment

export interface HighlightProps {
  /**
   * @desc 源文本，仅作为文本节点渲染，永远不会解析为 HTML
   */
  text: string
  /**
   * @desc 要高亮的关键词，空值会被忽略
   * @default ''
   */
  keyword?: HighlightKeyword
  /**
   * @desc 是否严格区分关键词大小写
   * @default false
   */
  caseSensitive?: boolean
  /**
   * @desc 是否仅在 Unicode 字母/数字/下划线边界处匹配
   * @default false
   */
  wholeWord?: boolean
  /**
   * @desc 最多渲染的原始匹配数量，0 表示不限制
   * @default 0
   */
  maxMatches?: number
  /**
   * @desc 可选的自定义匹配策略
   */
  matcher?: HighlightMatcher
  /**
   * @desc 根元素或组件
   * @default 'span'
   */
  tag?: HighlightTag
  /**
   * @desc 用于匹配分段的元素或组件
   * @default 'mark'
   */
  highlightTag?: HighlightTag
  /**
   * @desc 应用于每个匹配分段的额外 class
   */
  highlightClass?: HighlightClassValue
  /**
   * @desc 应用于每个匹配分段的额外内联样式
   */
  highlightStyle?: StyleValue
}

/**
 * 强类型的具名插槽，用于完全自定义分段渲染
 */
export interface HighlightSlots {
  /**
   * @desc 自定义匹配分段的渲染
   * @param props 匹配分段
   */
  match?: (props: HighlightMatchSegment) => VNodeChild
  /**
   * @desc 自定义纯文本分段的渲染
   * @param props 纯文本分段
   */
  text?: (props: HighlightTextSegment) => VNodeChild
}
