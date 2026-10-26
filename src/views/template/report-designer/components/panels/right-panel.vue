<template>
  <aside
    class="report-right-panel min-h-0 flex w-340 flex-none flex-col b-l-1-regular bg-container"
  >
    <div class="flex-none p-10">
      <a-segmented v-model:value="activeTab" block :options="tabOptions" />
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto p-12">
      <template v-if="activeTab === 'region'">
        <a-empty
          v-if="regions.length === 0"
          description="当前工作表暂无数据区域"
        />

        <template v-else>
          <label class="mb-8 block text-xs text-secondary">
            选择数据区域
            <a-select
              class="mt-5 w-full"
              :value="selectedRegionId"
              :options="regionOptions"
              @change="
                (value: unknown) => emits('select-region', String(value))
              "
            />
          </label>

          <template v-if="region">
            <label class="block text-xs text-secondary">
              数据集
              <a-select
                class="mt-5 w-full"
                :value="region.datasetId"
                :options="datasetOptions"
                @change="
                  (value: unknown) => patchRegion({ datasetId: String(value) })
                "
              />
            </label>

            <div class="mt-10 grid grid-cols-2 gap-6">
              <label class="block text-xs text-secondary">
                明细起始行
                <a-input-number
                  class="mt-5 w-full"
                  :min="1"
                  :value="region.detail.startRow + 1"
                  @update:value="
                    (value: number | null) =>
                      patchRegion({
                        detail: {
                          ...region!.detail,
                          startRow: Math.max(0, (value ?? 1) - 1),
                        },
                      })
                  "
                />
              </label>
              <label class="block text-xs text-secondary">
                明细结束行
                <a-input-number
                  class="mt-5 w-full"
                  :min="1"
                  :value="region.detail.endRow + 1"
                  @update:value="
                    (value: number | null) =>
                      patchRegion({
                        detail: {
                          ...region!.detail,
                          endRow: Math.max(0, (value ?? 1) - 1),
                        },
                      })
                  "
                />
              </label>
            </div>

            <section class="mt-12">
              <div class="mb-6 flex items-center justify-between">
                <strong class="text-xs text-main">分组</strong>
                <a-button type="link" @click="addGroup"> 添加分组 </a-button>
              </div>
              <a-empty
                v-if="region.groups.length === 0"
                description="未设置分组"
              />
              <div
                v-for="(group, index) in region.groups"
                :key="`${group.field}-${index}`"
                class="mb-6 rounded-6 bg-fill p-8"
              >
                <div class="flex items-center gap-6">
                  <a-select
                    class="min-w-0 flex-1"
                    :value="group.field"
                    :options="fieldOptions"
                    @change="
                      (value: unknown) =>
                        updateGroup(index, { field: String(value) })
                    "
                  />
                  <button
                    type="button"
                    class="panel-icon-button text-error"
                    @click="removeGroup(index)"
                  >
                    <Icon name="i-lucide:trash-2" :size="12" />
                  </button>
                </div>
                <div class="mt-6 grid grid-cols-2 gap-5">
                  <a-input-number
                    :min="1"
                    :value="group.header ? group.header.startRow + 1 : null"
                    placeholder="分组头开始"
                    @update:value="
                      (value: number | null) =>
                        updateGroupBand(index, 'header', 'startRow', value)
                    "
                  />
                  <a-input-number
                    :min="1"
                    :value="group.header ? group.header.endRow + 1 : null"
                    placeholder="分组头结束"
                    @update:value="
                      (value: number | null) =>
                        updateGroupBand(index, 'header', 'endRow', value)
                    "
                  />
                  <a-input-number
                    :min="1"
                    :value="group.footer ? group.footer.startRow + 1 : null"
                    placeholder="分组尾开始"
                    @update:value="
                      (value: number | null) =>
                        updateGroupBand(index, 'footer', 'startRow', value)
                    "
                  />
                  <a-input-number
                    :min="1"
                    :value="group.footer ? group.footer.endRow + 1 : null"
                    placeholder="分组尾结束"
                    @update:value="
                      (value: number | null) =>
                        updateGroupBand(index, 'footer', 'endRow', value)
                    "
                  />
                </div>
              </div>
            </section>

            <section class="mt-12">
              <div class="mb-6 flex items-center justify-between">
                <strong class="text-xs text-main">筛选</strong>
                <a-button type="link" @click="addFilter"> 添加筛选 </a-button>
              </div>
              <a-empty
                v-if="region.filters.length === 0"
                description="未设置筛选"
              />
              <div
                v-for="(filter, index) in region.filters"
                :key="`${filter.field}-${index}`"
                class="mb-6 grid grid-cols-[minmax(0,1fr)_104px_minmax(0,1fr)_30px] items-center gap-4"
              >
                <a-select
                  :value="filter.field"
                  :options="fieldOptions"
                  @change="
                    (value: unknown) =>
                      updateFilter(index, { field: String(value) })
                  "
                />
                <a-select
                  :value="filter.operator"
                  :options="operatorOptions"
                  @change="
                    (value: unknown) =>
                      updateFilter(index, {
                        operator: value as RegionFilterOperator,
                      })
                  "
                />
                <a-input
                  :value="filter.value"
                  @update:value="
                    (value: string) =>
                      updateFilter(index, { value: String(value) })
                  "
                />
                <button
                  type="button"
                  class="panel-icon-button text-error"
                  @click="removeFilter(index)"
                >
                  <Icon name="i-lucide:trash-2" :size="12" />
                </button>
              </div>
            </section>

            <section class="mt-12">
              <div class="mb-6 flex items-center justify-between">
                <strong class="text-xs text-main">排序</strong>
                <a-button type="link" @click="addSort"> 添加排序 </a-button>
              </div>
              <a-empty
                v-if="region.sort.length === 0"
                description="未设置排序"
              />
              <div
                v-for="(sort, index) in region.sort"
                :key="`${sort.field}-${index}`"
                class="mb-6 flex items-center gap-5"
              >
                <a-select
                  class="min-w-0 flex-1"
                  :value="sort.field"
                  :options="fieldOptions"
                  @change="
                    (value: unknown) =>
                      updateSort(index, { field: String(value) })
                  "
                />
                <span class="flex items-center gap-4 text-11px text-secondary">
                  降序
                  <a-switch
                    :checked="sort.desc"
                    @update:checked="
                      (checked: boolean) => updateSort(index, { desc: checked })
                    "
                  />
                </span>
                <button
                  type="button"
                  class="panel-icon-button text-error"
                  @click="removeSort(index)"
                >
                  <Icon name="i-lucide:trash-2" :size="12" />
                </button>
              </div>
            </section>
          </template>
        </template>
      </template>

      <template v-else>
        <div
          v-if="regionSyncDegraded"
          class="mb-10 rounded-6 bg-warning/10 px-8 py-6 text-11px text-warning"
        >
          撤销/重做后区域 Band 可能已偏移，请核对行列号后重新发布。
        </div>

        <label class="block text-xs text-secondary">
          工作表名称
          <a-input
            class="mt-5"
            :value="sheet.name"
            @press-enter="onRenameSheet"
            @blur="onRenameSheet"
          />
        </label>

        <div class="mt-10 grid grid-cols-2 gap-6">
          <label class="block text-xs text-secondary">
            行数
            <a-input-number
              class="mt-5 w-full"
              :min="1"
              :max="20000"
              :value="sheet.rowCount"
              @update:value="
                (value: number | null) =>
                  emits(
                    'set-sheet-size',
                    value ?? sheet.rowCount,
                    sheet.columnCount
                  )
              "
            />
          </label>
          <label class="block text-xs text-secondary">
            列数
            <a-input-number
              class="mt-5 w-full"
              :min="1"
              :max="200"
              :value="sheet.columnCount"
              @update:value="
                (value: number | null) =>
                  emits(
                    'set-sheet-size',
                    sheet.rowCount,
                    value ?? sheet.columnCount
                  )
              "
            />
          </label>
          <label class="block text-xs text-secondary">
            冻结行
            <a-input-number
              class="mt-5 w-full"
              :min="0"
              :max="20"
              :value="sheet.freezeRows"
              @update:value="
                (value: number | null) =>
                  emits('set-freeze', value ?? 0, sheet.freezeCols)
              "
            />
          </label>
          <label class="block text-xs text-secondary">
            冻结列
            <a-input-number
              class="mt-5 w-full"
              :min="0"
              :max="20"
              :value="sheet.freezeCols"
              @update:value="
                (value: number | null) =>
                  emits('set-freeze', sheet.freezeRows, value ?? 0)
              "
            />
          </label>
        </div>

        <div class="mt-12 rounded-7 bg-fill p-10 text-xs text-secondary">
          <p class="m-0">合并区域：{{ sheet.mergeCount }} 个</p>
          <p class="m-0 mt-5">数据区域：{{ sheet.regionCount }} 个</p>
        </div>
      </template>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { Icon } from '@/components'
