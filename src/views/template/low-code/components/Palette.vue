<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import PaletteItem from './PaletteItem.vue'
import type {
  DesignerComponentType,
  DesignerPaletteCategory,
  DesignerPaletteItem,
  DesignerPaletteTab,
} from '../types'

const props = defineProps<{
  embedded?: boolean
  palette: DesignerPaletteItem[]
  tabs: DesignerPaletteTab[]
}>()

defineEmits<{
  add: [type: DesignerComponentType]
}>()

const activeTab = shallowRef<DesignerPaletteCategory>('basic')

const activeItems = computed(() =>
  props.palette.filter((item) => item.category === activeTab.value)
)

const tabCounts = computed(() => {
  return props.tabs.reduce(
    (acc, tab) => {
      acc[tab.key] = props.palette.filter(
        (item) => item.category === tab.key
      ).length
      return acc
    },
    {} as Record<DesignerPaletteCategory, number>
  )
})
</script>

<template>
  <aside
    class="min-h-0 min-w-0 grid overflow-hidden"
    :class="
      embedded
        ? 'h-full grid-rows-[auto_minmax(0,1fr)] bg-transparent'
        : 'grid-rows-[auto_auto_minmax(0,1fr)] rounded-8 border-1 border-color-2 border-solid bg-container shadow-[var(--w-shadow-elevated)]'
    "
  >
    <div
      v-if="!embedded"
      class="border-0 border-b-1 border-color-2 border-b-solid px-16 py-14"
    >
      <div class="text-sm text-main font-700">组件素材</div>
      <div class="mt-3 text-xs text-secondary">拖入画布生成模块</div>
    </div>

    <div
      class="grid grid-cols-3 gap-4 border-0 border-b-1 border-color-2 border-b-solid p-8"
    >
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        :data-low-code-palette-tab="tab.key"
        class="h-34 min-w-0 rounded-8 border-0 bg-transparent px-6 text-12px text-secondary cursor-pointer transition-colors hover:bg-hover hover:text-main"
        :class="activeTab === tab.key ? 'bg-primary-tint text-primary' : ''"
        @click="activeTab = tab.key"
      >
        <span class="flex items-center justify-center gap-5">
          <Icon :name="tab.icon" :size="14" />
          <span class="truncate">{{ tab.label }}</span>
          <span class="text-11px text-muted">{{ tabCounts[tab.key] }}</span>
        </span>
      </button>
    </div>

    <Scrollbar class="min-h-0" content-class="p-10">
      <div class="grid grid-cols-5 gap-x-4 gap-y-10 max-xl:grid-cols-4">
        <a-tooltip
          v-for="item in activeItems"
          :key="item.type"
          :title="item.title"
          placement="top"
        >
          <PaletteItem :item="item" @add="$emit('add', $event)" />
        </a-tooltip>
      </div>
    </Scrollbar>
  </aside>
</template>
