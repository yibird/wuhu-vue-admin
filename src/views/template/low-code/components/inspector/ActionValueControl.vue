<template>
  <div class="grid gap-6">
    <div class="flex-between-center">
      <span class="text-sm text-secondary">{{ field.label }}</span>
      <a-segmented
        :value="mode"
        :options="[
          { label: '值', value: 'value' },
          { label: '表达式', value: 'expression' },
        ]"
        @change="switchMode"
      />
    </div>

    <a-select
      v-if="field.type === 'select'"
      :value="current as never"
      class="w-full"
      :options="field.options"
      @change="commit($event)"
    />

    <a-select
      v-else-if="selectOptions"
      :value="current as never"
      class="w-full"
      :options="selectOptions"
      show-search
      option-filter-prop="label"
      :placeholder="field.placeholder"
      @change="commit($event)"
    />

    <a-input-number
      v-else-if="field.type === 'number'"
      :value="typeof current === 'number' ? current : undefined"
      class="w-full"
      @change="commit($event)"
    />

    <a-switch
      v-else-if="field.type === 'switch'"
      class="w-fit justify-self-start"
      :checked="!!current"
      @change="commit($event)"
    />

    <a-textarea
      v-else-if="field.type === 'textarea' || field.type === 'json'"
      :value="text"
      :rows="2"
      :placeholder="field.placeholder"
      @change="commit(($event.target as HTMLTextAreaElement).value)"
    />

    <a-input
      v-else
      :value="text"
      :placeholder="mode === 'expression' ? '输入表达式' : field.placeholder"
      @change="commit(($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { parseValueSchema } from '../../core/runtime'
import { useDesignerContext } from '../../composables'
import type { ActionParamField } from '../../core/runtime'
import type { ValueSchema } from '../../core/schema/types'

const props = defineProps<{
  value: unknown
  field: ActionParamField
}>()

const emit = defineEmits<{ 'update:value': [value: ValueSchema] }>()

const designer = useDesignerContext()

const schemaValue = computed<ValueSchema>(() => {
  return (
    parseValueSchema(props.value) ?? {
      type: 'value',
      value: props.value,
    }
  )
})

const mode = computed(() =>
  schemaValue.value.type === 'expression' ? 'expression' : 'value'
)
const current = computed(() =>
  mode.value === 'value' ? schemaValue.value.value : schemaValue.value.value
)
const text = computed(() =>
  current.value === undefined || current.value === null
    ? ''
    : String(current.value)
)

const selectOptions = computed(() => {
  switch (props.field.type) {
    case 'query':
      return designer.schema.queries.map((query) => ({
        label: query.name || query.id,
        value: query.id,
      }))
    case 'workflow':
      return designer.schema.workflows.map((workflow) => ({
        label: workflow.name,
        value: workflow.id,
      }))
    case 'variable':
      return designer.schema.variables.map((variable) => ({
        label: variable.name,
        value: variable.name,
      }))
    case 'page':
      return designer.schema.pages.map((page) => ({
        label: page.name,
        value: page.path,
      }))
    default:
      return undefined
  }
})

function commit(value: unknown) {
  if (mode.value === 'expression') {
    emit('update:value', {
      type: 'expression',
      value: value === undefined || value === null ? '' : String(value),
    })
  } else {
    emit('update:value', { type: 'value', value })
  }
}

function switchMode(next: string | number) {
  if (next === 'expression') {
    emit('update:value', {
      type: 'expression',
      value:
        current.value === undefined || current.value === null
          ? ''
          : String(current.value),
    })
  } else {
    emit('update:value', { type: 'value', value: current.value })
  }
}
</script>
