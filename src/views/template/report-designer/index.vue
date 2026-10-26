<template>
  <WView :full="true" :padding="0">
    <div class="h-full min-h-0 flex flex-col overflow-hidden bg-page">
      <!-- 菜单栏 -->
      <header
        class="flex flex-none flex-wrap items-center gap-8 b-b-1-regular bg-container px-10 py-7"
      >
        <span
          class="size-32 flex flex-none items-center justify-center rounded-7 bg-primary/12 text-primary"
        >
          <Icon name="i-lucide:table-2" :size="17" />
        </span>
        <a-input
          class="w-220 text-sm font-600"
          :value="workbookName"
          :maxlength="40"
          @press-enter="onRenameWorkbook"
          @blur="onRenameWorkbook"
        />
        <a-tag v-if="previewMode" color="processing" class="m-0!">
          预览模式
        </a-tag>
        <a-tag v-if="autosaveState === 'saving'" color="default" class="m-0!">
          保存中
        </a-tag>
        <a-tag
          v-else-if="autosaveState === 'saved'"
          color="success"
          class="m-0!"
        >
          已保存
        </a-tag>
        <a-tag v-if="regionSyncDegraded" color="warning" class="m-0!">
          区域待核对
        </a-tag>

        <span class="ml-auto" />
        <a-button :disabled="previewMode" @click="newDocument">
          <template #icon
            ><Icon name="i-lucide:file-plus-2" :size="15"
          /></template>
          新建
        </a-button>
        <a-button :disabled="previewMode" @click="loadSample">
          <template #icon
            ><Icon name="i-lucide:sparkles" :size="15"
          /></template>
          示例
        </a-button>
        <a-button :disabled="previewMode" @click="openSchema">
          <template #icon><Icon name="i-lucide:braces" :size="15" /></template>
          Schema
        </a-button>
        <a-button
          :loading="autosaveState === 'saving'"
          :disabled="previewMode"
          @click="saveDraft"
        >
          <template #icon><Icon name="i-lucide:save" :size="15" /></template>
          保存
        </a-button>
        <a-button type="primary" :disabled="previewMode" @click="onPublish">
          <template #icon><Icon name="i-lucide:rocket" :size="15" /></template>
          发布
        </a-button>

        <a-dropdown
          :menu="{ items: structuralItems }"
          :trigger="['click']"
          :disabled="previewMode"
          @menu-click="onStructuralMenu"
        >
          <a-button :disabled="previewMode">
            <template #icon
              ><Icon name="i-lucide:rows-3" :size="15"
            /></template>
            行列
          </a-button>
        </a-dropdown>

        <a-dropdown
          :menu="{ items: exportItems }"
          :trigger="['click']"
          @menu-click="onExportMenu"
        >
          <a-button>
            <template #icon
              ><Icon name="i-lucide:download" :size="15"
            /></template>
            导出
          </a-button>
        </a-dropdown>
        <a-button @click="printSheet">
          <template #icon><Icon name="i-lucide:printer" :size="15" /></template>
          打印
        </a-button>
        <a-button :disabled="isLoading" @click="togglePreview">
          <template #icon>
            <Icon
              :name="previewMode ? 'i-lucide:pencil-ruler' : 'i-lucide:eye'"
              :size="15"
            />
          </template>
          {{ previewMode ? '退出预览' : '预览' }}
        </a-button>
      </header>

      <!-- 预览参数栏 -->
      <div
        v-if="previewMode && parameters.length > 0"
        class="flex flex-none flex-wrap items-center gap-10 b-b-1-regular bg-container px-10 py-6"
      >
        <span class="text-xs text-secondary">报表参数</span>
        <span v-if="previewResult" class="text-11px text-tertiary">
          共 {{ previewResult.rowCount }} 行
        </span>
        <label
          v-for="parameter in parameters"
          :key="parameter.key"
          class="flex items-center gap-5 text-xs text-secondary"
        >
          {{ parameter.label }}
          <a-input-number
            v-if="parameter.type === 'number'"
            :value="Number(parameterValues[parameter.key] ?? 0)"
            @update:value="
              (value: number | null) =>
                setParameterValue(parameter.key, value ?? 0)
            "
          />
          <a-input
            v-else
            :value="String(parameterValues[parameter.key] ?? '')"
            @update:value="
              (value: string) => setParameterValue(parameter.key, String(value))
            "
          />
        </label>
      </div>

      <!-- 主区域 -->
      <div class="min-h-0 flex-1 flex overflow-hidden">
        <LeftPanel
          v-if="!previewMode"
          :datasets="datasets"
          :parameters="parameters"
          :regions="regions"
          :selected-region-id="selectedRegionId"
          @add-parameter="addParameter"
          @create-region="onCreateRegion"
          @insert-field="onInsertField"
          @open-dataset="datasetModalOpen = true"
          @remove-dataset="onRemoveDataset"
          @remove-parameter="removeParameter"
          @remove-region="onRemoveRegion"
          @select-region="selectedRegionId = $event"
          @update-parameter="updateParameter"
        />

        <div
          class="relative min-h-0 min-w-0 flex-1 overflow-hidden"
          @dragover.prevent
          @drop.prevent.stop="onFieldDrop"
        >
          <div ref="sheetHostRef" class="h-full w-full" />

          <div
            v-if="isLoading"
            class="absolute inset-0 z-50 flex flex-col items-center justify-center gap-10 bg-container/80"
          >
            <a-spin />
            <span class="text-xs text-secondary">
              {{ previewMode ? '正在更新预览…' : '正在加载表格引擎…' }}
            </span>
          </div>

          <div
            v-if="univerError"
            class="absolute inset-0 z-40 flex items-center justify-center bg-container"
          >
            <a-result
              status="error"
              title="表格引擎加载失败"
              :sub-title="univerError"
            />
          </div>
        </div>

        <RightPanel
          v-if="!previewMode && sheetInfo"
          :datasets="datasets"
          :region-sync-degraded="regionSyncDegraded"
          :regions="regions"
          :selected-region-id="selectedRegionId"
          :sheet="sheetInfo"
          @remove-region="onRemoveRegion"
          @rename-sheet="renameSheet"
          @select-region="selectedRegionId = $event"
          @set-freeze="setFreeze"
          @set-sheet-size="setSheetSize"
          @update-region="updateRegion"
        />
      </div>
    </div>

    <DatasetModal
      v-model:open="datasetModalOpen"
      @create-json="({ name, json }) => addDatasetFromJson(name, json)"
      @create-rest="({ name, url }) => addDatasetFromRest(name, url)"
    />

    <SchemaModal
      v-model:open="schemaModalOpen"
      :value="schemaText"
      @apply="onImportSchema"
      @download="exportSchema"
    />

    <a-modal
      v-model:open="validationOpen"
      :footer="null"
      :width="680"
      title="发布校验"
    >
      <div class="max-h-[60vh] overflow-y-auto">
        <template v-if="validationResult">
          <template v-if="validationResult.errors.length">
            <h3 class="mb-8 mt-0 text-sm text-error">阻塞问题</h3>
            <ul class="mb-14 mt-0 grid gap-5 pl-16 text-xs text-secondary">
              <li v-for="item in validationResult.errors" :key="item">
                {{ item }}
              </li>
            </ul>
          </template>
          <template v-if="validationResult.warnings.length">
            <h3 class="mb-8 mt-0 text-sm text-warning">警告</h3>
            <ul class="m-0 grid gap-5 pl-16 text-xs text-secondary">
              <li v-for="item in validationResult.warnings" :key="item">
                {{ item }}
              </li>
            </ul>
          </template>
        </template>
        <a-empty v-else description="没有发现阻塞问题" />
      </div>
    </a-modal>
  </WView>
