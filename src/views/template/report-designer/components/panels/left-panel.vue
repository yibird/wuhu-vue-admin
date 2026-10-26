<template>
  <aside
    class="report-left-panel min-h-0 flex w-280 flex-none flex-col b-r-1-regular bg-container"
  >
    <div class="flex-none p-10">
      <a-segmented v-model:value="activeTab" block :options="tabOptions" />
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto p-12">
      <template v-if="activeTab === 'datasets'">
        <div class="mb-8 flex items-center justify-between gap-6">
          <strong class="text-xs text-main">数据集</strong>
          <a-button type="link" @click="emits('open-dataset')">
            添加数据集
          </a-button>
        </div>

        <a-empty v-if="datasets.length === 0" description="暂无数据集">
          <a-button type="primary" @click="emits('open-dataset')">
            添加数据集
          </a-button>
        </a-empty>

        <div v-else class="grid gap-8">
          <section
            v-for="dataset in datasets"
            :key="dataset.id"
            class="rounded-7 b-1-regular bg-container"
          >
            <header class="flex items-center gap-6 b-b-1-muted px-8 py-6">
              <Icon name="i-lucide:database" :size="14" class="text-primary" />
              <span class="min-w-0 flex-1 truncate text-xs text-main font-600">
                {{ dataset.name }}
              </span>
              <span class="text-10px text-tertiary"
                >{{ dataset.rows.length }} 行</span
              >
              <button
                type="button"
                class="panel-icon-button text-error"
                title="删除数据集"
                @click="emits('remove-dataset', dataset.id)"
              >
                <Icon name="i-lucide:trash-2" :size="12" />
              </button>
            </header>
            <div class="grid gap-3 p-6">
              <button
                v-for="field in dataset.fields"
                :key="field.key"
                type="button"
                draggable="true"
                class="flex items-center gap-6 rounded-5 px-8 py-6 text-left text-xs text-secondary hover:(bg-primary/6 text-primary)"
                :title="`点击插入 {{${dataset.id}.${field.key}}}`"
                @click="insertField(dataset, field.key)"
                @dragstart="onFieldDragStart(dataset, field.key, $event)"
              >
                <Icon
                  name="i-lucide:grip-vertical"
                  :size="11"
                  class="text-tertiary"
                />
                <span class="min-w-0 flex-1 truncate">{{ field.label }}</span>
                <span class="text-10px text-tertiary">{{ field.type }}</span>
              </button>
            </div>
            <p v-if="dataset.error" class="m-0 px-8 pb-6 text-10px text-error">
              {{ dataset.error }}
            </p>
          </section>
        </div>
      </template>

      <template v-else-if="activeTab === 'regions'">
        <strong class="mb-8 block text-xs text-main">数据区域</strong>
        <label class="mb-8 block text-11px text-secondary">
          选择数据集
          <a-select
            v-model:value="regionDatasetId"
            class="mt-4 w-full"
            :options="datasetOptions"
            placeholder="选择数据集"
          />
        </label>
        <a-button
          block
          class="mb-10"
          type="primary"
          :disabled="!regionDatasetId"
          @click="createRegion"
        >
          <template #icon><Icon name="i-lucide:table-2" /></template>
          将选中行设为明细区域
        </a-button>

        <a-empty
          v-if="regions.length === 0"
          description="当前工作表暂无数据区域"
        />

        <div v-else class="grid gap-6">
          <div
            v-for="region in regions"
            :key="region.id"
            role="button"
            tabindex="0"
            class="cursor-pointer rounded-6 border-1 border-solid px-8 py-7 text-left transition-colors"
            :class="
              region.id === selectedRegionId
                ? 'border-primary/40 bg-primary/6'
                : 'border-regular bg-secondary hover:bg-hover'
            "
            @click="emits('select-region', region.id)"
            @keydown.enter.prevent="emits('select-region', region.id)"
          >
            <div class="flex items-center gap-6">
              <Icon name="i-lucide:table-2" :size="13" class="text-primary" />
              <span class="min-w-0 flex-1 truncate text-xs text-main">
                {{ datasetName(region.datasetId) }}
              </span>
              <button
                type="button"
                class="panel-icon-button text-error"
                title="删除区域"
                @click.stop="emits('remove-region', region.id)"
              >
                <Icon name="i-lucide:trash-2" :size="12" />
              </button>
            </div>
            <p class="m-0 mt-4 text-10px text-tertiary">
              明细行 {{ region.detail.startRow + 1 }} -
              {{ region.detail.endRow + 1 }} · {{ region.groups.length }} 个分组
            </p>
          </div>
        </div>
      </template>

      <template v-else>
        <strong class="mb-8 block text-xs text-main">报表参数</strong>
        <div class="mb-10 grid gap-6 rounded-7 bg-fill p-8">
          <a-input
            v-model:value="newParameter.key"
            placeholder="参数标识,例如 month"
          />
          <a-input v-model:value="newParameter.label" placeholder="参数名称" />
          <a-select
            v-model:value="newParameter.type"
            :options="parameterTypeOptions"
          />
          <a-input
            v-model:value="newParameter.defaultValue"
            placeholder="默认值"
          />
          <a-button type="primary" @click="addParameter"> 添加参数 </a-button>
        </div>

        <a-empty v-if="parameters.length === 0" description="暂无参数" />

        <div v-else class="grid gap-8">
          <div
            v-for="parameter in parameters"
            :key="parameter.key"
            class="rounded-7 b-1-regular p-8"
          >
            <div class="flex items-center gap-6">
              <code class="min-w-0 flex-1 truncate text-11px text-primary">
                {{ parameter.key }}
              </code>
              <button
                type="button"
                class="panel-icon-button text-error"
                @click="emits('remove-parameter', parameter.key)"
              >
                <Icon name="i-lucide:trash-2" :size="12" />
              </button>
            </div>
            <a-input
              class="mt-5"
              :value="parameter.label"
              @update:value="
                (value: string) =>
                  emits('update-parameter', {
                    ...parameter,
                    label: String(value),
                  })
              "
            />
            <a-input
              class="mt-4"
              :value="parameter.defaultValue"
              placeholder="默认值"
              @update:value="
                (value: string) =>
                  emits('update-parameter', {
                    ...parameter,
                    defaultValue: String(value),
                  })
              "
            />
          </div>
        </div>
      </template>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { Icon } from '@/components'
