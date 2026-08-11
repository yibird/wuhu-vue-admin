<script setup lang="ts">
import { computed } from 'vue'
import type { WorkflowEditableField, WorkflowNodeData } from '../types'

const props = defineProps<{
  selectedNodeData?: WorkflowNodeData
  selectedNodeId: string
}>()

defineEmits<{
  close: []
  'remove-selected': []
  'update-config': [key: string, value: unknown]
  'update-data': [key: WorkflowEditableField, value: string]
}>()

const configEntries = computed(() => {
  return Object.entries(props.selectedNodeData?.config ?? {})
})

const modelOptions = [
  { label: 'Doubao-pro-32k', value: 'Doubao-pro-32k' },
  { label: 'Qwen3-32B', value: 'Qwen3-32B' },
  { label: 'GPT-4.1', value: 'GPT-4.1' },
]

const configLabels: Record<string, string> = {
  assignee: '审批人',
  auth: '认证方式',
  channel: '发送渠道',
  completion: '完成策略',
  concurrency: '并发数量',
  datasource: '数据源',
  duration: '等待时长',
  expression: '判断表达式',
  language: '执行语言',
  max_concurrency: '最大并发',
  max_steps: '最大步骤数',
  max_tokens: '最大 Token',
  method: '请求方法',
  mode: '处理模式',
  operation: '数据操作',
  output: '输出字段',
  plugin_id: '插件标识',
  rerank: '启用重排',
  strategy: '执行策略',
  temperature: '随机性',
  timeout: '超时时间',
  timeout_hours: '超时小时',
  top_k: '召回数量',
  trigger: '触发方式',
  unit: '时间单位',
  verify_signature: '校验签名',
  wait_for_result: '等待结果',
  workflow_id: '目标流程',
}

function getConfigLabel(key: string) {
  return configLabels[key] ?? key
}

function formatComplexValue(value: unknown) {
  return JSON.stringify(value, null, 2)
}
</script>

<template>
  <aside
    class="min-h-0 min-w-0 overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container shadow-[0_18px_44px_rgb(15_23_42_/_16%)]"
  >
    <div v-if="selectedNodeData" class="h-full min-h-0 flex flex-col">
      <div
        class="flex flex-none items-center gap-10 border-b-1 border-color-2 border-b-solid px-14 py-12"
      >
        <span
          class="size-38 inline-flex shrink-0 items-center justify-center rounded-10"
          :style="{
            color: selectedNodeData.accent,
            backgroundColor: `${selectedNodeData.accent}18`,
          }"
        >
          <Icon :name="selectedNodeData.icon" :size="18" />
        </span>
        <div class="min-w-0 flex flex-col">
          <span class="truncate text-15px text-main font-700">
            {{ selectedNodeData.title }}
          </span>
          <small class="truncate text-xs text-muted">{{
            selectedNodeId
          }}</small>
        </div>
        <a-button
          type="text"
          class="ml-auto !h-32 !w-32 flex-none !p-0"
          aria-label="关闭节点配置"
          @click="$emit('close')"
        >
          <Icon name="i-lucide:x" :size="16" />
        </a-button>
      </div>

      <Scrollbar
        class="min-h-0 flex-1"
        content-class="flex min-h-full flex-col gap-14 p-14"
      >
        <section class="flex flex-col gap-10">
          <div class="text-xs text-secondary font-700">基本信息</div>
          <label class="flex flex-col gap-6">
            <span class="text-xs text-muted">节点名称</span>
            <a-input
              :value="selectedNodeData.title"
              allow-clear
              class="w-full min-w-0"
              @update:value="$emit('update-data', 'title', $event)"
            />
          </label>

          <label class="flex flex-col gap-6">
            <span class="text-xs text-muted">节点说明</span>
            <a-textarea
              :value="selectedNodeData.description"
              :auto-size="{ minRows: 3, maxRows: 5 }"
              allow-clear
              class="w-full min-w-0"
              @update:value="$emit('update-data', 'description', $event)"
            />
          </label>

          <label v-if="selectedNodeData.model" class="flex flex-col gap-6">
            <span class="text-xs text-muted">模型</span>
            <a-select
              :value="selectedNodeData.model"
              :options="modelOptions"
              class="w-full min-w-0"
              @change="
                (value: unknown) => $emit('update-data', 'model', String(value))
              "
            />
          </label>
        </section>

        <section v-if="configEntries.length" class="flex flex-col gap-9">
          <div class="text-xs text-secondary font-700">节点配置</div>
          <label
            v-for="[key, value] in configEntries"
            :key="key"
            class="flex flex-col gap-6"
          >
            <span class="text-xs text-muted">{{ getConfigLabel(key) }}</span>
            <a-switch
              v-if="typeof value === 'boolean'"
              :checked="value"
              class="self-start"
              @update:checked="$emit('update-config', key, $event)"
            />
            <a-input-number
              v-else-if="typeof value === 'number'"
              :value="value"
              class="w-full"
              @update:value="$emit('update-config', key, $event)"
            />
            <a-input
              v-else-if="typeof value === 'string'"
              :value="value"
              @update:value="$emit('update-config', key, $event)"
            />
            <pre
              v-else
              class="m-0 max-h-120 overflow-auto rounded-6 bg-fill-quaternary p-9 text-xs text-regular"
              >{{ formatComplexValue(value) }}</pre>
          </label>
        </section>

        <section class="grid grid-cols-2 gap-10">
          <div class="min-w-0 flex flex-col gap-7">
            <div class="text-xs text-secondary font-700">输入变量</div>
            <div
              v-for="input in selectedNodeData.inputs"
              :key="input.name"
              class="min-h-32 flex items-center justify-between gap-6 rounded-6 border-1 border-color-secondary border-solid bg-fill-quaternary px-8 py-6"
            >
              <span class="min-w-0 truncate text-xs text-main">{{
                input.name
              }}</span>
              <small class="flex-none text-xs text-placeholder">{{
                input.type
              }}</small>
            </div>
            <span
              v-if="!selectedNodeData.inputs.length"
              class="text-xs text-placeholder"
            >
              无输入
            </span>
          </div>

          <div class="min-w-0 flex flex-col gap-7">
            <div class="text-xs text-secondary font-700">输出变量</div>
            <div
              v-for="output in selectedNodeData.outputs"
              :key="output.name"
              class="min-h-32 flex items-center justify-between gap-6 rounded-6 border-1 border-color-secondary border-solid bg-fill-quaternary px-8 py-6"
            >
              <span class="min-w-0 truncate text-xs text-main">{{
                output.name
              }}</span>
              <small class="flex-none text-xs text-placeholder">{{
                output.type
              }}</small>
            </div>
            <span
              v-if="!selectedNodeData.outputs.length"
              class="text-xs text-placeholder"
            >
              无输出
            </span>
          </div>
        </section>

        <a-button
          danger
          block
          class="mt-auto !h-36 flex-none"
          :disabled="
            selectedNodeData.kind === 'start' || selectedNodeData.kind === 'end'
          "
          @click="$emit('remove-selected')"
        >
          <Icon name="i-lucide:trash-2" :size="16" />
          删除节点
        </a-button>
      </Scrollbar>
    </div>

    <div v-else class="h-full"></div>
  </aside>
</template>
