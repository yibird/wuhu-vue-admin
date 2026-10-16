<script setup lang="ts">
import { omit } from 'es-toolkit'
import type { CardProps, CardSlots } from './types'

const props = withDefaults(defineProps<CardProps>(), {
  gradient: true,
})

const slots = defineSlots<CardSlots>()

/**
 * bordered 已废弃，统一映射成 variant 后再透传，
 * 避免把 Vue 物化出的 bordered: false 传给 antd 触发警告。
 * gradient 只用于组件自身的渐变样式，不透传到 antdv / DOM。
 */
const cardProps = computed(() => {
  const { bordered, ...rest } = omit(props, ['gradient'])

  return {
    ...rest,
    variant: rest.variant ?? (bordered ? 'outlined' : 'borderless'),
  }
})

const forwardedSlotNames = computed(
  () => Object.keys(slots) as (keyof CardSlots)[]
)
</script>

<template>
  <a-card v-bind="cardProps" :class="{ 'w-card--gradient': props.gradient }">
    <template
      v-for="slotName in forwardedSlotNames"
      :key="slotName"
      #[slotName]="slotProps"
    >
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </a-card>
</template>

<style lang="less" scoped>
.w-card--gradient {
  background-image:
    radial-gradient(
      420px 190px at 0% 0%,
      rgb(var(--w-color-primary) / 8%),
      transparent 72%
    ),
    linear-gradient(
      158deg,
      rgb(var(--w-bg-container)) 0%,
      rgb(var(--w-bg-container)) 48%,
      color-mix(
          in srgb,
          rgb(var(--w-color-primary)) 7%,
          rgb(var(--w-bg-container))
        )
        100%
    );
}
</style>
