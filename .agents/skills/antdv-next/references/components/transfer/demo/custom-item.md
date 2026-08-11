# Custom datasource

## Description (en-US)

Customize each Transfer Item, allowing you to render a complex datasource.

## Source

```vue
<script setup lang="ts">
import type { TransferEmits, TransferProps } from 'antdv-next'
import { h, onMounted, ref } from 'vue'

interface RecordType {
  key: string
  title: string
  description: string
  chosen: boolean
}

const mockData = ref<RecordType[]>([])
const targetKeys = ref<TransferProps['targetKeys']>([])

function getMock() {
  const tempTargetKeys: string[] = []
  const tempMockData: RecordType[] = []
  for (let i = 0; i < 20; i++) {
    const data = {
      key: i.toString(),
      title: `content${i + 1}`,
      description: `description of content${i + 1}`,
      chosen: i % 2 === 0,
    }
    if (data.chosen) {
      tempTargetKeys.push(data.key)
    }
    tempMockData.push(data)
  }
  mockData.value = tempMockData
  targetKeys.value = tempTargetKeys
}

onMounted(() => {
  getMock()
})

const handleChange: TransferEmits['change'] = (newTargetKeys, direction, moveKeys) => {
  console.log(newTargetKeys, direction, moveKeys)
  targetKeys.value = newTargetKeys
}

function renderItem(item: RecordType) {
  const customLabel = h('span', { class: 'transfer-custom-item' }, `${item.title} - ${item.description}`)
  return {
    label: customLabel,
    value: item.title,
  }
}

const panelStyles: TransferProps['styles'] = {
  section: {
    width: '300px',
    height: '300px',
  },
}
</script>

<template>
  <a-transfer
    v-model:target-keys="targetKeys"
    :data-source="mockData"
    :styles="panelStyles"
    :render="renderItem"
    @change="handleChange"
  />
</template>

<style scoped>
.transfer-custom-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
</style>
```