</template>

<script setup lang="ts">
import { message, Modal } from 'antdv-next'
import { useEventListener } from '@vueuse/core'
import { Icon } from '@/components/icon'
import { useReportDesigner } from './hooks'
import { DatasetModal, LeftPanel, RightPanel, SchemaModal } from './components'
import type { ValidationResult } from './types'

const {
  addDatasetFromJson,
  addDatasetFromRest,
  addParameter,
  attach,
  autosaveState,
  createRegionFromSelection,
  datasets,
  deleteColumnAtSelection,
  deleteRowAtSelection,
  dispose,
  exportCsv,
  exportHtml,
  exportSchema,
  exportXls,
  getSchemaText,
  importSchema,
  insertColumnAtSelection,
  insertField,
  insertRowAtSelection,
  isLoading,
  loadSample,
  newDocument,
  parameterValues,
  parameters,
  previewMode,
  previewResult,
  printSheet,
  publish,
  regionSyncDegraded,
  regions,
  removeDataset,
  removeParameter,
  removeRegion,
  renameSheet,
  renameWorkbook,
  saveDraft,
  setFreeze,
  setParameterValue,
  setSheetSize,
  sheetInfo,
  togglePreview,
  univerError,
  updateParameter,
  updateRegion,
  workbookName,
  activeSheetId,
} = useReportDesigner()

