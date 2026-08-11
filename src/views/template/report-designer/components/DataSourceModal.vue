<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { defaultDataSourceConfig } from '../data'
import type {
  DataSourceConfig,
  DataSourceKind,
  RequestMethod,
  SqlDriver,
} from '../types'

type SourceModalMode = 'create' | 'edit'

const props = defineProps<{
  config: DataSourceConfig
  mode: SourceModalMode
  open: boolean
}>()

const emit = defineEmits<{
  save: [config: DataSourceConfig]
  'update:open': [open: boolean]
}>()

const draftConfig = reactive<DataSourceConfig>(
  cloneConfig(defaultDataSourceConfig)
)

const sourceOptions = [
  { label: '样例数据', value: 'sample' },
  { label: '接口', value: 'rest' },
  { label: 'JSON', value: 'json' },
  { label: 'SQL', value: 'sql' },
]

const methodOptions = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'PATCH', value: 'PATCH' },
]

const driverOptions = [
  { label: 'MySQL', value: 'mysql' },
  { label: 'PostgreSQL', value: 'postgresql' },
  { label: 'SQL Server', value: 'sqlserver' },
  { label: 'Oracle', value: 'oracle' },
  { label: '自定义', value: 'custom' },
]

const modalTitle = computed(() =>
  props.mode === 'create' ? '新增数据源' : '编辑数据源'
)

function cloneConfig(config: Partial<DataSourceConfig>) {
  return { ...defaultDataSourceConfig, ...config }
}

watch(
  () => props.open,
  (open) => {
    if (!open) return
    Object.assign(draftConfig, cloneConfig(props.config))
  },
  { immediate: true }
)

function updateKind(value: string) {
  draftConfig.kind = value as DataSourceKind
}

function updateMethod(value: string) {
  draftConfig.method = value as RequestMethod
}

function updateDriver(value: string) {
  draftConfig.sqlDriver = value as SqlDriver
}

function saveConfig() {
  emit('save', cloneConfig(draftConfig))
  emit('update:open', false)
}
</script>

