<script setup lang="ts">
import { computed } from 'vue'
import type {
  DataSourceConfig,
  DataSourceKind,
  ReportDataSourceItem,
} from '../types'

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
  createSource: []
  deleteSource: [id: string]
  editSource: []
  loadSource: []
  openTemplateSettings: []
  selectSource: [id: string]
}>()

const sourceOptions = computed(() => {
  return props.dataSources.map((source) => ({
    label: `${source.name} · ${getSourceKindLabel(source.kind)}`,
    value: source.id,
  }))
})

const canDeleteActiveSource = computed(() => {
  return (
    !!props.activeSourceId &&
    props.activeSourceId !== defaultSourceId &&
    props.dataSources.length > 1
  )
})

const sourceMeta = computed(() => {
  if (props.config.kind === 'rest') {
    return {
      icon: 'i-lucide:cloud',
      label: props.config.endpoint || '未配置接口地址',
    }
  }

  if (props.config.kind === 'json') {
    return {
      icon: 'i-lucide:braces',
      label: props.config.dataPath
        ? `JSON · ${props.config.dataPath}`
        : 'JSON 数据',
    }
  }

  if (props.config.kind === 'sql') {
    return {
      icon: 'i-lucide:database',
      label: `${props.config.sqlDriver.toUpperCase()} · ${props.config.sqlDatabase || '未配置数据库'}`,
    }
  }

  return {
    icon: 'i-lucide:database-zap',
    label: '内置订单样例',
  }
})

const loadButtonText = computed(() => {
  if (props.config.kind === 'rest') return '加载接口'
  if (props.config.kind === 'json') return '解析 JSON'
  if (props.config.kind === 'sql') return '校验 SQL'
  return '加载样例'
})

function getSourceKindLabel(kind: DataSourceKind) {
  if (kind === 'rest') return '接口'
  if (kind === 'json') return 'JSON'
  if (kind === 'sql') return 'SQL'
  return '样例'
}
</script>

<template>
  <section
    class="report-canvas-stage grid h-full min-h-0 grid-rows-[auto_auto_minmax(0,1fr)_auto] overflow-hidden rounded-8px border-1 border-color-2 border-solid bg-container"
  >
    <header
      class="flex min-h-52px flex-wrap items-center gap-10px border-b-1 border-b-solid border-color-2 px-12px py-8px"
    >
      <div class="grid min-w-220px flex-1 gap-4px">
        <span class="text-11px text-tertiary font-800 uppercase"
          >Data Source</span
        >
        <div class="flex min-w-0 items-center gap-8px">
          <Icon :name="sourceMeta.icon" :size="16" class="shrink-0 text-info" />
          <strong class="truncate text-13px text-primary">
            {{ config.name || '未命名数据源' }}
          </strong>
          <span class="truncate text-12px text-tertiary">
            {{ sourceMeta.label }}
          </span>
        </div>
      </div>

      <a-select
        class="w-250px max-w-full"
        :options="sourceOptions"
        :value="activeSourceId"
        placeholder="选择数据源"
        @update:value="emit('selectSource', String($event))"
      />

      <a-button :loading="isLoading" type="primary" @click="emit('loadSource')">
        <template #icon>
          <Icon name="i-lucide:play" />
        </template>
        {{ loadButtonText }}
      </a-button>

      <a-button @click="emit('createSource')">
        <template #icon>
          <Icon name="i-lucide:plus" />
        </template>
        数据源
      </a-button>

      <a-tooltip title="编辑当前数据源">
        <a-button @click="emit('editSource')">
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
          <a-button :disabled="!canDeleteActiveSource" danger>
            <template #icon>
              <Icon name="i-lucide:trash-2" />
            </template>
          </a-button>
        </a-tooltip>
      </a-popconfirm>

      <a-button class="ml-auto" @click="emit('openTemplateSettings')">
        <template #icon>
          <Icon name="i-lucide:settings-2" />
        </template>
        模板设置
      </a-button>
    </header>

    <p
      v-if="loadError"
      class="mx-12px mt-10px flex items-center gap-6px rounded-6px border-1 border-error border-solid bg-container-secondary px-10px py-7px text-12px text-error"
    >
      <Icon name="i-lucide:circle-alert" :size="14" />
      {{ loadError }}
    </p>

    <div
      class="min-h-0 overflow-hidden p-12px"
      :class="{ 'pt-10px': loadError }"
    >
      <slot />
    </div>

    <footer
      class="hidden border-t-1 border-t-solid border-color-2 px-12px py-8px text-12px text-tertiary lg:flex lg:items-center lg:justify-between"
    >
      <span>{{ rowCount.toLocaleString('zh-CN') }} 行数据</span>
      <span>{{ fieldCount.toLocaleString('zh-CN') }} 个字段</span>
    </footer>
  </section>
</template>