const sheetHostRef = useTemplateRef<HTMLDivElement>('sheetHostRef')
const datasetModalOpen = shallowRef(false)
const schemaModalOpen = shallowRef(false)
const schemaText = shallowRef('')
const validationOpen = shallowRef(false)
const validationResult = shallowRef<ValidationResult>()
const selectedRegionId = shallowRef<string>()

const structuralItems = [
  { key: 'insert-row', label: '插入行' },
  { key: 'delete-row', label: '删除行' },
  { key: 'insert-column', label: '插入列' },
  { key: 'delete-column', label: '删除列' },
]

const exportItems = [
  { key: 'export-csv', label: '导出 CSV' },
  { key: 'export-html', label: '导出 HTML' },
  { key: 'export-xls', label: '导出 Excel 兼容 XML (.xls)' },
]

watch(activeSheetId, () => {
  selectedRegionId.value = undefined
})

onMounted(() => {
  if (sheetHostRef.value) void attach(sheetHostRef.value)
})

onBeforeUnmount(() => {
  dispose()
})

useEventListener(window, 'keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
    event.preventDefault()
    if (!previewMode.value) saveDraft()
  }
})

function onRenameWorkbook(event: Event) {
  const name = (event.target as HTMLInputElement).value.trim()
  if (!name || name === workbookName.value) return
  renameWorkbook(name)
}

function onInsertField(payload: { datasetId: string; fieldKey: string }) {
  insertField(payload.datasetId, payload.fieldKey)
}

function onFieldDrop(event: DragEvent) {
  if (previewMode.value) return
  const raw = event.dataTransfer?.getData('application/x-report-field')
  if (!raw) return
  try {
    const payload = JSON.parse(raw) as {
      datasetId: string
      fieldKey: string
    }
    insertField(payload.datasetId, payload.fieldKey)
  } catch {
    message.error('无法识别拖拽的字段')
  }
}

function onRemoveDataset(id: string) {
  const dataset = datasets.value.find((item) => item.id === id)
  if (!dataset) return
  Modal.confirm({
    title: '删除数据集',
    content: `确定删除「${dataset.name}」吗？引用该数据集的数据区域也会被移除。`,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => removeDataset(id),
  })
}

function onCreateRegion(datasetId: string) {
  const region = createRegionFromSelection(datasetId)
  if (region) selectedRegionId.value = region.id
}

function onRemoveRegion(id: string) {
  removeRegion(id)
  if (selectedRegionId.value === id) selectedRegionId.value = undefined
}

function onPublish() {
  const result = publish()
  if (result.valid) return
  validationResult.value = result
  validationOpen.value = true
}

function openSchema() {
  schemaText.value = getSchemaText()
  schemaModalOpen.value = true
}

function onImportSchema(json: string) {
  if (importSchema(json)) schemaModalOpen.value = false
}

function onStructuralMenu({ key }: { key: string | number }) {
  if (String(key) === 'insert-row') insertRowAtSelection()
  if (String(key) === 'delete-row') deleteRowAtSelection()
  if (String(key) === 'insert-column') insertColumnAtSelection()
  if (String(key) === 'delete-column') deleteColumnAtSelection()
}

function onExportMenu({ key }: { key: string | number }) {
  if (String(key) === 'export-csv') exportCsv()
  if (String(key) === 'export-html') exportHtml()
  if (String(key) === 'export-xls') exportXls()
}
</script>
