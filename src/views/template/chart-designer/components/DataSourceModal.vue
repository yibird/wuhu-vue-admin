<script setup lang="ts">
import type { ChartDataSource } from '../types'

const props = defineProps<{
  activeSourceId: string
  dataSources: readonly ChartDataSource[]
}>()

const open = defineModel<boolean>('open', { required: true })
const jsonDraft = defineModel<string>('jsonDraft', { required: true })

const emit = defineEmits<{
  importJson: []
  selectSource: [id: string]
  updateSource: [id: string, patch: Partial<ChartDataSource>]
}>()

const activeSource = computed(() =>
  props.dataSources.find((source) => source.id === props.activeSourceId)
)
</script>

<template>
  <a-modal v-model:open="open" :footer="null" title="数据源管理" width="860px">
    <div class="h-[68vh] min-h-0 grid grid-cols-[280px_minmax(0,1fr)] gap-12">
      <section
        class="min-h-0 overflow-hidden rounded-8 border-1 border-color-2 border-solid"
      >
        <header class="border-b border-color-2 px-12 py-10">
          <h3 class="m-0 text-14px font-700 text-primary">数据源列表</h3>
          <p class="m-0 mt-3 text-12px text-secondary">
            REST / SQL / JSON / 样例数据
          </p>
        </header>
        <Scrollbar class="min-h-0" content-class="p-10">
          <a-button
            v-for="source in dataSources"
            :key="source.id"
            class="chart-data-source-item mb-8 w-full"
            :class="{
              'border-primary bg-primary/6': source.id === activeSourceId,
            }"
            @click="emit('selectSource', source.id)"
          >
            <span class="block w-full text-left">
              <div class="flex items-center justify-between gap-8">
                <strong class="truncate text-13px text-primary">{{
                  source.name
                }}</strong>
                <span
                  class="rounded-full px-7 py-2 text-11px"
                  :class="
                    source.status === 'online'
                      ? 'bg-success/12 text-success'
                      : source.status === 'error'
                        ? 'bg-error/12 text-error'
                        : 'bg-warning/12 text-warning'
                  "
                >
                  {{ source.status }}
                </span>
              </div>
              <p
                class="m-0 mt-6 line-clamp-2 text-12px text-secondary leading-18px"
              >
                {{ source.description }}
              </p>
            </span>
          </a-button>
        </Scrollbar>
      </section>

      <section
        class="min-h-0 grid grid-rows-[minmax(0,1fr)_auto] overflow-hidden rounded-8 border-1 border-color-2 border-solid"
      >
        <Scrollbar class="min-h-0" content-class="p-14">
          <div v-if="activeSource" class="grid gap-12">
            <div>
              <h3 class="m-0 text-15px font-700 text-primary">
                {{ activeSource.name }}
              </h3>
              <p class="m-0 mt-4 text-12px text-secondary">
                {{ activeSource.description }}
              </p>
            </div>

            <div class="grid grid-cols-3 gap-8">
              <div class="rounded-7 bg-fill p-10">
                <p class="m-0 text-11px text-tertiary">类型</p>
                <strong class="mt-4 block text-13px text-primary">{{
                  activeSource.kind.toUpperCase()
                }}</strong>
              </div>
              <div class="rounded-7 bg-fill p-10">
                <p class="m-0 text-11px text-tertiary">数据量</p>
                <strong class="mt-4 block text-13px text-primary"
                  >{{ activeSource.records.length }} 行</strong
                >
              </div>
              <div class="rounded-7 bg-fill p-10">
                <p class="m-0 text-11px text-tertiary">更新时间</p>
                <strong class="mt-4 block truncate text-13px text-primary">{{
                  activeSource.updatedAt
                }}</strong>
              </div>
            </div>

            <label class="block text-12px text-secondary">
              刷新间隔
              <input
                class="mt-5 h-32 w-full rounded-6 border-1 border-color-2 border-solid bg-fill px-8 text-13px text-primary outline-none focus:border-primary"
                min="0"
                type="number"
                :value="activeSource.refreshInterval"
                @input="
                  emit('updateSource', activeSource!.id, {
                    refreshInterval: Number(
                      ($event.target as HTMLInputElement).value
                    ),
                  })
                "
              />
            </label>

            <div>
              <strong class="text-13px text-primary">字段预览</strong>
              <div class="mt-8 flex flex-wrap gap-6">
                <span
                  v-for="field in activeSource.fields"
                  :key="field.key"
                  class="rounded-6 bg-fill px-7 py-4 text-11px text-secondary"
                >
                  {{ field.label }} · {{ field.type }}
                </span>
              </div>
            </div>
          </div>
        </Scrollbar>

        <footer class="border-t border-color-2 p-12">
          <div class="flex items-center justify-between gap-8">
            <strong class="text-13px text-primary">快速导入 JSON 数据源</strong>
            <a-button type="primary" @click="emit('importJson')">
              <template #icon>
                <Icon name="i-lucide:database-zap" :size="14" />
              </template>
              导入
            </a-button>
          </div>
          <textarea
            v-model="jsonDraft"
            class="mt-8 h-92 w-full resize-none rounded-6 border-1 border-color-2 border-solid bg-fill px-8 py-7 font-mono text-12px text-primary outline-none focus:border-primary"
            spellcheck="false"
          ></textarea>
        </footer>
      </section>
    </div>
  </a-modal>
</template>

<style scoped>
.chart-data-source-item {
  height: auto;
  padding: 10px;
  border-radius: 7px;
}
</style>
