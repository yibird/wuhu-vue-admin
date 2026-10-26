<template>
  <header
    class="min-w-0 flex justify-between items-center gap-10 b-b-1-regular p-10 max-md:flex max-md:flex-wrap max-md:justify-center"
  >
    <a-segmented
      v-model:value="activeTab"
      :options="tabItems"
      class="shrink-0 justify-self-center [&_.ant-segmented-item-label]:(min-h-32 px-16 leading-32px)"
    >
      <template #labelRender="payload">
        <div class="inline-flex items-center">
          <Icon :name="payload.iconName" :size="16" class="mr-5" />
          <span>{{ payload.label }}</span>
        </div>
      </template>
    </a-segmented>

    <div
      class="workflow-canvas-actions min-w-0 flex flex-nowrap items-center justify-end gap-6 justify-self-end max-md:order-3 max-md:w-full max-md:flex-wrap max-md:justify-end max-sm:justify-start"
    >
      <a-button
        size="small"
        class="!h-32 shrink-0"
        :type="props.aiPanelOpen ? 'primary' : 'default'"
        title="用自然语言生成工作流"
        @click="emits('toggle-ai')"
      >
        <template #icon>
          <Icon name="i-lucide:sparkles" :size="15" />
        </template>
        AI 生成
      </a-button>
      <a-button
        size="small"
        class="!h-32 shrink-0"
        :type="props.sourcePanelOpen ? 'primary' : 'default'"
        title="打开源码"
        @click="emits('toggle-source')"
      >
        <template #icon>
          <Icon name="i-lucide:file-json" :size="15" />
        </template>
        源码
      </a-button>
      <a-button
        type="primary"
        size="small"
        class="!h-32 shrink-0"
        :disabled="props.isRunning && !props.isPaused"
        title="运行工作流"
        @click="emits('run')"
      >
        <template #icon>
          <Icon
            :name="props.isRunning ? 'i-lucide:loader-2' : 'i-lucide:play'"
            :size="15"
            :class="{ 'animate-spin': props.isRunning }"
          />
        </template>
        {{ props.isPaused ? '已暂停' : props.isRunning ? '运行中' : '运行' }}
      </a-button>
      <a-button
        v-if="props.isPaused"
        size="small"
        class="!h-32 shrink-0"
        title="继续运行"
        @click="emits('resume-run')"
      >
        <template #icon>
          <Icon name="i-lucide:play" :size="15" />
        </template>
        继续
      </a-button>
      <a-button
        size="small"
        class="!h-32 shrink-0"
        title="发布工作流"
        @click="emits('publish')"
      >
        <template #icon>
          <Icon name="i-lucide:rocket" :size="15" />
        </template>
        发布
      </a-button>
      <a-dropdown :trigger="['click']" :menu="moreMenu">
        <a-button size="small" class="!h-32 shrink-0" title="更多操作">
          <template #icon>
            <Icon name="i-lucide:ellipsis" :size="15" />
          </template>
          更多
          <Icon name="i-lucide:chevron-down" :size="13" class="ml-3" />
        </a-button>
      </a-dropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
import { h } from 'vue'
import type { MenuProps } from 'antdv-next'
import { Icon } from '@/components'
import type { WorkflowCanvasTab } from '../types'

const activeTab = defineModel<WorkflowCanvasTab>('activeTab', {
  required: true,
})

const props = defineProps<{
  aiPanelOpen: boolean
  isPaused: boolean
  isRunning: boolean
  sourcePanelOpen: boolean
}>()

const emits = defineEmits<{
  'copy-schema': []
  'download-schema': []
  publish: []
  run: []
  'share-workflow': []
  'resume-run': []
  'toggle-ai': []
  'toggle-source': []
}>()

function renderMenuIcon(name: string) {
  return () =>
    h(
      'span',
      { class: 'inline-flex size-16 items-center justify-center align-middle' },
      [h(Icon, { name, size: 15 })]
    )
}

const handleMoreMenuClick: MenuProps['onClick'] = ({ key }) => {
  if (key === 'copy-schema') emits('copy-schema')
  if (key === 'download-schema') emits('download-schema')
  if (key === 'share-workflow') emits('share-workflow')
}

const moreMenu = computed(() => ({
  items: [
    {
      key: 'copy-schema',
      label: '复制',
      icon: renderMenuIcon('i-lucide:copy'),
    },
    {
      key: 'download-schema',
      label: '导出',
      icon: renderMenuIcon('i-lucide:download'),
    },
    {
      key: 'share-workflow',
      label: '分享',
      icon: renderMenuIcon('i-lucide:share-2'),
    },
  ],
  onClick: handleMoreMenuClick,
}))

const tabItems = [
  { value: 'design', label: '编排', iconName: 'i-lucide:workflow' },
  { value: 'test', label: '测试', iconName: 'i-lucide:flask-conical' },
  { value: 'log', label: '日志', iconName: 'i-lucide:scroll-text' },
]
</script>
