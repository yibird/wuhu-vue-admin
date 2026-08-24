<script setup lang="ts">
import { defaultDataSourceConfig } from '../data'
import DataSourceModal from './DataSourceModal.vue'
import type {
  DataSourceConfig,
  DataSourceKind,
  ReportDataSourceItem,
} from '../types'

type SourceModalMode = 'create' | 'edit'

const defaultSourceId = 'sample-orders'

const props = defineProps<{
  activeSourceId: string
  config: DataSourceConfig
  dataSources: ReportDataSourceItem[]
  fieldCount: number
  isLoading: boolean
  loadError: string
  rowCount: number
}>()

const emit = defineEmits<{
  deleteSource: [id: string]
  loadSource: []
  saveSource: [payload: { config: DataSourceConfig; id?: string }]
  selectSource: [id: string]
}>()

const sourceModalOpen = shallowRef(false)
const sourceModalMode = shallowRef<SourceModalMode>('create')
const editingSourceId = shallowRef<string>()
const modalConfig = shallowRef<DataSourceConfig>(
  createSourceConfig({ kind: 'rest', name: '' })
)

const sourceOptions = computed(() => {
  return props.dataSources.map((source) => ({
    label: `${source.name} · ${getSourceKindLabel(source.kind)}`,
    value: source.id,
  }))
})

const activeSource = computed(() => {
  return props.dataSources.find((source) => source.id === props.activeSourceId)
})

const sourceMeta = computed(() => {
  if (props.config.kind === 'rest') {
    return {
      detail: props.config.endpoint || '未配置接口地址',
      icon: 'i-lucide:cloud',
      label: '接口',
    }
  }

  if (props.config.kind === 'json') {
    return {
      detail: props.config.dataPath
        ? `数组路径：${props.config.dataPath}`
        : 'JSON 数据',
      icon: 'i-lucide:braces',
      label: 'JSON',
    }
  }

  if (props.config.kind === 'sql') {
    const database = props.config.sqlDatabase || '未配置数据库'
    const host = props.config.sqlHost || '未配置地址'
    return {
      detail: `${props.config.sqlDriver.toUpperCase()} · ${host} · ${database}`,
      icon: 'i-lucide:database',
      label: 'SQL',
    }
  }

  return {
    detail: '内置订单样例',
    icon: 'i-lucide:database-zap',
    label: '样例数据',
  }
})

const loadButtonText = computed(() => {
  if (props.config.kind === 'rest') return '加载接口数据'
  if (props.config.kind === 'json') return '解析 JSON 数据'
  if (props.config.kind === 'sql') return '校验 SQL 配置'
  return '加载样例数据'
})

const canDeleteActiveSource = computed(() => {
  return (
    !!props.activeSourceId &&
    props.activeSourceId !== defaultSourceId &&
    props.dataSources.length > 1
  )
})

function getSourceKindLabel(kind: DataSourceKind) {
  if (kind === 'rest') return '接口'
  if (kind === 'json') return 'JSON'
  if (kind === 'sql') return 'SQL'
  return '样例'
}

function createSourceConfig(patch: Partial<DataSourceConfig> = {}) {
  return {
    ...defaultDataSourceConfig,
    ...patch,
  }
}

function cloneConfig(config: DataSourceConfig) {
  return createSourceConfig(config)
}

function openCreateSource() {
  editingSourceId.value = undefined
  sourceModalMode.value = 'create'
  modalConfig.value = createSourceConfig({
    kind: 'rest',
    name: '',
  })
  sourceModalOpen.value = true
}

function openEditSource() {
  editingSourceId.value = props.activeSourceId
  sourceModalMode.value = 'edit'
  modalConfig.value = cloneConfig(props.config)
  sourceModalOpen.value = true
}

function saveSource(config: DataSourceConfig) {
  emit('saveSource', {
    config,
    id: sourceModalMode.value === 'edit' ? editingSourceId.value : undefined,
  })
}
</script>

