# Size Mix

## Description (en-US)

Mix using pixels and percentages to set panel size.

## Source

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'

const sizeBucket = ref(1)

interface SizeBucket {
  defaultSize?: number | string
  min: number | string
  max?: number | string
}

const SIZE_BUCKETS_1: SizeBucket[] = [
  {
    defaultSize: 100,
    min: 100,
    max: 200,
  },
  {
    min: 100,
    max: 200,
  },
  {
    min: '20%',
  },
]

const SIZE_BUCKETS_2: SizeBucket[] = [
  {
    min: 300,
  },
  {
    min: 100,
    max: 200,
  },
  {
    min: 600,
  },
]

const SIZE_BUCKETS = computed(() => sizeBucket.value === 1 ? SIZE_BUCKETS_1 : SIZE_BUCKETS_2)
</script>

<template>
  <div>
    <a-radio-group
      v-model:value="sizeBucket"
      style="margin-bottom: 16px"
    >
      <a-radio-button :value="1">
        Size Bucket 1
      </a-radio-button>
      <a-radio-button :value="2">
        Size Bucket 2
      </a-radio-button>
    </a-radio-group>
    <a-splitter
      :key="sizeBucket"
      style="height: 300px;  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)"
    >
      <a-splitter-panel
        :default-size="SIZE_BUCKETS?.[0]?.defaultSize"
        :min="SIZE_BUCKETS[0]?.min"
        :max="SIZE_BUCKETS?.[0]?.max"
      >
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="white-space: nowrap">
            First
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
      <a-splitter-panel
        :min="SIZE_BUCKETS?.[1]?.min"
        :max="SIZE_BUCKETS?.[1]?.max"
      >
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="white-space: nowrap">
            Second
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
      <a-splitter-panel :min="SIZE_BUCKETS?.[2]?.min">
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="white-space: nowrap">
            Third
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
    </a-splitter>
  </div>
</template>
```