import type {
  Band,
  DataRegion,
  Dataset,
  GroupSpec,
  RegionFilter,
  RegionFilterOperator,
  SheetInfo,
  SortSpec,
} from '../../types'

const props = withDefaults(
  defineProps<{
    sheet: SheetInfo
    regions: DataRegion[]
    datasets: Dataset[]
    selectedRegionId?: string
    regionSyncDegraded?: boolean
  }>(),
  { selectedRegionId: undefined, regionSyncDegraded: false }
)

const emits = defineEmits<{
  'rename-sheet': [id: string, name: string]
  'set-sheet-size': [rows: number, cols: number]
  'set-freeze': [rows: number, cols: number]
  'update-region': [id: string, patch: Partial<DataRegion>]
  'remove-region': [id: string]
  'select-region': [id: string]
}>()

const activeTab = shallowRef<'region' | 'sheet'>('region')
const tabOptions = [
  { label: '区域', value: 'region' },
  { label: '工作表', value: 'sheet' },
]

const operatorOptions = [
  { label: '等于', value: 'eq' },
  { label: '不等于', value: 'neq' },
  { label: '包含', value: 'contains' },
  { label: '大于', value: 'gt' },
  { label: '大于等于', value: 'gte' },
  { label: '小于', value: 'lt' },
  { label: '小于等于', value: 'lte' },
]

