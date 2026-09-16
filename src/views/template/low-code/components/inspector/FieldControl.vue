<template>
  <div class="grid gap-6">
    <div class="flex-between-center gap-6">
      <span class="inline-flex-y-center gap-6 text-base text-secondary">
        {{ field.label }}
        <a-tooltip v-if="field.description" :title="field.description">
          <Icon name="i-lucide:help-circle" :size="12" class="text-muted" />
        </a-tooltip>
      </span>
      <button
        v-if="bindable"
        class="span-button inline-flex items-center justify-center rounded-4 px-4 py-1 text-xs transition"
        :class="
          isBound
            ? 'text-primary bg-primary/8'
            : 'text-muted hover:text-primary'
        "
        type="button"
        title="绑定表达式"
        @click="toggleBinding"
      >
        <Icon name="i-lucide:variable" :size="12" />
      </button>
    </div>

    <div v-if="isBound" class="grid gap-4">
      <a-input
        :value="binding"
        placeholder="表达式，例如 variables.username"
        @change="onBindingChange"
      />
      <div v-if="bindingError" class="text-xs text-error">
        {{ bindingError }}
      </div>
      <div v-else class="text-xs text-muted">
        可用：variables / queries / user / page / app / functions
      </div>
    </div>

    <template v-else>
      <a-input
        v-if="field.type === 'text'"
        :value="stringValue"
        :placeholder="field.placeholder"
        @change="onTextInput"
      />

      <a-textarea
        v-else-if="field.type === 'textarea'"
        :value="stringValue"
        :rows="3"
        :placeholder="field.placeholder"
        @change="onTextInput"
      />

      <a-input-number
        v-else-if="field.type === 'number'"
        :value="numberValue"
        class="w-full"
        :min="field.min"
        :max="field.max"
        :step="field.step"
        :placeholder="field.placeholder"
        @change="onNumberChange"
      />

      <a-switch
        v-else-if="field.type === 'switch'"
        class="w-fit justify-self-start"
        :checked="!!value"
        @change="onBooleanChange"
      />

      <a-select
        v-else-if="field.type === 'select'"
        :value="value as never"
        class="w-full"
        :options="field.options"
        allow-clear
        @change="commit($event)"
      />

      <a-radio-group
        v-else-if="field.type === 'radio'"
        :value="value as never"
        :options="field.options"
        option-type="button"
        button-style="solid"
        @change="commit($event)"
      />

      <a-slider
        v-else-if="field.type === 'slider'"
        :value="numberValue"
        :min="field.min ?? 0"
        :max="field.max ?? 100"
        :step="field.step ?? 1"
        @change="commit($event)"
      />

      <div v-else-if="field.type === 'color'" class="flex-y-center gap-6">
        <input
          class="size-26 shrink-0 cursor-pointer rounded-4 border-1 border-color-2 border-solid bg-transparent p-0"
          type="color"
          :value="colorValue"
          @input="onColorInput"
        />
        <a-input
          :value="stringValue"
          placeholder="#1677ff"
          @change="onTextInput"
        />
      </div>

      <div v-else-if="field.type === 'icon'" class="flex-y-center gap-6">
        <span
          class="size-26 inline-flex shrink-0 items-center justify-center rounded-4 bg-fill-quaternary text-primary"
        >
          <Icon :name="stringValue || 'i-lucide:box'" :size="15" />
        </span>
        <a-input
          :value="stringValue"
          placeholder="i-lucide:plus"
          @change="onTextInput"
        />
      </div>

      <OptionListEditor
        v-else-if="field.type === 'options'"
        :model-value="value"
        :label="field.label"
        @update:model-value="commit($event)"
      />

      <OptionListEditor
        v-else-if="field.type === 'columns'"
        :model-value="value"
        label="列"
        label-key="title"
        value-key="dataIndex"
        default-value="field"
        @update:model-value="commit($event)"
      />

      <JsonFieldEditor
        v-else-if="field.type === 'json' || field.type === 'rules'"
        :model-value="value"
        :rows="field.type === 'rules' ? 3 : 4"
        :placeholder="field.type === 'rules' ? '[]' : '{}'"
        @update:model-value="commit($event)"
      />

      <div v-else class="text-xs text-muted">
        暂不支持的字段类型：{{ field.type }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@/components'
import { validateExpression } from '../../core/expression'
import { useDesignerContext } from '../../composables'
import JsonFieldEditor from './JsonFieldEditor.vue'
import OptionListEditor from './OptionListEditor.vue'
import type { ComponentSchema, PropField } from '../../core/schema/types'

const props = defineProps<{
  node: ComponentSchema
  field: PropField
}>()

const designer = useDesignerContext()
const bindingError = ref('')

const bindable = computed(() => props.field.bindable !== false)
const binding = computed(() => props.node.bindings?.[props.field.key])
const isBound = computed(
  () => binding.value !== undefined && binding.value !== null
)
const value = computed(() => props.node.props?.[props.field.key])
const stringValue = computed(() =>
  value.value === undefined || value.value === null ? '' : String(value.value)
)
const numberValue = computed(() =>
  typeof value.value === 'number' ? value.value : undefined
)
const colorValue = computed(() => {
  const text = stringValue.value
  return /^#[0-9a-fA-F]{6}$/.test(text) ? text : '#1677ff'
})

function commit(next: unknown, mergeKey?: string) {
  designer.updateNode(
    props.node.id,
    { props: { [props.field.key]: next } },
    {
      label: `修改${props.field.label}`,
      mergeKey: mergeKey ?? `prop:${props.node.id}:${props.field.key}`,
    }
  )
}

function onTextInput(event: Event) {
  commit((event.target as HTMLInputElement).value)
}

function onNumberChange(next: number | null) {
  commit(next === null ? undefined : next)
}

function onBooleanChange(next: unknown) {
  commit(Boolean(next))
}

function onColorInput(event: Event) {
  commit((event.target as HTMLInputElement).value)
}

function toggleBinding() {
  if (isBound.value) {
    designer.setBinding(props.node.id, props.field.key, undefined)
    bindingError.value = ''
    return
  }
  const fallback = value.value === undefined ? '' : String(value.value)
  designer.setBinding(props.node.id, props.field.key, fallback)
}

function onBindingChange(event: Event) {
  const expression = (event.target as HTMLInputElement).value
  const result = validateExpression(expression)
  bindingError.value = result.valid ? '' : (result.error ?? '表达式无效')
  designer.setBinding(props.node.id, props.field.key, expression)
}
</script>
