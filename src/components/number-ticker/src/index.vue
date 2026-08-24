<template>
  <span class="w-number-ticker">
    {{ formattedValue }}
  </span>
</template>

<script setup lang="ts">
import {
  usePreferredReducedMotion,
  useTransition,
  TransitionPresets,
} from '@vueuse/core'
import { formatNumberTickerValue, toFiniteNumber } from './utils'
import type { NumberTickerProps } from './types'

const props = withDefaults(defineProps<NumberTickerProps>(), {
  duration: 1500,
  decimals: 0,
  prefix: '',
  suffix: '',
  useGrouping: true,
  transition: 'easeOutCubic',
})

const source = shallowRef(0)
const reducedMotion = usePreferredReducedMotion()
const transitionDuration = computed(() =>
  reducedMotion.value === 'reduce' ? 0 : Math.max(0, props.duration)
)

const outputValue = useTransition(source, {
  duration: transitionDuration,
  transition:
    TransitionPresets[props.transition] || TransitionPresets.easeOutCubic,
})

watch(
  () => props.value,
  (newVal) => {
    source.value = toFiniteNumber(newVal)
  },
  { immediate: true }
)

const formattedValue = computed(() => {
  const value = formatNumberTickerValue(
    outputValue.value,
    props.decimals,
    props.useGrouping,
    props.locale
  )

  return `${props.prefix}${value}${props.suffix}`
})
</script>

<style scoped>
.w-number-ticker {
  display: inline-block;
  font-variant-numeric: tabular-nums;
}
</style>
