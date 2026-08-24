<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'
import { Nav, List, Preview } from './components'
import { useIconCategories, useIconOptions } from './composables'
import { ALL_ICON_CATEGORY } from './data'
import type {
  IconOptionEmits,
  IconPickerProps,
  IconSelectorOption,
} from './types'

type IconPickerBaseProps = Omit<IconPickerProps, 'open'>

const props = withDefaults(defineProps<IconPickerBaseProps>(), {
  allowClear: true,
  clearText: 'Clear icon',
  disabled: false,
  emptyText: 'No icons found',
  gridColumns: 7,
  iconSize: 20,
  maxVisible: 0,
  placeholder: 'Select icon',
  popupMaxHeight: 420,
  searchPlaceholder: 'Search icons',
  showCategories: true,
  size: 'middle',
  title: 'Select icon',
  virtualOverscan: 4,
  width: 760,
})

const emit = defineEmits<IconOptionEmits>()
const modelOpen = defineModel<boolean>('open', { default: false })
const dialogId = `icon-picker-${useId()}`
const triggerRef = useTemplateRef<HTMLButtonElement>('triggerRef')
const gridPanelRef = useTemplateRef<HTMLElement>('gridPanelRef')
const gridPanelWidth = shallowRef(0)

const {
  filteredOptions,
  searchValue,
  selectedOption,
  clearIcon,
  emitSearch,
  resetSearch,
  selectIcon,
} = useIconOptions(props, emit)
const { activeCategory, activeCategoryItem, categoryItems, visibleOptions } =
  useIconCategories(filteredOptions, () => props.showCategories)

const updateOpen = (open: boolean) => {
  if (props.disabled && open) return
  modelOpen.value = open
}

const modalWidth = computed(() => {
  if (typeof props.width === 'number') {
    return `min(${props.width}px, calc(100vw - 24px))`
  }

  return props.width
})
const accessibleTriggerLabel = computed(
  () =>
    props.triggerLabel ||
    `${props.title}: ${selectedOption.value?.label ?? props.placeholder}`
)
const gridMaxHeight = computed(() => Math.max(160, props.popupMaxHeight))
const gridViewportHeight = computed(() =>
  Math.max(120, gridMaxHeight.value - 40)
)
const resolvedGridColumns = computed(() => {
  const configuredColumns = Math.max(2, props.gridColumns)
  if (!gridPanelWidth.value) return configuredColumns

  return Math.min(
    configuredColumns,
    Math.max(2, Math.floor((gridPanelWidth.value - 12) / 72))
  )
})

useResizeObserver(gridPanelRef, ([entry]) => {
  gridPanelWidth.value = entry.contentRect.width
})

const handleSelect = (option: IconSelectorOption) => {
  selectIcon(option)
  updateOpen(false)
}

const handleClear = (event: MouseEvent) => {
  event.stopPropagation()
  clearIcon()
}

const restoreTriggerFocus = () => {
  triggerRef.value?.focus()
}

const handleAfterClose = () => {
  resetSearch()
  restoreTriggerFocus()
}
</script>

