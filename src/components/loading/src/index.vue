<script lang="ts" setup>
import { computed, defineAsyncComponent } from 'vue'
import LoadingBeat from './components/Beat.vue'
import type { LoadingProps } from './types'

const props = withDefaults(defineProps<LoadingProps>(), {
  description: 'Loading...',
  fullScreen: false,
})

const loadingComponents = {
  beat: LoadingBeat,
  spinner: defineAsyncComponent(() => import('./components/Spinner.vue')),
  pulse: defineAsyncComponent(() => import('./components/Pulse.vue')),
  bars: defineAsyncComponent(() => import('./components/Bars.vue')),
  ring: defineAsyncComponent(() => import('./components/Ring.vue')),
} as const

const loadingType = computed(() => props.type || props.animation || 'beat')
const loadingComponent = computed(() => loadingComponents[loadingType.value])
</script>

<template>
  <div
    class="w-loading"
    :class="[
      `w-loading--${loadingType}`,
      {
        'w-loading--container': !props.fullScreen,
        'w-loading--full': props.fullScreen,
      },
    ]"
    role="status"
    aria-live="polite"
  >
    <div class="w-loading-loader" aria-hidden="true">
      <component :is="loadingComponent" />
    </div>
    <div v-if="props.description" class="w-loading-description">
      {{ props.description }}
    </div>
  </div>
</template>

<style lang="less" scoped>
.w-loading {
  --w-loading-size: 56px;
  --w-loading-radius: 8px;
  --w-loading-primary: rgb(var(--w-color-primary));
  --w-loading-bg: rgb(var(--w-bg-page));
  --w-loading-gradient-strong: rgb(var(--w-color-primary) / 12%);
  --w-loading-gradient-soft: rgb(var(--w-color-primary) / 6%);
  --w-loading-shadow: rgb(var(--w-color-primary) / 16%);

  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 100%;
  overflow: hidden;
  background:
    linear-gradient(
      145deg,
      var(--w-loading-gradient-strong) 0%,
      transparent 48%
    ),
    linear-gradient(325deg, var(--w-loading-gradient-soft) 0%, transparent 42%),
    var(--w-loading-bg);

  &--container {
    flex: 1;
    height: 100%;
    min-height: 100%;
  }

  &--full {
    --w-loading-gradient-strong: rgb(var(--w-color-primary) / 18%);
    --w-loading-gradient-soft: rgb(var(--w-color-primary) / 9%);

    position: fixed;
    inset: 0;
    z-index: 9999;
    backdrop-filter: blur(10px);
  }

  &--pulse {
    .w-loading-loader {
      width: 72px;
      height: 72px;
    }
  }

  &-loader {
    position: relative;
    width: var(--w-loading-size);
    height: var(--w-loading-size);
    filter: drop-shadow(0 12px 24px var(--w-loading-shadow));
  }

  &-description {
    margin-top: 50px;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
    color: rgb(var(--w-text-regular));
    letter-spacing: 0;
  }
}
</style>
