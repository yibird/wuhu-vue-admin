<script setup lang="ts">
import { useDesignerNodeClasses } from '../../composables/useNodeClasses'
import type { DesignerNode } from '../../types'

const props = defineProps<{
  node: DesignerNode
}>()

const statItems = ['转化率', '有效客户', '成交金额', '自动化任务']
const formFields = ['客户名称', '来源渠道', '预计预算', '跟进人']
const tableRows = ['需求评审', '合同审批', '交付排期']
const chartBars = [40, 74, 55, 92, 68, 108, 86, 124]

function getStringProp(key: string, fallback: string) {
  const value = (props.node.props as Record<string, unknown>)[key]
  return typeof value === 'string' ? value : fallback
}

function getStringArrayProp(key: string, fallback: string[]) {
  const value = (props.node.props as Record<string, unknown>)[key]
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
    ? value
    : fallback
}

function getNumberArrayProp(key: string, fallback: number[]) {
  const value = (props.node.props as Record<string, unknown>)[key]
  return Array.isArray(value) && value.every((item) => typeof item === 'number')
    ? value
    : fallback
}

function getNumberProp(key: string, fallback: number) {
  const value = (props.node.props as Record<string, unknown>)[key]
  return typeof value === 'number' ? value : fallback
}

function getFlexPreviewStyle(): Record<string, string> {
  const direction = getStringProp('direction', 'row')
  const justify = getStringProp('justify', 'start')
  const align = getStringProp('align', 'stretch')
  const justifyMap: Record<string, string> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
  }
  const alignMap: Record<string, string> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
  }
  return {
    'align-items': alignMap[align] ?? 'stretch',
    'flex-direction': direction === 'column' ? 'column' : 'row',
    gap: `${getNumberProp('gap', 12)}px`,
    'justify-content': justifyMap[justify] ?? 'flex-start',
  }
}

const {
  getChartBarClass,
  getToneButtonClass,
  getTonePillClass,
  getToneSurfaceClass,
  getToneTextClass,
} = useDesignerNodeClasses()
</script>