const region = computed(() =>
  props.regions.find((item) => item.id === props.selectedRegionId)
)

const regionOptions = computed(() =>
  props.regions.map((item, index) => ({
    label: `区域 ${index + 1} · ${datasetName(item.datasetId)}`,
    value: item.id,
  }))
)

const datasetOptions = computed(() =>
  props.datasets.map((dataset) => ({
    label: dataset.name,
    value: dataset.id,
  }))
)

const fieldOptions = computed(() => {
  const dataset = props.datasets.find(
    (item) => item.id === region.value?.datasetId
  )
  return (dataset?.fields ?? []).map((field) => ({
    label: `${field.label} (${field.key})`,
    value: field.key,
  }))
})

function datasetName(id: string) {
  return props.datasets.find((dataset) => dataset.id === id)?.name ?? id
}

function onRenameSheet(event: Event) {
  const name = (event.target as HTMLInputElement).value.trim()
  if (name) emits('rename-sheet', props.sheet.id, name)
}

function patchRegion(patch: Partial<DataRegion>) {
  if (!region.value) return
  emits('update-region', region.value.id, patch)
}

function updateGroup(index: number, patch: Partial<GroupSpec>) {
  if (!region.value) return
  patchRegion({
    groups: region.value.groups.map((group, current) =>
      current === index ? { ...group, ...patch } : group
    ),
  })
}

function addGroup() {
  if (!region.value) return
  const field = fieldOptions.value[0]?.value
  if (!field) return
  patchRegion({
    groups: [...region.value.groups, { field }],
  })
}

function removeGroup(index: number) {
  if (!region.value) return
  patchRegion({
    groups: region.value.groups.filter((_, current) => current !== index),
  })
}

function updateGroupBand(
  index: number,
  band: 'header' | 'footer',
  edge: 'startRow' | 'endRow',
  value: number | null
) {
  if (!region.value) return
  const group = region.value.groups[index]
  if (!group) return
  const currentBand: Band | undefined = group[band]
  const nextBand: Band | undefined =
    value === null
      ? undefined
      : {
          startRow: currentBand?.startRow ?? Math.max(0, value - 1),
          endRow: currentBand?.endRow ?? Math.max(0, value - 1),
          [edge]: Math.max(0, value - 1),
        }
  updateGroup(index, { [band]: nextBand })
}

function updateFilter(index: number, patch: Partial<RegionFilter>) {
  if (!region.value) return
  patchRegion({
    filters: region.value.filters.map((filter, current) =>
      current === index ? { ...filter, ...patch } : filter
    ),
  })
}

function addFilter() {
  if (!region.value) return
  const field = fieldOptions.value[0]?.value
  if (!field) return
  patchRegion({
    filters: [
      ...region.value.filters,
      {
        id: `filter-${Date.now().toString(36)}`,
        field,
        operator: 'eq',
        value: '',
      },
    ],
  })
}

function removeFilter(index: number) {
  if (!region.value) return
  patchRegion({
    filters: region.value.filters.filter((_, current) => current !== index),
  })
}

function updateSort(index: number, patch: Partial<SortSpec>) {
  if (!region.value) return
  patchRegion({
    sort: region.value.sort.map((sort, current) =>
      current === index ? { ...sort, ...patch } : sort
    ),
  })
}

function addSort() {
  if (!region.value) return
  const field = fieldOptions.value[0]?.value
  if (!field) return
  patchRegion({
    sort: [...region.value.sort, { field, desc: false }],
  })
}

function removeSort(index: number) {
  if (!region.value) return
  patchRegion({
    sort: region.value.sort.filter((_, current) => current !== index),
  })
}
</script>

<style scoped>
.panel-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
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
