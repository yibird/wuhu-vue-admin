<script setup lang="ts">
import { APPROVAL_WORKFLOW_SELECTORS } from '../constants'
import type { ApprovalWorkflowSettings } from '../types'

defineProps<{
  issueCount: number
  nodeCount: number
  publishBusy: boolean
  settings: ApprovalWorkflowSettings
}>()

const emit = defineEmits<{
  copySchema: []
  downloadSchema: []
  openSimulator: []
  publish: []
  toggleSource: []
}>()
</script>

<template>
  <header
    class="flex flex-wrap items-center justify-between gap-12 rounded-8 border-1 border-color-2 border-solid bg-container px-14 py-12 shadow-[var(--w-shadow-card)]"
  >
    <div class="min-w-0">
      <div class="flex items-center gap-9">
        <span
          class="size-36 flex items-center justify-center rounded-8 bg-primary/12 text-primary"
        >
          <Icon name="i-lucide:workflow" :size="19" />
        </span>
        <div class="min-w-0">
          <div class="flex items-center gap-8">
            <h1 class="m-0 truncate text-17px font-800 text-primary">
              {{ settings.name }}
            </h1>
            <span
              class="rounded-full px-8 py-3 text-11px"
              :class="
                settings.state === 'published'
                  ? 'bg-success/12 text-success'
                  : 'bg-warning/12 text-warning'
              "
            >
              {{ settings.state === 'published' ? '已发布' : '草稿' }}
            </span>
          </div>
          <p class="m-0 mt-3 truncate text-12px text-secondary">
            {{ settings.description }}
          </p>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-8">
      <span class="rounded-6 bg-fill px-9 py-5 text-12px text-secondary">
        {{ nodeCount }} 节点
      </span>
      <span
        class="rounded-6 px-9 py-5 text-12px"
        :class="
          issueCount ? 'bg-error/10 text-error' : 'bg-success/10 text-success'
        "
      >
        {{ issueCount ? `${issueCount} 阻塞` : '校验就绪' }}
      </span>
      <a-button @click="emit('openSimulator')">
        <Icon name="i-lucide:shield-check" :size="15" />
        模拟校验
      </a-button>
      <a-button @click="emit('toggleSource')">
        <Icon name="i-lucide:braces" :size="15" />
        Schema
      </a-button>
      <a-button @click="emit('copySchema')">
        <Icon name="i-lucide:copy" :size="15" />
        复制
      </a-button>
      <a-button @click="emit('downloadSchema')">
        <Icon name="i-lucide:download" :size="15" />
        导出
      </a-button>
      <a-button
        :data-testid="APPROVAL_WORKFLOW_SELECTORS.publish"
        type="primary"
        :disabled="publishBusy"
        :loading="publishBusy"
        @click="emit('publish')"
      >
        <Icon name="i-lucide:rocket" :size="15" />
        发布
      </a-button>
    </div>
  </header>
</template>
