<script setup lang="ts">
import type { WCardProps, WCardSlots } from './types'

defineOptions({ name: 'WCard' })

const props = withDefaults(defineProps<WCardProps>(), {
  gradient: true,
})

const slots = defineSlots<WCardSlots>()

const forwardedSlotNames = computed(
  () => Object.keys(slots) as (keyof WCardSlots)[]
)
</script>

<template>
  <a-card v-bind="props" :class="{ 'w-card--gradient': props.gradient }">
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
