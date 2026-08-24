<script setup lang="ts">
import { getControlDefinition } from './registry'
import type {
  DesignerNode,
  DesignerNodeUpdate,
  DesignerOption,
} from '../../types'

const props = defineProps<{
  node: DesignerNode
}>()

const emit = defineEmits<{
  update: [update: DesignerNodeUpdate]
}>()

const definition = computed(() => getControlDefinition(props.node.type))
const fields = computed(() => definition.value?.fields ?? [])

function getValue(key: string) {
  return Object.entries(props.node.props).find(
    ([fieldKey]) => fieldKey === key
  )?.[1]
}

function updateProp(key: string, value: unknown) {
  emit('update', {
    props: {
      [key]: value,
    },
  })
}

function getOptionsText(value: unknown) {
  if (!Array.isArray(value)) return ''
  return value
    .map((item) => {
      if (typeof item === 'string' || typeof item === 'number')
        return String(item)
      if (typeof item === 'object' && item !== null && 'label' in item) {
        const label = item.label
        return typeof label === 'string' ? label : ''
      }
      return ''
    })
    .filter(Boolean)
    .join('\n')
}

function updateOptions(key: string, value: string) {
  const options: DesignerOption[] = value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => ({ label: item, value: item }))
  updateProp(key, options)
}
</script>

<template>
  <div class="grid gap-12">
    <div
      v-if="!fields.length"
      class="rounded-8 border-1 border-color-2 border-solid bg-fill-quaternary p-12 text-xs text-secondary"
    >
      当前组件暂无专属属性，可通过通用属性或源码面板调整。
    </div>

    <label v-for="field in fields" :key="field.key" class="grid gap-6">
      <span class="text-xs text-muted">{{ field.label }}</span>

      <a-input
        v-if="field.kind === 'text'"
        :value="String(getValue(field.key) ?? '')"
        @update:value="updateProp(field.key, $event)"
      />
      <a-textarea
        v-else-if="field.kind === 'textarea'"
        :rows="4"
        :value="String(getValue(field.key) ?? '')"
        @update:value="updateProp(field.key, $event)"
      />
      <a-input-number
        v-else-if="field.kind === 'number'"
        class="w-full"
        :value="Number(getValue(field.key) ?? 0)"
        @update:value="updateProp(field.key, $event)"
      />
      <a-switch
        v-else-if="field.kind === 'boolean'"
        :checked="Boolean(getValue(field.key))"
        @update:checked="updateProp(field.key, $event)"
      />
      <a-select
        v-else-if="field.kind === 'select'"
        :options="field.options"
        :value="getValue(field.key)"
        @update:value="updateProp(field.key, $event)"
      />
      <a-textarea
        v-else
        :rows="5"
        :value="getOptionsText(getValue(field.key))"
        placeholder="每行一个选项"
        @update:value="updateOptions(field.key, $event)"
      />
    </label>
  </div>
</template>
