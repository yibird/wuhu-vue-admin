<template>
  <div
    class="inline-flex shrink-0 rounded-999 bg-fill-secondary p-2 text-xs text-secondary"
  >
    <a-segmented :options="items" :value="period" @change="handleChange" />
  </div>
</template>

<script lang="ts" setup>
import type { StatPeriod } from './types'

const items: Array<{ label: string; value: StatPeriod }> = [
  { label: '年', value: 'year' },
  { label: '月', value: 'month' },
  { label: '日', value: 'day' },
]

/** 周期状态由卡片持有,这里只负责受控切换 */
const period = defineModel<StatPeriod>('period', { required: true })

function handleChange(value: string | number) {
  const next = items.find((item) => item.value === value)
  if (next) period.value = next.value
}
</script>
