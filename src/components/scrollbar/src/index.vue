<template>
  <OverlayScrollbarsComponent
    ref="overlayRef"
    :element="props.element"
    :options="mergedOptions"
    :events="props.events"
    :defer="props.defer"
    class="w-scrollbar"
  >
    <div v-if="props.contentClass" :class="props.contentClass">
      <slot />
    </div>
    <slot v-else />
  </OverlayScrollbarsComponent>
</template>

<script lang="ts" setup>
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
import './style.less'
import type { OverlayScrollbarsComponentRef } from 'overlayscrollbars-vue'
import type { PartialOptions } from 'overlayscrollbars'
import type { ScrollbarInstance, ScrollbarProps } from './types'

/**
 * 默认选项：滑块样式由 style.less 按宿主类 .w-scrollbar 提供，
 * 因此不使用 theme（自定义主题名不会自带任何滑块尺寸/颜色）；
 * 显隐沿用「悬浮显示、移出隐藏」
 */
const DEFAULT_OPTIONS = {
  scrollbars: {
    autoHide: 'leave',
    autoHideDelay: 300,
  },
  update: {
    // 侧边栏折叠等宽度动画期间,ResizeObserver/MutationObserver 会每帧触发;
    // 去抖后只在动画结束后更新一次,避免整页滚动容器每帧都做同步样式计算
    debounce: {
      mutation: 100,
      resize: 100,
      event: 100,
      env: 100,
    },
    // 本项目没有 RTL / 竖排布局,跳过昂贵的「非默认书写方向」样式读取
    flowDirectionStyles: () => ({}),
  },
} satisfies PartialOptions

const props = withDefaults(defineProps<ScrollbarProps>(), {
  contentClass: '',
  element: 'div',
  options: undefined,
  events: undefined,
  defer: false,
})

const overlayRef = useTemplateRef<OverlayScrollbarsComponentRef>('overlayRef')

const mergedOptions = computed<ScrollbarProps['options']>(() => {
  if (props.options === false || props.options === null) return props.options

  return {
    ...DEFAULT_OPTIONS,
    ...props.options,
    scrollbars: {
      ...DEFAULT_OPTIONS.scrollbars,
      ...props.options?.scrollbars,
    },
  }
})

const getInstance = () => overlayRef.value?.osInstance() ?? null
const getViewport = () => getInstance()?.elements().viewport ?? null

defineExpose<ScrollbarInstance>({
  getScrollElement: getViewport,
  getContentElement: () => getInstance()?.elements().content ?? null,
  getElement: () => overlayRef.value?.getElement() ?? null,
  scrollTo: (options: ScrollToOptions) => getViewport()?.scrollTo(options),
  setScrollTop: (value: number) => {
    const viewport = getViewport()
    if (viewport) viewport.scrollTop = value
  },
  setScrollLeft: (value: number) => {
    const viewport = getViewport()
    if (viewport) viewport.scrollLeft = value
  },
  update: () => getInstance()?.update(),
  getInstance,
})
</script>
