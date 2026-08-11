# Value Format

## Description (en-US)

Use `valueFormat` to define the date value format. With it, `v-model:value` can directly use string values.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const singleValue = shallowRef<string | null>('2026-02-12')
const rangeValue = shallowRef<[string | null, string | null] | null>(['2026-02-01', '2026-02-12'])
</script>

<template>
  <a-space vertical :size="12">
    <a-space>
      <a-date-picker
        v-model:value="singleValue"
        value-format="YYYY-MM-DD"
        format="YYYY-MM-DD"
        allow-clear
      />
      <span>value: {{ singleValue ?? 'null' }}</span>
    </a-space>

    <a-space>
      <a-range-picker
        v-model:value="rangeValue"
        value-format="YYYY-MM-DD"
        format="YYYY-MM-DD"
        allow-clear
      />
      <span>value: {{ rangeValue ? `${rangeValue[0]} ~ ${rangeValue[1]}` : 'null' }}</span>
    </a-space>
  </a-space>
</template>
```
