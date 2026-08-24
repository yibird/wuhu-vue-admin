<script setup lang="ts">
import { CHART_DESIGNER_SELECTORS } from '../constants'
import type { ChartPaletteItem } from '../types'

const props = defineProps<{
  favorites: readonly ChartPaletteItem[]
  palette: readonly ChartPaletteItem[]
}>()

const emit = defineEmits<{
  addWidget: [item: ChartPaletteItem]
  dragStart: [item: ChartPaletteItem, event: DragEvent]
}>()

const activeTab = shallowRef<'all' | 'favorite'>('all')
const paletteTabOptions = [
  { label: '图表', value: 'all' },
  { label: '收藏', value: 'favorite' },
]

const currentPalette = computed(() =>
  activeTab.value === 'favorite' ? props.favorites : props.palette
)
</script>

<template>
  <section
    class="min-h-0 min-w-0 grid grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container shadow-[var(--w-shadow-card)]"
  >
    <header class="border-b border-color-2 px-12 py-10">
      <div class="flex items-center justify-between gap-8">
        <div class="min-w-0">
          <h2 class="m-0 text-14px font-700 text-primary">组件素材</h2>
          <p class="m-0 mt-3 text-12px text-secondary">点击或拖拽添加到大屏</p>
        </div>
        <a-segmented
          v-model:value="activeTab"
          :options="paletteTabOptions"
          size="small"
        />
      </div>
    </header>

    <Scrollbar class="min-h-0" content-class="p-10">
      <a-button
        v-for="item in currentPalette"
        :key="`${item.kind}-${item.type}`"
        class="chart-palette-card mb-8 w-full"
        :data-testid="CHART_DESIGNER_SELECTORS.paletteItem"
        :data-chart-palette-item="`${item.kind}:${item.type}`"
        draggable="true"
        @dragstart="emit('dragStart', item, $event)"
        @click="emit('addWidget', item)"
      >
        <span
          class="w-full grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-8 text-left"
        >
          <span
            class="size-32 flex items-center justify-center rounded-7 bg-fill text-primary"
          >
            <Icon :name="item.icon" :size="17" />
          </span>
          <span class="min-w-0">
            <strong class="block truncate text-13px text-primary">{{
              item.title
            }}</strong>
            <small class="mt-2 block truncate text-11px text-secondary">
              {{ item.description }}
            </small>
          </span>
          <Icon name="i-lucide:plus" :size="15" class="text-tertiary" />
        </span>
      </a-button>
    </Scrollbar>
  </section>
</template>

<style scoped>
.chart-palette-card {
  height: auto;
  padding: 9px;
  border-radius: 7px;
}
</style>