<template>
  <section class="source-panel">
    <div class="source-panel__head">
      <Icon name="i-lucide:plug-zap" :size="18" />
      <h2>数据源</h2>
    </div>

    <div class="source-panel__body">
      <section class="source-library">
        <div class="source-library__title">
          <span>选择数据源</span>
          <a-button size="small" type="primary" @click="openCreateSource">
            <template #icon>
              <Icon name="i-lucide:plus" />
            </template>
            新增
          </a-button>
        </div>
        <a-select
          :options="sourceOptions"
          :value="activeSourceId"
          placeholder="选择已有数据源"
          @update:value="emit('selectSource', String($event))"
        />
      </section>

      <article class="source-summary">
        <div class="source-summary__icon">
          <Icon :name="sourceMeta.icon" :size="22" />
        </div>
        <div class="source-summary__content">
          <span>{{ sourceMeta.label }}</span>
          <strong>{{
            config.name || activeSource?.name || '未命名数据源'
          }}</strong>
          <p>{{ sourceMeta.detail }}</p>
        </div>
        <div class="source-summary__actions">
          <a-tooltip title="编辑当前数据源">
            <a-button size="small" @click="openEditSource">
              <template #icon>
                <Icon name="i-lucide:pencil" />
              </template>
            </a-button>
          </a-tooltip>
          <a-popconfirm
            cancel-text="取消"
            ok-text="删除"
            title="确认删除该数据源？"
            @confirm="emit('deleteSource', activeSourceId)"
          >
            <a-tooltip title="删除当前数据源">
              <a-button :disabled="!canDeleteActiveSource" danger size="small">
                <template #icon>
                  <Icon name="i-lucide:trash-2" />
                </template>
              </a-button>
            </a-tooltip>
          </a-popconfirm>
        </div>
      </article>

      <a-button
        block
        :loading="isLoading"
        type="primary"
        @click="emit('loadSource')"
      >
        <template #icon>
          <Icon name="i-lucide:play" />
        </template>
        {{ loadButtonText }}
      </a-button>

      <p v-if="loadError" class="source-panel__error">
        <Icon name="i-lucide:circle-alert" :size="14" />
        {{ loadError }}
      </p>
    </div>

    <div class="source-panel__stats">
      <div>
        <span>行数</span>
        <strong>{{ rowCount.toLocaleString('zh-CN') }}</strong>
      </div>
      <div>
        <span>字段</span>
        <strong>{{ fieldCount.toLocaleString('zh-CN') }}</strong>
      </div>
    </div>

    <DataSourceModal
      v-model:open="sourceModalOpen"
      :config="modalConfig"
      :mode="sourceModalMode"
      @save="saveSource"
    />
  </section>
</template>

<style scoped lang="less">
.source-panel {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  min-height: 0;
  overflow: hidden;
  background: rgb(var(--w-bg-container));
  border: 1px solid rgb(var(--w-border-color-2));
  border-radius: 8px;
}

.source-panel__head {
  display: flex;
  gap: 8px;
  align-items: center;
  min-height: 44px;
  padding: 0 12px;
  color: #0f766e;
  border-bottom: 1px solid rgb(var(--w-border-color-1));
}

.source-panel__head h2 {
  margin: 0;
  font-size: 15px;
  color: rgb(var(--w-text-color));
}

.source-panel__body {
  display: grid;
  gap: 12px;
  align-content: start;
  min-height: 0;
  padding: 12px;
  overflow: auto;
}

.source-library {
  display: grid;
  gap: 8px;
  min-width: 0;
}

.source-library__title {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
}

.source-library__title span {
  font-size: 12px;
  font-weight: 800;
  color: rgb(var(--w-text-color-2));
}

.source-summary {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 10px;
  min-width: 0;
  padding: 12px;
  background: rgb(var(--w-bg-page));
  border: 1px solid rgb(var(--w-border-color-1));
  border-radius: 8px;
}

.source-summary__icon {
  display: inline-grid;
  place-items: center;
  width: 40px;
  height: 40px;
  color: #0f766e;
  background: rgb(20 184 166 / 10%);
  border: 1px solid rgb(20 184 166 / 18%);
  border-radius: 8px;
}

.source-summary__content {
  min-width: 0;
}

.source-summary__content span {
  display: block;
  font-size: 12px;
  font-weight: 800;
  color: #0f766e;
}

.source-summary__content strong {
  display: block;
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  color: rgb(var(--w-text-color));
  white-space: nowrap;
}

.source-summary__content p {
  margin: 6px 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  line-height: 1.5;
  color: rgb(var(--w-text-color-3));
  white-space: nowrap;
}

.source-summary__actions {
  display: inline-flex;
  gap: 4px;
  align-items: start;
}

.source-panel__error {
  display: flex;
  gap: 6px;
  align-items: flex-start;
  padding: 8px;
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: #b91c1c;
  background: rgb(239 68 68 / 9%);
  border: 1px solid rgb(239 68 68 / 18%);
  border-radius: 8px;
}

.source-panel__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  padding: 12px;
  border-top: 1px solid rgb(var(--w-border-color-1));
}

.source-panel__stats div {
  min-width: 0;
  padding: 10px;
  background: rgb(var(--w-bg-page));
  border-radius: 8px;
}

.source-panel__stats span {
  display: block;
  font-size: 12px;
  color: rgb(var(--w-text-color-3));
}

.source-panel__stats strong {
  display: block;
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 18px;
  line-height: 1.2;
  color: rgb(var(--w-text-color));
  white-space: nowrap;
}

@media (width <= 640px) {
  .source-summary {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .source-summary__actions {
    grid-column: 1 / -1;
  }
}
</style>
