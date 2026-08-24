<script setup lang="ts">
import { Nav, List, Preview } from './components'
import { useIconCategories, useIconOptions } from './composables'
import type { CSSProperties } from 'vue'
import type { SelectProps } from 'antdv-next'
import type {
  IconOptionEmits,
  IconSelectorOption,
  IconSelectorProps,
} from './types'

type IconSelectorBaseProps = Omit<IconSelectorProps, 'open'>

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<IconSelectorBaseProps>(), {
  allowClear: true,
  disabled: false,
  emptyText: 'No icons found',
  gridColumns: 6,
  iconSize: 18,
  maxVisible: 0,
  placeholder: 'Select icon',
  popupMaxHeight: 420,
  popupWidth: 620,
  searchPlaceholder: 'Search icons',
  showCategories: true,
  size: 'middle',
  title: 'Select icon',
  virtualOverscan: 4,
})

const emit = defineEmits<IconOptionEmits>()
const modelOpen = defineModel<boolean>('open', { default: false })

const {
  filteredOptions,
  normalizedOptions,
  searchValue,
  selectedOption,
  clearIcon,
  emitSearch,
  resetSearch,
  selectIcon,
} = useIconOptions(props, emit)
const { activeCategory, categoryItems, visibleOptions } = useIconCategories(
  filteredOptions,
  () => props.showCategories
)

const selectOptions = computed<SelectProps['options']>(() => {
  const option = selectedOption.value
  return option
    ? [
        {
          disabled: option.disabled,
          label: option.label,
          value: option.value,
        },
      ]
    : []
})

const selectClasses: NonNullable<SelectProps['classes']> = {
  popup: {
    root: 'w-icon-selector-popup',
  },
}

const popupWidth = computed<CSSProperties['width']>(() => {
  if (typeof props.popupWidth === 'number') {
    return `min(${props.popupWidth}px, calc(100vw - 24px))`
  }
  return props.popupWidth
})

const selectStyles = computed<SelectProps['styles']>(() => ({
  popup: {
    root: {
      padding: 0,
      width: popupWidth.value,
    },
  },
}))

const gridMaxHeight = computed(() => Math.max(160, props.popupMaxHeight - 36))

const model = computed<string | undefined>({
  get: () => props.value,
  set: (value) => {
    if (typeof value !== 'string') {
      clearIcon()
      return
    }

    const option = normalizedOptions.value.find((item) => item.value === value)
    if (option) selectIcon(option)
  },
})

function handleOpenChange(open: boolean) {
  modelOpen.value = open
  if (!open) resetSearch()
}

function handleSelect(option: IconSelectorOption) {
  selectIcon(option)
  modelOpen.value = false
  resetSearch()
}
</script>

<template>
  <a-select
    v-bind="$attrs"
    v-model:value="model"
    class="w-full"
    :allow-clear="allowClear"
    :disabled="disabled"
    :classes="selectClasses"
    :filter-option="false"
    :not-found-content="null"
    :open="modelOpen"
    :options="selectOptions"
    :placeholder="placeholder"
    :popup-match-select-width="false"
    :search-value="searchValue"
    show-search
    :size="size"
    :styles="selectStyles"
    :virtual="false"
    @open-change="handleOpenChange"
    @search="emitSearch"
  >
    <template #prefix>
      <Preview
        v-if="selectedOption"
        :name="selectedOption.value"
        :size="iconSize"
        class="pointer-events-none shrink-0 text-main"
      />
      <Icon
        v-else
        name="i-lucide:search"
        :size="iconSize"
        class="pointer-events-none shrink-0 text-muted"
      />
    </template>

    <template #popupRender>
      <div
        class="w-icon-selector-panel grid min-w-0 overflow-hidden bg-container"
        :class="
          showCategories
            ? 'grid-cols-[120px_minmax(0,1fr)] sm:grid-cols-[152px_minmax(0,1fr)]'
            : 'grid-cols-1'
        "
        :style="{ height: `${popupMaxHeight}px` }"
        @mousedown.prevent
      >
        <Nav
          v-if="showCategories"
          :active-key="activeCategory"
          :items="categoryItems"
          :total="categoryItems[0]?.count ?? 0"
          @select="activeCategory = $event"
        />

        <section class="min-h-0 min-w-0 flex flex-col">
          <div
            class="h-36 shrink-0 flex items-center justify-between gap-8 border-b-1 border-color-1 border-b-solid px-10 text-xs text-muted"
          >
            <span class="truncate">{{ title }}</span>
            <span class="shrink-0">{{ visibleOptions.length }} 个</span>
          </div>
          <List
            :columns="gridColumns"
            :empty-text="emptyText"
            :icon-size="iconSize"
            :items="visibleOptions"
            :max-height="gridMaxHeight"
            :overscan="virtualOverscan"
            :selected-value="value"
            @select="handleSelect"
          />
        </section>
      </div>
    </template>
  </a-select>
</template>
