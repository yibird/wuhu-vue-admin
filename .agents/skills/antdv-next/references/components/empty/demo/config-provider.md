# ConfigProvider

## Description (en-US)

Use ConfigProvider to customize empty content.

## Source

```vue
<script setup lang="ts">
import { SmileOutlined } from '@antdv-next/icons'
import { h, ref } from 'vue'

const customize = ref(true)
const controlStyle = { width: '200px' }

function renderEmpty() {
  return h(
    'div',
    { style: { textAlign: 'center' } },
    [
      h(SmileOutlined, { style: { fontSize: '20px' } }),
      h('p', 'Data Not Found'),
    ],
  )
}

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
]

const renderTransferItem = (item: any) => item.title
</script>

<template>
  <a-switch
    v-model:checked="customize"
    checked-children="customize"
    un-checked-children="default"
  />
  <a-divider />
  <a-config-provider :render-empty="customize ? renderEmpty : undefined">
    <a-space vertical style="width: 100%">
      <h4>Select</h4>
      <a-select :style="controlStyle" />
      <h4>TreeSelect</h4>
      <a-tree-select :style="controlStyle" :tree-data="[]" />
      <h4>Cascader</h4>
      <a-cascader :style="controlStyle" :options="[]" show-search />
      <h4>Transfer</h4>
      <a-transfer :data-source="[]" :target-keys="[]" :render="renderTransferItem" />
      <h4>Table</h4>
      <a-table style="margin-top: 8px" :columns="columns" :data-source="[]" />
    </a-space>
    <!--    <template #renderEmpty> -->
    <!--      <div style="text-align: center"> -->
    <!--        <SmileOutlined style="font-size: 20px" /> -->
    <!--        <p>Data Not Found</p> -->
    <!--      </div> -->
    <!--    </template> -->
  </a-config-provider>
</template>
```
