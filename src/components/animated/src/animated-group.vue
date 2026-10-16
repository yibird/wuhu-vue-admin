<template>
  <MotionConfig :reduced-motion="reducedMotion">
    <LayoutGroup :id="props.id">
      <AnimatePresence
        v-bind="$attrs"
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
import type { AnimatedGroupProps, AnimatedGroupSlots } from './types'
const props = withDefaults(defineProps<AnimatedGroupProps<T>>(), {
  as: 'div',
  mode: 'popLayout',
  initial: false,
  items: () => [],
  motionType: 'smooth',
  motionAs: 'div',
})

defineSlots<AnimatedGroupSlots<T>>()

const parentConfig = useMotionConfig()

const reducedMotion = computed(
  () => props.reducedMotion ?? parentConfig.value.reducedMotion
)

const getMotionBind = computed(() => motions[props.motionType])
</script>
