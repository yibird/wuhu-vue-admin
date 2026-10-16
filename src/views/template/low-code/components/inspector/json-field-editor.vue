<template>
  <div class="grid gap-4">
    <a-textarea
      :value="text"
      :rows="rows"
      class="font-mono text-xs"
      :placeholder="placeholder"
      @change="onInput"
      @blur="commit"
    />
    <div v-if="error" class="text-xs text-error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: unknown
    rows?: number
    placeholder?: string
  }>(),
  {
    rows: 4,
    placeholder: '{}',
  }
)

const emit = defineEmits<{ 'update:modelValue': [value: unknown] }>()

const text = ref(format(props.modelValue))
const error = ref('')
let editing = false

function format(value: unknown) {
  if (value === undefined) return ''
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

watch(
  () => props.modelValue,
  (value) => {
    if (editing) return
    text.value = format(value)
  }
)

function onInput(event: Event) {
  editing = true
  text.value = (event.target as HTMLTextAreaElement).value
}

function commit() {
  editing = false
  const raw = text.value.trim()
  if (!raw) {
    error.value = ''
    emit('update:modelValue', undefined)
    return
  }
  try {
    const parsed = JSON.parse(raw) as unknown
    error.value = ''
    emit('update:modelValue', parsed)
    text.value = format(parsed)
  } catch {
    error.value = 'JSON 格式不正确'
  }
}
</script>
