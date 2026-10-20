<script setup lang="ts">
import { computed, shallowRef, useAttrs, useTemplateRef } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { Card } from '@/components'
import type { VNodeChild } from 'vue'

defineOptions({ inheritAttrs: false })

/**
 * 注意不要占用 `size` 之类的 Card 属性名,否则会被 props 截胡、无法透传给 Card。
 */
withDefaults(
  defineProps<{
    /**
     * @desc 光束动画时长(秒)
     * @default 8
     */
    duration?: number
    /**
     * @desc 光束线宽
     * @default 2
     */
    lineWidth?: number
  }>(),
  { duration: 8, lineWidth: 2 }
)

/**
 * 卡片插槽统一透传,避免每个卡片各写一层光束包装
 */
const slots = defineSlots<{
  default?: () => VNodeChild
  title?: () => VNodeChild
  extra?: () => VNodeChild
}>()

const forwardedSlotNames = computed(
  () => Object.keys(slots) as Array<keyof typeof slots>
)

const attrs = useAttrs()
const cardRef = useTemplateRef('cardRef')

/**
 * 光束是无限动画,离屏后继续跑只会白占主线程与合成资源;
 * 这里用视口观察在离开视口时暂停,回到视口再恢复。
 */
const visible = shallowRef(true)

useIntersectionObserver(
  cardRef,
  ([entry]) => {
    visible.value = entry?.isIntersecting ?? true
  },
  { rootMargin: '160px' }
)

const cardClass = computed(() => [
  attrs.class,
  'w-beam-card',
  { 'w-beam-card--idle': !visible.value },
])

const cardAttrs = computed(() => ({ ...attrs, class: cardClass.value }))
</script>

<template>
  <a-border-beam :duration="duration" :line-width="lineWidth" :size="140">
    <Card ref="cardRef" v-bind="cardAttrs">
      <template
        v-for="slotName in forwardedSlotNames"
        :key="slotName"
        #[slotName]
      >
        <slot :name="slotName" />
      </template>
    </Card>
  </a-border-beam>
</template>

<style lang="less" scoped>
/* 光束节点由 BorderBeam teleport 到卡片内部,离屏时暂停其无限动画 */
.w-beam-card--idle :deep(.ant-border-beam)::before {
  animation-play-state: paused;
}
</style>
