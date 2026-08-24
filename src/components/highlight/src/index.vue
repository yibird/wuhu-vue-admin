<script setup lang="ts">
import {
  createHighlightSegments,
  findLiteralHighlightMatches,
  normalizeHighlightKeywords,
} from './utils'
import type {
  HighlightMatcherContext,
  HighlightProps,
  HighlightSlots,
} from './types'

defineOptions({ name: 'Highlight' })

const props = withDefaults(defineProps<HighlightProps>(), {
  caseSensitive: false,
  highlightTag: 'mark',
  keyword: '',
  maxMatches: 0,
  tag: 'span',
  wholeWord: false,
})

defineSlots<HighlightSlots>()

/**
 * Matching and segmentation are computed once for each relevant prop change.
 * The template only iterates over ready-to-render text nodes, avoiding regex or
 * array work during unrelated parent renders.
 */
const segments = computed(() => {
  const keywords = normalizeHighlightKeywords(
    props.keyword,
    props.caseSensitive
  )
  const context: HighlightMatcherContext = {
    text: props.text,
    keywords,
    caseSensitive: props.caseSensitive,
    wholeWord: props.wholeWord,
    maxMatches: props.maxMatches,
  }
  const matches = props.matcher
    ? props.matcher(context)
    : findLiteralHighlightMatches(context)

  return createHighlightSegments(props.text, matches, props.maxMatches)
})
</script>

<template>
  <component :is="tag" class="w-highlight">
    <template
      v-for="segment in segments"
      :key="`${segment.kind}:${segment.start}:${segment.end}`"
    >
      <slot v-if="segment.kind === 'match'" name="match" v-bind="segment">
        <component
          :is="highlightTag"
          class="w-highlight__mark"
          :class="highlightClass"
          :style="highlightStyle"
          data-highlight
          :data-highlight-index="segment.index"
        >
          {{ segment.text }}
        </component>
      </slot>
      <slot v-else name="text" v-bind="segment">
        {{ segment.text }}
      </slot>
    </template>
  </component>
</template>

<style scoped lang="less">
.w-highlight__mark {
  padding-inline: 0.125em;
  color: #fff;
  background: rgb(var(--w-color-primary));
  border-radius: 2px;
  box-decoration-break: clone;
}
</style>
