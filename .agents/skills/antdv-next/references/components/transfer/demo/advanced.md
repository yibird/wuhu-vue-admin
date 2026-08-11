# Advanced

## Description (en-US)

Advanced Usage of Transfer.

You can customize the labels of the transfer buttons, the width and height of the columns, and what should be displayed in the footer.

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

const handleChange: TransferEmits['change'] = (newTargetKeys) => {
  targetKeys.value = newTargetKeys
}

const panelStyles: TransferProps['styles'] = {
  section: {
    width: 250,
    height: 300,
  },
}
</script>

<template>
  <a-transfer
    v-model:target-keys="targetKeys"
    :data-source="mockData"
    show-search
    :styles="panelStyles"
    :actions="['to right', 'to left']"
    :render="(item: RecordType) => `${item.title}-${item.description}`"
    @change="handleChange"
  >
    <template #footer="{ info }">
      <a-button
        v-if="info?.direction === 'left'"
        size="small"
        style="display: flex; margin: 8px; margin-inline-end: auto"
        @click="getMock"
      >
        Left button reload
      </a-button>
      <a-button
        v-else
        size="small"
        style="display: flex; margin: 8px; margin-inline-start: auto"
        @click="getMock"
      >
        Right button reload
      </a-button>
    </template>
  </a-transfer>
</template>
```