<template>
  <template v-if="node.type === 'flex'">
    <div>
      <div class="mb-10 flex items-start justify-between gap-8">
        <div class="min-w-0">
          <h3 class="m-0 text-base text-main font-700">{{ node.title }}</h3>
          <p class="m-0 mt-4 text-xs text-secondary">{{ node.description }}</p>
        </div>
        <span
          class="shrink-0 inline-flex items-center gap-4 rounded-full bg-primary-tint px-8 py-2 text-11px text-primary"
        >
          <Icon name="i-lucide:panel-top-open" :size="12" />
          容器
        </span>
      </div>
      <div
        class="low-code-flex-preview min-h-86 flex items-center justify-center rounded-8 border-1 border-dashed border-color-2 bg-page p-10"
        :style="getFlexPreviewStyle()"
      >
        <div
          class="min-w-0 flex-1 rounded-6 bg-fill"
          style="min-height: 28px"
        />
        <div
          class="min-w-0 flex-1 rounded-6 bg-fill-tertiary"
          style="min-height: 28px"
        />
      </div>
      <div class="mt-6 text-center text-11px text-placeholder">
        子组件将按弹性布局排列
      </div>
    </div>
  </template>

  <template v-else-if="node.type === 'hero'">
    <div class="grid gap-12 md:grid-cols-[minmax(0,1fr)_220px] md:items-center">
      <div>
        <div
          :class="[
            'mb-8 inline-flex rounded-full px-10 py-4 text-xs',
            getTonePillClass(node),
          ]"
        >
          {{ getStringProp('badge', 'Low Code Workspace') }}
        </div>
        <h2 class="m-0 text-26px text-main font-800 leading-34px">
          {{ node.title }}
        </h2>
        <p class="m-0 mt-8 text-sm text-regular leading-22px">
          {{ node.description }}
        </p>
      </div>
      <div class="grid gap-8 rounded-8 bg-page p-12">
        <div class="h-8 w-3/5 rounded-full bg-primary" />
        <div class="h-8 rounded-full bg-fill-tertiary" />
        <div class="h-8 w-4/5 rounded-full bg-fill-tertiary" />
        <button
          :class="[
            'mt-4 h-30 rounded-6 border-0 text-white',
            getToneButtonClass(node),
          ]"
        >
          {{ getStringProp('buttonText', 'Launch') }}
        </button>
      </div>
    </div>
  </template>

  <template v-else-if="node.type === 'stats'">
    <div>
      <div class="mb-10">
        <h3 class="m-0 text-base text-main font-700">{{ node.title }}</h3>
        <p class="m-0 mt-4 text-xs text-secondary">{{ node.description }}</p>
      </div>
      <div class="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="(item, itemIndex) in getStringArrayProp('items', statItems)"
          :key="item"
          class="rounded-8 bg-page p-10"
        >
          <div class="text-xs text-secondary">{{ item }}</div>
          <div class="mt-6 text-20px text-main font-800">
            {{ itemIndex === 2 ? '¥86.4w' : `${(itemIndex + 2) * 18}%` }}
          </div>
          <div class="mt-4 text-11px text-success">+{{ itemIndex + 8 }}.2%</div>
        </div>
      </div>
    </div>
  </template>

  <template v-else-if="node.type === 'form'">
    <div>
      <h3 class="m-0 text-base text-main font-700">{{ node.title }}</h3>
      <p class="m-0 mt-4 text-xs text-secondary">{{ node.description }}</p>
      <div class="mt-12 grid gap-8 sm:grid-cols-2">
        <label
          v-for="item in getStringArrayProp('fields', formFields)"
          :key="item"
          class="grid gap-5"
        >
          <span class="text-xs text-muted">{{ item }}</span>
          <span
            class="h-34 rounded-6 border-1 border-color-2 border-solid bg-main"
          />
        </label>
      </div>
    </div>
  </template>

  <template v-else-if="node.type === 'table'">
    <div>
      <h3 class="m-0 text-base text-main font-700">{{ node.title }}</h3>
      <p class="m-0 mt-4 text-xs text-secondary">{{ node.description }}</p>
      <div
        class="mt-12 overflow-hidden rounded-8 border-1 border-color-2 border-solid"
      >
        <div
          v-for="(row, rowIndex) in getStringArrayProp('rows', tableRows)"
          :key="row"
          class="grid grid-cols-[minmax(0,1fr)_80px_70px] items-center gap-8 border-0 border-b-1 border-color-2 border-b-solid px-10 py-9 last:border-b-0"
        >
          <span class="truncate text-sm text-main">{{ row }}</span>
          <span class="text-xs text-secondary">Owner {{ rowIndex + 1 }}</span>
          <span
            class="rounded-full bg-selected px-8 py-3 text-center text-11px text-primary"
          >
            进行中
          </span>
        </div>
      </div>
    </div>
  </template>

  <template v-else-if="node.type === 'chart'">
    <div>
      <h3 class="m-0 text-base text-main font-700">{{ node.title }}</h3>
      <p class="m-0 mt-4 text-xs text-secondary">{{ node.description }}</p>
      <div class="mt-14 flex h-150 items-end gap-8 rounded-8 bg-page p-12">
        <div
          v-for="(height, barIndex) in getNumberArrayProp('bars', chartBars)"
          :key="barIndex"
          :class="['flex-1 rounded-t-6', getChartBarClass(node, barIndex)]"
          :style="{ height: `${height}px` }"
        />
      </div>
    </div>
  </template>

  <template v-else>
    <div
      :class="[
        'flex items-start gap-10 rounded-8 p-12',
        getToneSurfaceClass(node),
      ]"
    >
      <Icon
        :name="getStringProp('icon', 'i-lucide:bell-dot')"
        :class="['mt-2', getToneTextClass(node)]"
        :size="18"
      />
      <div>
        <h3 class="m-0 text-base text-main font-700">{{ node.title }}</h3>
        <p class="m-0 mt-4 text-sm text-regular leading-22px">
          {{ node.description }}
        </p>
      </div>
    </div>
  </template>
</template>
