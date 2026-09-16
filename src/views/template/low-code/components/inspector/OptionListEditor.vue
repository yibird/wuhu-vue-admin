<template>
  <div class="grid gap-6">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="flex-y-center gap-4"
    >
      <a-input
        :value="String(item[labelKey] ?? '')"
        class="flex-1"
        placeholder="显示文本"
        @change="onUpdate(index, labelKey, $event)"
      />
      <a-input
        :value="String(item[valueKey] ?? '')"
        class="flex-1"
        placeholder="值"
        @change="onUpdate(index, valueKey, $event)"
      />
      <button
        class="span-button size-24 inline-flex shrink-0 items-center justify-center text-muted hover:text-primary"
        type="button"
        title="上移"
        :disabled="index === 0"
        @click="move(index, -1)"
      >
        <Icon name="i-lucide:arrow-up" :size="12" />
      </button>
      <button
        class="span-button size-24 inline-flex shrink-0 items-center justify-center text-muted hover:text-error"
        type="button"
        title="删除"
        @click="remove(index)"
      >
        <Icon name="i-lucide:trash-2" :size="12" />
      </button>
    </div>
    <a-button type="dashed" block @click="add">
      <Icon name="i-lucide:plus" :size="13" class="mr-4" />
      添加{{ label }}
    </a-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@/components'

const props = withDefaults(
  defineProps<{
    modelValue: unknown
    label?: string
    labelKey?: string
    valueKey?: string
    defaultValue?: unknown
  }>(),
  {
    label: '选项',
    labelKey: 'label',
    valueKey: 'value',
  }
)

const emit = defineEmits<{ 'update:modelValue': [value: unknown[]] }>()

const items = computed<Record<string, unknown>[]>(() =>
  Array.isArray(props.modelValue)
    ? (props.modelValue as Record<string, unknown>[])
    : []
)

function commit(next: Record<string, unknown>[]) {
  emit('update:modelValue', next)
}

function onUpdate(index: number, key: string, event: Event) {
  const value = (event.target as HTMLInputElement).value
  commit(
    items.value.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [key]: value } : item
    )
  )
}

function add() {
  commit([
    ...items.value,
    {
      [props.labelKey]: `选项${items.value.length + 1}`,
      [props.valueKey]: props.defaultValue ?? '',
    },
  ])
}

function remove(index: number) {
  commit(items.value.filter((_, itemIndex) => itemIndex !== index))
}

function move(index: number, offset: number) {
  const next = [...items.value]
  const target = index + offset
  if (target < 0 || target >= next.length) return
  const [item] = next.splice(index, 1)
  next.splice(target, 0, item)
  commit(next)
}
</script>
