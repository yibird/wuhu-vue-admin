<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import { toPx } from '@/utils'
import type {
  LazyContainerEmits,
  LazyContainerProps,
  LazyContainerSlots,
} from './types'

defineOptions({ name: 'LazyContainer' })

const props = withDefaults(defineProps<LazyContainerProps>(), {
  eager: false,
  minHeight: 1,
  once: true,
  rootMargin: '200px 0px',
  tag: 'div',
  threshold: 0,
})

const emit = defineEmits<LazyContainerEmits>()
defineSlots<LazyContainerSlots>()

const containerRef = useTemplateRef<HTMLElement>('containerRef')
const visible = shallowRef(props.eager)
const loaded = shallowRef(props.eager)
const shouldRender = computed(() => (props.once ? loaded.value : visible.value))
const containerStyle = computed(() => ({
  minHeight: toPx(props.minHeight),
}))

const setVisible = (nextVisible: boolean) => {
  if (visible.value !== nextVisible) {
    visible.value = nextVisible
    emit('visible-change', nextVisible)
  }

  if (!nextVisible || loaded.value) return

  loaded.value = true
  emit('load')
  if (props.once) stop()
}

const { isSupported, stop } = useIntersectionObserver(
  containerRef,
  ([entry]) => setVisible(Boolean(entry?.isIntersecting)),
  {
    immediate: !props.eager,
    rootMargin: () => props.rootMargin,
    threshold: props.threshold,
  }
)

onMounted(() => {
  if (!isSupported.value) setVisible(true)
})
</script>

<template>
  <component
    :is="props.tag"
    ref="containerRef"
    class="w-lazy-container"
    :style="containerStyle"
    :aria-busy="shouldRender ? undefined : 'true'"
    :data-loaded="loaded || undefined"
  >
    <slot v-if="shouldRender" :visible="visible" :loaded="loaded" />
    <slot v-else name="placeholder" :visible="visible" :loaded="loaded" />
  </component>
</template>
