<script setup lang="ts">
import { isJsonValue } from '../../domain'
import type {
  JsonValue,
  WorkflowEditableField,
  WorkflowNodeData,
} from '../types'

const props = defineProps<{
  selectedNodeData?: WorkflowNodeData
  selectedNodeId: string
}>()

const emit = defineEmits<{
  close: []
  'remove-selected': []
  'update-config': [key: string, value: JsonValue]
  'update-data': [key: WorkflowEditableField, value: string]
}>()

const configEntries = computed(() => {
  const data = props.selectedNodeData
  if (!data) return []
  return data.configSchema.map(
    (field) =>
      [field, data.config[field.key] ?? field.schema.default ?? null] as const
  )
})

function formatComplexValue(value: JsonValue) {
  return JSON.stringify(value, null, 2)
}

function emitConfig(
  field: (typeof configEntries.value)[number][0],
  value: unknown
) {
  if (field.control === 'json' && typeof value === 'string') {
    try {
      const parsed: unknown = JSON.parse(value)
      if (isJsonValue(parsed)) emit('update-config', field.key, parsed)
    } catch {
      return
    }
    return
  }
  if (isJsonValue(value)) emit('update-config', field.key, value)
}
</script>

<template>
  <aside
    class="min-h-0 min-w-0 overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container shadow-floating"
  >
    <div v-if="selectedNodeData" class="h-full min-h-0 flex flex-col">
      <div
        class="flex flex-none items-center gap-10 border-b-1 border-color-2 border-b-solid px-14 py-12"
      >
        <span
          class="size-38 inline-flex shrink-0 items-center justify-center rounded-10"
          :style="{
            color: selectedNodeData.accent,
            backgroundColor: `color-mix(in srgb, ${selectedNodeData.accent} var(--w-workflow-node-icon-opacity), transparent)`,
          }"
        >
          <Icon :name="selectedNodeData.icon" :size="18" />
        </span>
        <div class="min-w-0 flex flex-col">
          <span class="truncate text-15px text-main font-700">
            {{ selectedNodeData.title }}
          </span>
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
        <a-form
          layout="vertical"
          class="[&_.ant-form-item]:mb-12 [&_.ant-form-item-label]:pb-5"
        >
          <section class="flex flex-col">
            <div class="mb-10 text-xs text-secondary font-700">基本信息</div>
            <a-form-item label="节点名称" required>
              <a-input
                :value="selectedNodeData.title"
                allow-clear
                class="w-full min-w-0"
                @update:value="$emit('update-data', 'title', $event)"
              />
            </a-form-item>

            <a-form-item label="节点说明">
              <a-textarea
                :value="selectedNodeData.description"
                :auto-size="{ minRows: 3, maxRows: 5 }"
                allow-clear
                class="w-full min-w-0"
                @update:value="$emit('update-data', 'description', $event)"
              />
            </a-form-item>
          </section>

          <section v-if="configEntries.length" class="flex flex-col">
            <div class="mb-10 text-xs text-secondary font-700">节点配置</div>
            <a-form-item
              v-for="[field, value] in configEntries"
              :key="field.key"
              :label="field.label"
              :required="field.required"
            >
              <a-select
                v-if="field.control === 'select'"
                :value="value"
                :options="field.options"
                class="w-full"
                @change="emitConfig(field, $event)"
              />
              <a-switch
                v-else-if="field.control === 'switch'"
                :checked="value"
                class="self-start"
                @update:checked="emitConfig(field, $event)"
              />
              <a-input-number
                v-else-if="
                  field.control === 'number' ||
                  field.schema.type === 'number' ||
                  field.schema.type === 'integer'
                "
                :value="value"
                class="w-full"
                @update:value="emitConfig(field, $event)"
              />
              <a-textarea
                v-else-if="
                  field.control === 'textarea' ||
                  field.control === 'code' ||
                  field.control === 'expression' ||
                  field.control === 'json'
                "
                :value="
                  typeof value === 'string' ? value : formatComplexValue(value)
                "
                :auto-size="{
                  minRows: field.control === 'textarea' ? 3 : 5,
                  maxRows: 12,
                }"
                :placeholder="field.placeholder"
                @update:value="emitConfig(field, $event)"
              />
              <a-input
                v-else
                :value="value"
                :placeholder="field.placeholder"
                @update:value="emitConfig(field, $event)"
              />
            </a-form-item>
          </section>
        </a-form>

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
