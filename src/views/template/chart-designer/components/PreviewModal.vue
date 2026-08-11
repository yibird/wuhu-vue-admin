<script setup lang="ts">
import type { ChartDataSource, ChartScreenConfig, ChartWidget } from '../types'
import Preview from './Preview.vue'
import ScreenTitleBar from './ScreenTitleBar.vue'

const props = defineProps<{
  dataSources: readonly ChartDataSource[]
  screenConfig: ChartScreenConfig
  widgets: readonly ChartWidget[]
}>()

const open = defineModel<boolean>('open', { required: true })

function getSource(sourceId: string) {
  return props.dataSources.find((source) => source.id === sourceId)
}
</script>

<template>
  <a-modal
    v-model:open="open"
    :footer="null"
    class="chart-preview-modal"
    title="预览"
    width="1180px"
  >
    <div
      class="h-[74vh] min-h-0 overflow-hidden rounded-8"
      :style="{ backgroundColor: screenConfig.canvasBackground }"
    >
      <Scrollbar class="min-h-0" content-class="min-h-full p-16">
        <section
          class="mx-auto min-w-860 rounded-8 border-1 border-white/12 border-solid bg-[rgb(4_13_28)] p-18 shadow-[0_24px_72px_rgb(0_0_0_/_28%)]"
          :style="{
            aspectRatio: `${screenConfig.width} / ${screenConfig.height}`,
          }"
        >
          <ScreenTitleBar
            :screen-config="screenConfig"
            :stats="{
              sourceCount: dataSources.length,
              widgetCount: widgets.length,
              onlineSourceCount: dataSources.filter(
                (source) => source.status === 'online'
              ).length,
              refreshLabel: screenConfig.autoRefresh ? '自动刷新' : '手动刷新',
            }"
          />
          <div
            class="mt-12 grid grid-cols-12 auto-rows-[minmax(128px,1fr)] gap-12"
          >
            <article
              v-for="widget in widgets"
              :key="widget.id"
              class="min-h-0 overflow-hidden rounded-8 border-1 border-white/10 border-solid bg-white/7 p-12"
              :style="{
                gridColumn: `span ${widget.colSpan}`,
                gridRow: `span ${widget.rowSpan}`,
              }"
            >
              <h3 class="m-0 truncate text-14px font-700 text-white">
                {{ widget.title }}
              </h3>
              <div class="mt-10 h-[calc(100%-28px)] min-h-0">
                <Preview
                  :preview-mode="screenConfig.previewMode"
                  :source="getSource(widget.sourceId)"
                  :widget="widget"
                />
              </div>
            </article>
          </div>
        </section>
      </Scrollbar>
    </div>
  </a-modal>
</template>