import type { DataRegion, Dataset, ReportParameter } from '../../types'

const props = withDefaults(
  defineProps<{
    datasets: Dataset[]
    regions: DataRegion[]
    parameters: ReportParameter[]
    selectedRegionId?: string
  }>(),
  { selectedRegionId: undefined }
)

const emits = defineEmits<{
  'open-dataset': []
  'remove-dataset': [id: string]
  'insert-field': [payload: { datasetId: string; fieldKey: string }]
  'select-region': [id: string]
  'remove-region': [id: string]
  'create-region': [datasetId: string]
  'add-parameter': [parameter: ReportParameter]
  'update-parameter': [parameter: ReportParameter]
  'remove-parameter': [key: string]
}>()

const activeTab = shallowRef<'datasets' | 'regions' | 'parameters'>('datasets')
const tabOptions = [
  { label: '数据集', value: 'datasets' },
  { label: '数据区域', value: 'regions' },
  { label: '参数', value: 'parameters' },
]

const regionDatasetId = shallowRef<string>()
const newParameter = reactive<ReportParameter>({
  key: '',
  label: '',
  type: 'text',
  defaultValue: '',
})
const parameterTypeOptions = [
  { label: '文本', value: 'text' },
  { label: '数字', value: 'number' },
  { label: '日期', value: 'date' },
]

const datasetOptions = computed(() =>
  props.datasets.map((dataset) => ({
    label: `${dataset.name} (${dataset.rows.length} 行)`,
    value: dataset.id,
  }))
)

watch(
  () => props.datasets,
  (datasets) => {
    if (!regionDatasetId.value && datasets.length) {
      regionDatasetId.value = datasets[0].id
    }
  },
  { immediate: true }
)

function datasetName(id: string) {
  return props.datasets.find((dataset) => dataset.id === id)?.name ?? id
}

function insertField(dataset: Dataset, fieldKey: string) {
  emits('insert-field', { datasetId: dataset.id, fieldKey })
}

function onFieldDragStart(
  dataset: Dataset,
  fieldKey: string,
  event: DragEvent
) {
  event.dataTransfer?.setData(
    'application/x-report-field',
    JSON.stringify({ datasetId: dataset.id, fieldKey })
  )
  event.dataTransfer?.setData('text/plain', `{{${dataset.id}.${fieldKey}}}`)
  event.dataTransfer!.effectAllowed = 'copy'
}

function createRegion() {
  if (!regionDatasetId.value) return
  emits('create-region', regionDatasetId.value)
}

function addParameter() {
  const key = newParameter.key.trim()
  if (!key) return
  emits('add-parameter', {
    ...newParameter,
    key,
    label: newParameter.label.trim() || key,
  })
  newParameter.key = ''
  newParameter.label = ''
  newParameter.type = 'text'
  newParameter.defaultValue = ''
}
</script>

<style scoped>
.panel-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 4px;
}

.panel-icon-button:hover {
  background: rgb(var(--w-bg-hover));
}
</style>
