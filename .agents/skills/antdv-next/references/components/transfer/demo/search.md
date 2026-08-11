# Search

## Description (en-US)

Transfer with a search box.

## Source

```vue
<script setup lang="ts">
import type { TransferEmits, TransferProps } from 'antdv-next'
import { onMounted, ref } from 'vue'

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

function filterOption(inputValue: string, option: RecordType) {
  return option.description.includes(inputValue)
}

const handleChange: TransferEmits['change'] = (newTargetKeys) => {
  targetKeys.value = newTargetKeys
}

const handleSearch: TransferEmits['search'] = (direction, value) => {
  console.log('search:', direction, value)
}
</script>

<template>
  <a-transfer
    v-model:target-keys="targetKeys"
    :data-source="mockData"
    show-search
    :filter-option="filterOption"
    :render="(item: RecordType) => item.title"
    @change="handleChange"
    @search="handleSearch"
  />
</template>
```
