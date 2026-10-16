<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import type { GradientTextProps } from './types'

const props = withDefaults(defineProps<GradientTextProps>(), {
  colors: () => ['#8B5CF6', '#3B82F6', '#06B6D4'],
  direction: 'to right',
  animated: false,
  duration: 3,
  as: 'span',
})

const gradientStyle = computed<CSSProperties>(() => ({
  backgroundImage: `linear-gradient(${props.direction}, ${props.colors.join(', ')})`,
  '--w-gradient-duration': `${Math.max(0, props.duration)}s`,
}))
</script>

<template>
  <component
    :is="as"
    class="w-gradient-text"
    :class="{ 'w-gradient-text--animated': animated }"
    :style="gradientStyle"
  >
    <slot />
  </component>
</template>

<style scoped>
/*
 * 只保留无前缀写法:Safari 14+ / Chrome 120+ 均已支持 background-clip: text,
 * 而项目基线(用到 color-mix)本身就要求 Chrome 111+ / Safari 16.2+。
 * -webkit-text-fill-color 是 stylelint 允许的兼容写法,继续保留。
 */
.w-gradient-text {
  display: inline;
  color: transparent;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.w-gradient-text--animated {
  background-size: 200% auto;
  animation: w-gradient-text-flow var(--w-gradient-duration) linear infinite;
}

@keyframes w-gradient-text-flow {
  from {
    background-position: 0% center;
  }

  to {
    background-position: 200% center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .w-gradient-text--animated {
    animation: none;
  }
}
</style>
