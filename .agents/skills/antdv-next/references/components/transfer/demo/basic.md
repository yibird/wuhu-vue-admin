# Basic

## Description (en-US)

The most basic usage of `Transfer` involves providing the source data and target keys arrays, plus the rendering and some callback functions.

## Source

```vue
<script setup lang="ts">
import type { TransferEmits, TransferProps } from 'antdv-next'
import { ref } from 'vue'

interface RecordType {
  key: string
  title: string
  description: string
}

const mockData = Array.from({ length: 20 }).map<RecordType>((_, i) => ({
  key: i.toString(),
  title: `content${i + 1}`,
  description: `description of content${i + 1}`,
}))

const initialTargetKeys = mockData.filter(item => Number(item.key) > 10).map(item => item.key)

const targetKeys = ref<TransferProps['targetKeys']>(initialTargetKeys)
const selectedKeys = ref<TransferProps['targetKeys']>([])

const handleChange: TransferEmits['change'] = (nextTargetKeys, direction, moveKeys) => {
  console.log('targetKeys:', nextTargetKeys)
  console.log('direction:', direction)
  console.log('moveKeys:', moveKeys)
  targetKeys.value = nextTargetKeys
}

const handleSelectChange: TransferEmits['selectChange'] = (sourceSelectedKeys, targetSelectedKeys) => {
  console.log('sourceSelectedKeys:', sourceSelectedKeys)
  console.log('targetSelectedKeys:', targetSelectedKeys)
  selectedKeys.value = [...sourceSelectedKeys, ...targetSelectedKeys]
}

const handleScroll: TransferEmits['scroll'] = (direction, e) => {
  console.log('direction:', direction)
  console.log('target:', (e.target as HTMLElement | null)?.className)
}
</script>

<template>
  <a-transfer
    v-model:target-keys="targetKeys"
    v-model:selected-keys="selectedKeys"
    :data-source="mockData"
    :titles="['Source', 'Target']"
    :render="(item: RecordType) => item.title"
    @change="handleChange"
    @select-change="handleSelectChange"
    @scroll="handleScroll"
  />
</template>
```