<template>
  <a-modal
    :open="open"
    :width="880"
    cancel-text="取消"
    class="report-source-modal"
    destroy-on-hidden
    ok-text="保存"
    :title="modalTitle"
    @cancel="emit('update:open', false)"
    @ok="saveConfig"
    @update:open="emit('update:open', $event)"
  >
    <div class="report-source-modal__content">
      <header class="report-source-modal__head">
        <div>
          <span>{{ props.mode === 'create' ? 'Create' : 'Edit' }}</span>
          <strong>{{ draftConfig.name || '未命名数据源' }}</strong>
        </div>
        <a-segmented
          :options="sourceOptions"
          :value="draftConfig.kind"
          @change="updateKind(String($event))"
        />
      </header>

      <label class="source-field">
        <span>数据源名称</span>
        <a-input
          v-model:value="draftConfig.name"
          allow-clear
          placeholder="销售订单数据源"
        />
      </label>

      <section v-if="draftConfig.kind === 'sample'" class="source-config-block">
        <div class="source-config-block__hero">
          <Icon name="i-lucide:database-zap" :size="22" />
          <div>
            <strong>样例数据</strong>
            <span>内置订单明细，适合快速预览字段、映射、格式化和导出。</span>
          </div>
        </div>
      </section>

      <section v-if="draftConfig.kind === 'rest'" class="source-config-block">
        <label class="source-field">
          <span>接口地址</span>
          <a-input
            v-model:value="draftConfig.endpoint"
            placeholder="/api/orders"
          />
        </label>

        <div class="source-config-grid">
          <label class="source-field">
            <span>方法</span>
            <a-select
              :options="methodOptions"
              :value="draftConfig.method"
              @update:value="updateMethod(String($event))"
            />
          </label>
          <label class="source-field">
            <span>数组路径</span>
            <a-input
              v-model:value="draftConfig.dataPath"
              placeholder="data.list"
            />
          </label>
        </div>

        <label class="source-field">
          <span>Query 参数</span>
          <a-textarea
            v-model:value="draftConfig.queryParams"
            :auto-size="{ minRows: 2, maxRows: 4 }"
            placeholder="status=done&#10;pageSize=100"
          />
        </label>

        <label class="source-field">
          <span>请求头</span>
          <a-textarea
            v-model:value="draftConfig.headers"
            :auto-size="{ minRows: 2, maxRows: 4 }"
            placeholder="Authorization: Bearer token"
          />
        </label>

        <label v-if="draftConfig.method !== 'GET'" class="source-field">
          <span>请求体</span>
          <a-textarea
            v-model:value="draftConfig.body"
            :auto-size="{ minRows: 3, maxRows: 6 }"
            placeholder='{"status":"done"}'
          />
        </label>
      </section>

      <section v-if="draftConfig.kind === 'json'" class="source-config-block">
        <label class="source-field">
          <span>数组路径</span>
          <a-input v-model:value="draftConfig.dataPath" placeholder="data" />
        </label>
        <label class="source-field">
          <span>JSON 数据</span>
          <a-textarea
            v-model:value="draftConfig.rawJson"
            :auto-size="{ minRows: 8, maxRows: 12 }"
            placeholder='[{"name":"demo","amount":100}]'
          />
        </label>
      </section>

      <section v-if="draftConfig.kind === 'sql'" class="source-config-block">
        <div class="source-config-grid source-config-grid--three">
          <label class="source-field">
            <span>数据库类型</span>
            <a-select
              :options="driverOptions"
              :value="draftConfig.sqlDriver"
              @update:value="updateDriver(String($event))"
            />
          </label>
          <label class="source-field">
            <span>数据库地址</span>
            <a-input
              v-model:value="draftConfig.sqlHost"
              placeholder="127.0.0.1"
            />
          </label>
          <label class="source-field">
            <span>端口</span>
            <a-input v-model:value="draftConfig.sqlPort" placeholder="3306" />
          </label>
        </div>

        <div class="source-config-grid">
          <label class="source-field">
            <span>数据库名</span>
            <a-input
              v-model:value="draftConfig.sqlDatabase"
              placeholder="wuhu_report"
            />
          </label>
          <label class="source-field">
            <span>用户名</span>
            <a-input
              v-model:value="draftConfig.sqlUsername"
              placeholder="report_user"
            />
          </label>
        </div>

        <label class="source-field">
          <span>密码</span>
          <a-input
            v-model:value="draftConfig.sqlPassword"
            placeholder="******"
            type="password"
          />
        </label>

        <label class="source-field">
          <span>SQL 语句</span>
          <a-textarea
            v-model:value="draftConfig.sqlText"
            :auto-size="{ minRows: 7, maxRows: 12 }"
            placeholder="select * from orders"
          />
        </label>
      </section>
    </div>
  </a-modal>
</template>

<style scoped lang="less">
.report-source-modal__content {
  display: grid;
  gap: 14px;
  min-height: 0;
  max-height: 72vh;
  overflow: auto;
}

.report-source-modal__head {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
  padding: 12px;
  background: rgb(var(--w-bg-page));
  border: 1px solid rgb(var(--w-border-color-1));
  border-radius: 8px;
}

.report-source-modal__head div {
  min-width: 0;
}

.report-source-modal__head span {
  display: block;
  font-size: 12px;
  font-weight: 800;
  color: #0f766e;
}

.report-source-modal__head strong {
  display: block;
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 15px;
  color: rgb(var(--w-text-color));
  white-space: nowrap;
}

.source-config-block {
  display: grid;
  gap: 12px;
  padding: 12px;
  background: rgb(var(--w-bg-page));
  border: 1px solid rgb(var(--w-border-color-1));
  border-radius: 8px;
}

.source-config-block__hero {
  display: flex;
  gap: 10px;
  align-items: center;
  min-width: 0;
}

.source-config-block__hero > span {
  flex: none;
  color: #0f766e;
}

.source-config-block__hero div {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.source-config-block__hero strong {
  font-size: 14px;
  color: rgb(var(--w-text-color));
}

.source-config-block__hero span {
  font-size: 12px;
  line-height: 1.5;
  color: rgb(var(--w-text-color-3));
}

.source-config-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.source-config-grid--three {
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr) minmax(96px, 0.5fr);
}

.source-field {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.source-field span {
  font-size: 12px;
  font-weight: 800;
  color: rgb(var(--w-text-color-2));
}

@media (width <= 768px) {
  .report-source-modal__head,
  .source-config-grid,
  .source-config-grid--three {
    grid-template-columns: 1fr;
  }

  .report-source-modal__head {
    display: grid;
  }
}
</style>