<template>
  <div
    class="w-icon-picker-trigger relative inline-flex w-full min-w-0 items-center"
  >
    <button
      ref="triggerRef"
      type="button"
      class="w-icon-picker-trigger__button box-border inline-flex w-full min-w-0 cursor-pointer items-center justify-between gap-8 rounded-6 border-1 border-color-2 border-solid bg-container px-11 text-left text-sm text-main transition-colors hover:border-primary disabled:cursor-not-allowed"
      :class="{
        'h-24 text-xs': size === 'small',
        'h-32': size === 'middle',
        'h-40 text-md': size === 'large',
        'pr-56': allowClear && selectedOption && !disabled,
        'w-icon-picker-trigger__button--disabled': disabled,
      }"
      :disabled="disabled"
      :aria-controls="dialogId"
      :aria-expanded="modelOpen"
      :aria-label="accessibleTriggerLabel"
      aria-haspopup="dialog"
      @click="updateOpen(true)"
    >
      <span class="flex min-w-0 flex-1 items-center gap-8">
        <Preview
          v-if="selectedOption"
          :name="selectedOption.value"
          :size="iconSize"
          class="shrink-0 text-main"
        />
        <span
          :class="selectedOption ? 'text-main' : 'text-placeholder'"
          class="min-w-0 truncate"
        >
          {{ selectedOption?.label ?? placeholder }}
        </span>
      </span>
      <Icon
        name="i-lucide:chevrons-up-down"
        :size="14"
        class="shrink-0 text-muted"
      />
    </button>
    <button
      v-if="allowClear && selectedOption && !disabled"
      type="button"
      class="w-icon-picker-clear absolute right-28 top-1/2 z-1 inline-flex size-20 -translate-y-1/2 items-center justify-center rounded-4 border-0 bg-transparent p-0 text-muted hover:(bg-hover text-main)"
      :aria-label="clearText"
      :title="clearText"
      @click="handleClear"
    >
      <Icon name="i-lucide:x" :size="14" />
    </button>
  </div>

  <a-modal
    :id="dialogId"
    centered
    :footer="null"
    :title="title"
    :width="modalWidth"
    destroy-on-hidden
    :styles="{ body: { padding: '0' } }"
    :after-close="handleAfterClose"
    v-model:open="modelOpen"
  >
    <div class="w-icon-picker-panel min-w-0 p-12 sm:p-20">
      <div class="mb-14 flex min-w-0 items-center gap-10">
        <a-input
          class="min-w-0 flex-1"
          :allow-clear="true"
          :placeholder="searchPlaceholder"
          :value="searchValue"
          @update:value="emitSearch"
        >
          <template #prefix>
            <Icon name="i-lucide:search" :size="16" class="text-muted" />
          </template>
        </a-input>
        <a-button
          v-if="allowClear"
          class="shrink-0"
          :disabled="!selectedOption"
          @click="clearIcon"
        >
          {{ clearText }}
        </a-button>
      </div>

      <div
        class="grid min-w-0 overflow-hidden rounded-6 border-1 border-color-1 border-solid bg-container"
        :class="
          showCategories
            ? 'grid-cols-[120px_minmax(0,1fr)] sm:grid-cols-[152px_minmax(0,1fr)]'
            : 'grid-cols-1'
        "
        :style="{ height: `${gridMaxHeight}px` }"
      >
        <Nav
          v-if="showCategories"
          :active-key="activeCategory"
          :items="categoryItems"
          :total="categoryItems[0]?.count ?? 0"
          @select="activeCategory = $event"
        />

        <section ref="gridPanelRef" class="min-h-0 min-w-0 flex flex-col">
          <header
            class="h-40 shrink-0 flex items-center border-b-1 border-color-1 border-b-solid px-12"
          >
            <div class="relative h-full min-w-0 flex-1">
              <Transition name="w-icon-picker-header">
                <div
                  :key="activeCategoryItem?.key || ALL_ICON_CATEGORY"
                  class="absolute inset-0 flex items-center justify-between gap-8"
                >
                  <div class="min-w-0 flex items-center gap-7">
                    <Icon
                      :name="activeCategoryItem?.icon || 'i-lucide:grid-3x3'"
                      :size="15"
                      class="shrink-0 text-primary"
                    />
                    <span class="truncate text-sm text-main font-500">
                      {{ activeCategoryItem?.label || '全部图标' }}
                    </span>
                  </div>
                  <span class="shrink-0 text-xs text-muted">
                    {{ visibleOptions.length }} 个
                  </span>
                </div>
              </Transition>
            </div>
          </header>

          <div class="relative min-h-0 flex-1 overflow-hidden">
            <Transition name="w-icon-picker-grid">
              <div :key="activeCategory" class="absolute inset-0 min-h-0">
                <List
                  fill-height
                  motion
                  show-name-tooltip
                  :columns="resolvedGridColumns"
                  :empty-text="emptyText"
                  :icon-size="iconSize"
                  :items="visibleOptions"
                  :max-height="gridViewportHeight"
                  :overscan="virtualOverscan"
                  :selected-value="value"
                  @select="handleSelect"
                />
              </div>
            </Transition>
          </div>
        </section>
      </div>
    </div>
  </a-modal>
</template>

<style scoped>
.w-icon-picker-trigger__button {
  outline: none;
}

.w-icon-picker-trigger__button--disabled {
  color: rgb(var(--w-text-disabled));
  cursor: not-allowed;
  background: rgb(var(--w-bg-disabled));
}

.w-icon-picker-trigger__button:focus-visible {
  border-color: rgb(var(--w-color-primary));
  box-shadow: 0 0 0 2px rgb(var(--w-color-primary) / 12%);
}

.w-icon-picker-header-enter-active,
.w-icon-picker-header-leave-active,
.w-icon-picker-grid-enter-active,
.w-icon-picker-grid-leave-active {
  transition:
    opacity var(--w-motion-duration-fast) var(--w-motion-ease-standard),
    transform var(--w-motion-duration-base) var(--w-motion-ease-enter);
}

.w-icon-picker-header-enter-from {
  opacity: 0;
  transform: translate3d(0, 4px, 0);
}

.w-icon-picker-header-leave-to {
  opacity: 0;
  transform: translate3d(0, -3px, 0);
}

.w-icon-picker-grid-enter-from {
  opacity: 0;
  transform: translate3d(8px, 0, 0);
}

.w-icon-picker-grid-leave-to {
  opacity: 0;
  transform: translate3d(-6px, 0, 0);
}

@media (prefers-reduced-motion: reduce) {
  .w-icon-picker-header-enter-active,
  .w-icon-picker-header-leave-active,
  .w-icon-picker-grid-enter-active,
  .w-icon-picker-grid-leave-active {
    transition: none;
  }
}
</style>
