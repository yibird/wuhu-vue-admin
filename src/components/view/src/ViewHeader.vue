<script setup lang="ts">
import { Icon } from '@/components'
import { getCssSize, viewContextKey } from './context'
import type {
  ViewCollapseEmits,
  WViewHeaderProps,
  WViewHeaderSlots,
} from './types'
import type { CSSProperties } from 'vue'

const props = withDefaults(defineProps<WViewHeaderProps>(), {
  collapsible: false,
  trigger: true,
  collapseLabel: '收起头部',
  expandLabel: '展开头部',
})

const collapsed = defineModel<boolean>('collapsed', { default: false })
const emits = defineEmits<ViewCollapseEmits>()
const slots = defineSlots<WViewHeaderSlots>()
defineOptions({ name: 'WViewHeader', inheritAttrs: false })

const contentId = useId()
const viewContext = inject(viewContextKey, null)
const showTrigger = computed(() => props.collapsible && props.trigger)
const headerStyle = computed<CSSProperties>(() => {
  const gap = viewContext?.gap.value ?? '0px'
  const shouldOffsetGap =
    collapsed.value && viewContext?.direction.value === 'vertical'

  return {
    marginBlockEnd: shouldOffsetGap ? getCssSize(gap) : '0px',
  }
})

function toggle() {
  const nextCollapsed = !collapsed.value
  collapsed.value = nextCollapsed
  emits('collapse', nextCollapsed)
}
</script>

<template>
  <header
    class="w-view-header"
    :class="{ 'w-view-header-collapsed': collapsed }"
    :style="headerStyle"
    :aria-expanded="!collapsed"
  >
    <div class="w-view-header__body">
      <div
        :id="contentId"
        class="w-view-header__collapse"
        :aria-hidden="collapsed"
        :inert="collapsed"
      >
        <div class="w-view-header__content" v-bind="$attrs">
          <slot :collapsed="collapsed" />
        </div>
      </div>
    </div>

    <div v-if="showTrigger" class="w-view-header__trigger">
      <slot
        v-if="slots.trigger"
        name="trigger"
        :collapsed="collapsed"
        :toggle="toggle"
      />
      <button
        v-else
        type="button"
        class="w-view-header__trigger-button"
        :aria-label="collapsed ? expandLabel : collapseLabel"
        :title="collapsed ? expandLabel : collapseLabel"
        :aria-controls="contentId"
        :aria-expanded="!collapsed"
        @click="toggle"
      >
        <span class="w-view-header__trigger-icon" aria-hidden="true">
          <Icon name="i-lucide:chevron-up" :size="14" />
        </span>
      </button>
    </div>
  </header>
</template>

<style lang="less" scoped>
.w-view-header {
  position: relative;
  box-sizing: border-box;
  min-width: 0;
  overflow: visible;
  transition: margin-block-end var(--w-motion-duration-slow)
    var(--w-motion-ease-standard);

  &__body {
    display: grid;
    grid-template-rows: 1fr;
    min-width: 0;
    overflow: hidden;
    transition: grid-template-rows var(--w-motion-duration-slow)
      var(--w-motion-ease-standard);
  }

  &__collapse {
    min-height: 0;
    overflow: hidden;
    transition:
      opacity var(--w-motion-duration-base) var(--w-motion-ease-standard),
      transform var(--w-motion-duration-slow) var(--w-motion-ease-standard);
  }

  &__content {
    box-sizing: border-box;
    min-width: 0;
  }

  &__trigger {
    position: absolute;
    bottom: 0;
    left: 50%;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translate(-50%, 50%);

    &-button {
      display: inline-grid;
      place-items: center;
      width: 48px;
      height: 26px;
      padding: 0;
      color: rgb(var(--w-text-secondary));
      cursor: pointer;
      background: rgb(var(--w-bg-container));
      border: 1px solid rgb(var(--w-border-color-2));
      border-radius: 6px;
      box-shadow: 0 4px 12px rgb(0 0 0 / 10%);

      &:hover .w-view-header__trigger-icon {
        scale: 1.16;
      }

      &:active .w-view-header__trigger-icon {
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

  &.w-view-header-collapsed {
    .w-view-header__body {
      grid-template-rows: 0fr;
    }

    .w-view-header__collapse {
      pointer-events: none;
      opacity: 0;
      transform: translateY(-8px);
    }

    .w-view-header__trigger-icon {
      transform: rotate(180deg);
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .w-view-header,
  .w-view-header__body,
  .w-view-header__collapse,
  .w-view-header__trigger-button,
  .w-view-header__trigger-icon {
    transition: none;
  }
}
</style>
