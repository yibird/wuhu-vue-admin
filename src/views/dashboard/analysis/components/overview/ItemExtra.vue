<script lang="ts" setup>
import type { CardItemExtraEmits } from '../types'

const items = [
  {
    label: '年',
    value: 'year',
  },
  {
    label: '月',
    value: 'month',
  },
  {
    label: '日',
    value: 'day',
  },
]

const emit = defineEmits<CardItemExtraEmits>()
const value = shallowRef('year')

function onChange(val: string) {
  value.value = val
  emit('change', val)
}
</script>

<template>
  <div
    class="inline-flex shrink-0 rounded-999 bg-fill-secondary p-2 text-xs text-secondary"
  >
    <a-segmented v-model:value="value" :options="items" @change="onChange" />
  </div>
</template>
