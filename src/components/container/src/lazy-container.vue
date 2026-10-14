<template>
  <component
    :is="props.tag"
    ref="containerRef"
    class="w-lazy-container"
    :style="{
      minHeight:
        typeof props.minHeight === 'string'
          ? props.minHeight
          : `${props.minHeight}px`,
    }"
    :aria-busy="shouldRender ? undefined : 'true'"
    :data-loaded="loaded || undefined"
  >
    <slot v-if="shouldRender" :visible="visible" :loaded="loaded" />
    <slot v-else name="placeholder" :visible="visible" :loaded="loaded" />
  </component>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import type {
  LazyContainerEmits,
  LazyContainerProps,
  LazyContainerSlots,
} from './types.ts'

defineOptions({ name: 'LazyContainer' })

const props = withDefaults(defineProps<LazyContainerProps>(), {
  eager: false,
  once: true,
  rootMargin: '200px 0px',
  tag: 'div',
  threshold: 0,
})

const emits = defineEmits<LazyContainerEmits>()
defineSlots<LazyContainerSlots>()

const containerRef = useTemplateRef<HTMLElement>('containerRef')

const visible = shallowRef(props.eager)
const loaded = shallowRef(props.eager)

const shouldRender = computed(() => {
  return props.once ? loaded.value : visible.value
})

const setVisible = (nextVisible: boolean) => {
  if (visible.value !== nextVisible) {
    visible.value = nextVisible
    emits('visible-change', nextVisible)
  }

  if (!nextVisible || loaded.value) return

  loaded.value = true
  emits('load')

  if (props.once) stop()
}

const { isSupported, stop } = useIntersectionObserver(
  containerRef,
  ([entry]) => {
    setVisible(Boolean(entry?.isIntersecting))
  },
  {
    immediate: !props.eager,
    rootMargin: () => props.rootMargin,
    threshold: props.threshold,
  }
)

onMounted(() => {
  if (!isSupported.value) {
    setVisible(true)
  }
})
</script>
