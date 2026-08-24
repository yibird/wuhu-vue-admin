<script setup lang="ts">
import { computed, inject, useId, type CSSProperties } from 'vue'
import { toPx } from '@/utils'
import { Icon } from '../../icon'
import { getCssSize, viewContextKey } from './context'
import type {
  ViewCollapseEmits,
  WViewSiderProps,
  WViewSiderSlots,
} from './types'

const props = withDefaults(defineProps<WViewSiderProps>(), {
  collapsible: false,
  trigger: true,
  collapseLabel: '收起侧栏',
  expandLabel: '展开侧栏',
  width: 240,
  collapsedWidth: 0,
})

const collapsed = defineModel<boolean>('collapsed', { default: false })
const emits = defineEmits<ViewCollapseEmits>()
const slots = defineSlots<WViewSiderSlots>()
defineOptions({ name: 'WViewSider', inheritAttrs: false })

const contentId = useId()
const viewContext = inject(viewContextKey, null)
const showTrigger = computed(() => props.collapsible && props.trigger)
const expandedWidth = computed(() => toPx(props.width))

const siderStyle = computed<CSSProperties>(() => {
  const width = toPx(collapsed.value ? props.collapsedWidth : props.width)
  const gap = viewContext?.gap.value ?? '0px'
  const shouldOffsetGap =
    collapsed.value && viewContext?.direction.value === 'horizontal'

  return {
    width,
    flexBasis: width,
    marginInlineEnd: shouldOffsetGap ? getCssSize(gap) : '0px',
  }
})

function toggle() {
  const nextCollapsed = !collapsed.value
  collapsed.value = nextCollapsed
  emits('collapse', nextCollapsed)
}
</script>

<template>
  <aside
    class="w-view-sider"
    :class="{ 'w-view-sider-collapsed': collapsed }"
    :style="siderStyle"
    :aria-expanded="!collapsed"
  >
    <div class="w-view-sider__body" v-bind="$attrs">
      <div
        :id="contentId"
        class="w-view-sider__content"
        :style="{ width: expandedWidth }"
        :aria-hidden="collapsed"
        :inert="collapsed"
      >
        <slot :collapsed="collapsed" />
      </div>
    </div>

    <div v-if="showTrigger" class="w-view-sider__trigger">
      <slot
        v-if="slots.trigger"
        name="trigger"
        :collapsed="collapsed"
        :toggle="toggle"
      />
      <button
        v-else
        type="button"
        class="w-view-sider__trigger-button"
        :aria-label="collapsed ? expandLabel : collapseLabel"
        :title="collapsed ? expandLabel : collapseLabel"
        :aria-controls="contentId"
        :aria-expanded="!collapsed"
        @click="toggle"
      >
        <span class="w-view-sider__trigger-icon" aria-hidden="true">
          <Icon name="i-lucide:chevron-left" :size="14" />
        </span>
      </button>
    </div>
  </aside>
</template>

<style lang="less" scoped>
.w-view-sider {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow: visible;
  transition:
    width var(--w-motion-duration-moderate) var(--w-motion-ease-enter),
    flex-basis var(--w-motion-duration-moderate) var(--w-motion-ease-enter),
    margin-inline-end var(--w-motion-duration-moderate)
      var(--w-motion-ease-enter);

  &__body {
    box-sizing: border-box;
    flex: 1;
    min-width: 0;
    overflow: hidden;
  }

  &__content {
    box-sizing: border-box;
    min-height: 100%;
    overflow: hidden;
    transition:
      opacity var(--w-motion-duration-base) var(--w-motion-ease-standard),
      transform var(--w-motion-duration-moderate) var(--w-motion-ease-enter);
  }

  &__trigger {
    position: absolute;
    top: 50%;
    right: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translate(50%, -50%);

    &-button {
      display: inline-grid;
      place-items: center;
      width: 26px;
      height: 48px;
      padding: 0;
      color: rgb(var(--w-text-secondary));
      cursor: pointer;
      background: rgb(var(--w-bg-container));
      border: 1px solid rgb(var(--w-border-color-2));
      border-radius: 6px;
      box-shadow: 0 4px 12px rgb(0 0 0 / 10%);

      &:hover .w-view-sider__trigger-icon {
        scale: 1.16;
      }

      &:active .w-view-sider__trigger-icon {
        scale: 1.08;
      }

      &:focus-visible {
        outline: 2px solid rgb(var(--w-color-primary));
        outline-offset: 2px;
      }
    }

    &-icon {
      display: grid;
      place-items: center;
      transition: scale var(--w-motion-duration-base) var(--w-motion-ease-enter);
    }
  }

  &.w-view-sider-collapsed {
    .w-view-sider__content {
      pointer-events: none;
      opacity: 0;
      transform: translateX(-8px);
    }

    .w-view-sider__trigger-icon {
      transform: rotate(180deg);
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .w-view-sider,
  .w-view-sider__content,
  .w-view-sider__trigger-button,
  .w-view-sider__trigger-icon {
    transition: none;
  }
}
</style>
