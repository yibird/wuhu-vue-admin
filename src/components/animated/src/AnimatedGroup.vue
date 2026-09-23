<template>
  <MotionConfig :reduced-motion="reducedMotion">
    <LayoutGroup v-if="props.items.length > 0" :id="props.id">
      <AnimatePresence
        :as="props.as"
        :mode="props.mode"
        :initial="props.initial"
        :class="props.class"
      >
        <Motion
          v-for="item in props.items"
          :key="props.getKey(item)"
          :as="props.motionAs"
          :layout="props.layout"
          v-bind="getMotionBind"
          :class="props.motionClass"
        >
          <slot :item="item" />
        </Motion>
      </AnimatePresence>
    </LayoutGroup>
  </MotionConfig>
</template>
<script setup lang="ts" generic="T">
import {
  LayoutGroup,
  AnimatePresence,
  Motion,
  MotionConfig,
  useMotionConfig,
} from 'motion-v'
import { motions } from './motion'
import type { AnimatedGroupProps } from './types'

const props = withDefaults(defineProps<AnimatedGroupProps<T>>(), {
  as: 'div',
  mode: 'popLayout',
  initial: false,
  items: () => [],
  motionType: 'smooth',
  motionAs: 'div',
})

const parentConfig = useMotionConfig()

/**
 * MotionConfig 的 reducedMotion 自带默认值("never"),会覆盖外层配置,
 * 因此未显式传入 reducedMotion 时手动继承外层取值
 */
const reducedMotion = computed(
  () => props.reducedMotion ?? parentConfig.value.reducedMotion
)

const getMotionBind = computed(() => {
  const motion = motions[props.motionType]
  if (motion) return motion
  return {
    initial: props.motionInitial,
    animate: props.motionAnimate,
    exit: props.motionExit,
    transition: props.motionTransition,
  }
})
</script>
