<template>
  <a-drawer
    v-model:open="open"
    :size="drawerSize"
    closable
    destroy-on-hidden
    placement="right"
  >
    <template #title>
      <div class="min-w-0 flex items-center gap-10">
        <span
          class="size-32 flex flex-none items-center justify-center rounded-8 bg-primary-tint text-primary"
        >
          <Icon name="i-lucide:scroll-text" :size="17" />
        </span>
        <div class="min-w-0">
          <div class="truncate text-sm text-main font-600">{{ title }}</div>
          <div class="mt-2 truncate text-xs text-secondary">
            日志为服务端留存的只读记录
          </div>
        </div>
      </div>
    </template>

    <a-spin :spinning="loading">
      <div class="flex flex-col gap-20">
        <section v-if="fields.length > 0">
          <h4 class="mb-10 mt-0 text-sm text-main font-600">基本信息</h4>
          <a-descriptions bordered :column="2" size="small">
            <a-descriptions-item
              v-for="field in fields"
              :key="field.label"
              :label="field.label"
              :span="field.span ?? 1"
            >
              {{ formatValue(field.value) }}
            </a-descriptions-item>
          </a-descriptions>
        </section>

        <section v-for="group in groups" :key="group.title">
          <h4 class="mb-10 mt-0 text-sm text-main font-600">
            {{ group.title }}
          </h4>
          <a-tabs v-if="group.tabs.length > 1" animated type="segment">
            <a-tab-pane
              v-for="tab in group.tabs"
              :key="tab.key"
              :tab="tab.label"
            >
              <JsonView :data="tab.data" :height="jsonHeight" />
            </a-tab-pane>
          </a-tabs>
          <JsonView
            v-else-if="group.tabs[0]"
            :data="group.tabs[0].data"
            :height="jsonHeight"
          />
        </section>

        <div v-if="fields.length === 0 && groups.length === 0" class="py-40">
          <a-empty description="暂无日志详情" />
        </div>
      </div>
    </a-spin>
  </a-drawer>
</template>

<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { Icon, JsonView } from '@/components'
import type { LogDetailField, LogDetailGroup } from './types'

interface Props {
  /**
   * @desc 抽屉标题
   * @default '日志详情'
   */
  title?: string
  /**
   * @desc 详情是否加载中
   * @default false
   */
  loading?: boolean
  /**
   * @desc 基本信息字段
   */
  fields?: LogDetailField[]
  /**
   * @desc JSON 分块分组
   */
  groups?: LogDetailGroup[]
  /**
   * @desc JSON 区块高度
   * @default 260
   */
  jsonHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '日志详情',
  loading: false,
  fields: () => [],
  groups: () => [],
  jsonHeight: 260,
})

const open = defineModel<boolean>('open', { required: true })

const isNarrowScreen = useMediaQuery('(max-width: 768px)')
const drawerSize = computed(() => (isNarrowScreen.value ? '100%' : 760))

function formatValue(value: LogDetailField['value']) {
  return value === undefined || value === null || value === '' ? '-' : value
}
</script>
