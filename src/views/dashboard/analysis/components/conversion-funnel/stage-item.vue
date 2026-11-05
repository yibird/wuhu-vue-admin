<template>
  <div
    class="group relative rounded-8 px-6 py-10 transition-[background-color,transform] hover:(-translate-y-2 bg-hover)"
    tabindex="0"
    role="listitem"
  >
    <div class="relative z-1 mb-9 flex items-center justify-between gap-10">
      <div class="min-w-0 flex items-center gap-9">
        <span
          :class="[
            'relative z-1 size-28 flex shrink-0 items-center justify-center rounded-999 border-1 border-solid text-xs font-800',
            badgeClass,
          ]"
        >
          {{ String(index + 1).padStart(2, '0') }}
        </span>
        <div class="min-w-0">
          <div class="truncate text-sm text-main font-700">
            {{ stage.title }}
          </div>
          <div class="mt-1 truncate text-xs text-secondary">
            {{ stage.value }} 人
          </div>
        </div>
      </div>
      <div class="shrink-0 text-right">
        <div class="text-md text-main font-800">{{ stage.rate }}%</div>
        <div class="mt-2 text-xs" :class="stage.toneClass">
          {{ stage.trend }}
        </div>
      </div>
    </div>
    <div class="relative h-22 overflow-hidden rounded-6 bg-muted">
      <div
        class="relative mx-auto h-full bg-gradient-to-r [clip-path:polygon(0_0,100%_0,94%_100%,6%_100%)] transition-[filter,transform,width] duration-300 ease-[var(--w-motion-ease)] group-hover:(scale-y-110 [filter:saturate(1.2)]) group-focus-visible:(scale-y-110 [filter:saturate(1.2)])"
        :class="stage.fillClass"
        :style="{ width: `${stage.rate}%` }"
      >
        <span
          class="absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_18%,rgb(255_255_255_/_24%)_48%,transparent_72%)] opacity-70 transition-transform duration-500 ease-[var(--w-motion-ease)] group-hover:translate-x-full group-focus-visible:translate-x-full"
        ></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { FunnelStage } from './types'

const { stage, index, total } = defineProps<{
  stage: FunnelStage
  index: number
  /** 阶段总数,用于判断首尾节点的强调样式 */
  total: number
}>()

const badgeClass = computed(() => {
  if (index === 0) return 'border-primary bg-primary text-white'
  if (index === total - 1) return 'border-warning bg-warning/10 text-warning'
  return 'border-regular bg-container text-secondary'
})
</script>
