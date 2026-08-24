<template>
  <OverlayScrollbarsComponent
    ref="scrollbarRef"
    class="w-scrollbar"
    :defer="props.defer ?? true"
    :element="props.element"
    :options="scrollbarOptions"
    :events="scrollbarEvents"
  >
    <div ref="contentRef" :class="props.contentClass">
      <slot />
    </div>
  </OverlayScrollbarsComponent>
</template>

<script lang="ts" setup>
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
import type { EventListeners } from 'overlayscrollbars'
import type { OverlayScrollbarsComponentRef } from 'overlayscrollbars-vue'
import type { ScrollbarEmits, ScrollbarInstance, ScrollbarProps } from './types'
import 'overlayscrollbars/overlayscrollbars.css'

const props = withDefaults(defineProps<ScrollbarProps>(), {
  contentClass: '',
})
const emit = defineEmits<ScrollbarEmits>()
defineOptions({
  name: 'Scrollbar',
})

const scrollbarRef = ref<OverlayScrollbarsComponentRef | null>(null)
const contentRef = useTemplateRef<HTMLElement>('contentRef')

const defaultScrollbarOptions = {
  update: {
    debounce: {
      mutation: [80, 200],
      resize: [80, 200],
      event: [80, 200],
      env: [120, 300],
    },
    flowDirectionStyles: () => ({}),
  },
  scrollbars: {
    autoHide: 'leave',
    autoHideDelay: 120,
  },
} satisfies ScrollbarProps['options']

const scrollbarOptions = computed<
  Exclude<ScrollbarProps['options'], false | null> | undefined
>(() => {
  if (props.options === false || props.options === null) return undefined

  const options = props.options ?? {}

  return {
    ...defaultScrollbarOptions,
    ...options,
    update: {
      ...defaultScrollbarOptions.update,
      ...options.update,
    },
    scrollbars: {
      ...defaultScrollbarOptions.scrollbars,
      ...options.scrollbars,
    },
  } satisfies ScrollbarProps['options']
})

const scrollbarEvents = computed<EventListeners>(() => {
  const events = props.events || {}
  const userScroll = events.scroll
  const userScrollListeners = Array.isArray(userScroll)
    ? userScroll
    : userScroll
      ? [userScroll]
      : []

  return {
    ...events,
    scroll: [
      ...userScrollListeners,
      (_instance, event) => {
        emit('scroll', event)
      },
    ],
  }
})

const getScrollElement = () => {
  return (
    scrollbarRef.value?.osInstance()?.elements().scrollOffsetElement ??
    scrollbarRef.value?.getElement() ??
    null
  )
}

defineExpose<ScrollbarInstance>({
  osInstance: () => scrollbarRef.value?.osInstance() ?? null,
  getElement: () => scrollbarRef.value?.getElement() ?? null,
  getContentElement: () => contentRef.value,
  getScrollElement,
  scrollTo: (options: ScrollToOptions) => getScrollElement()?.scrollTo(options),
})
</script>

<style lang="less" scoped>
.w-scrollbar {
  width: 100%;
  height: 100%;
}
</style>
