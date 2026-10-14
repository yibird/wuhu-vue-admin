<template>
  <div ref="scrollElement" class="w-scrollbar scroll-hover">
    <div ref="contentElement" :class="props.contentClass">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ScrollbarInstance, ScrollbarProps } from './types'

const props = withDefaults(defineProps<ScrollbarProps>(), {
  contentClass: '',
})
defineOptions({
  name: 'Scrollbar',
})

const scrollElement = useTemplateRef<HTMLElement>('scrollElement')
const contentElement = useTemplateRef<HTMLElement>('contentElement')

defineExpose<ScrollbarInstance>({
  getScrollElement: () => scrollElement.value,
  getContentElement: () => contentElement.value,
  scrollTo: (options: ScrollToOptions) =>
    scrollElement.value?.scrollTo(options),
})
</script>

<style lang="less" scoped>
/**
 * 原生滚动容器:滚动条尺寸、滑块颜色、悬浮显隐与槽位保留统一由
 * src/styles/app.css 的全局规则与 .scroll-hover 提供,
 * 这里只维持「滚动容器 + 内容元素」两层结构,content-class 依然作用于内容层
 */
.w-scrollbar {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
