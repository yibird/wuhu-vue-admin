# Tree with line

## Description (en-US)

Tree with connected line between nodes, turn on by `showLine`, customize the preset icon by `switcherIcon`.

## Source

```vue
<script lang="ts" setup>
import type { TreeDataNode, TreeEmits } from 'antdv-next'
import { CarryOutOutlined, CheckOutlined, FormOutlined } from '@antdv-next/icons'
import { h, ref } from 'vue'

const treeData: TreeDataNode[] = [
  {
    title: 'parent 1',
    key: '0-0',
    icon: h(CarryOutOutlined),
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        icon: h(CarryOutOutlined),
        children: [
          { title: 'leaf', key: '0-0-0-0', icon: h(CarryOutOutlined) },
          {
            key: '0-0-0-1',
            icon: h(CarryOutOutlined),
          },
          { title: 'leaf', key: '0-0-0-2', icon: h(CarryOutOutlined) },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        icon: h(CarryOutOutlined),
        children: [{ title: 'leaf', key: '0-0-1-0', icon: h(CarryOutOutlined) }],
      },
      {
        title: 'parent 1-2',
        key: '0-0-2',
        icon: h(CarryOutOutlined),
        children: [
          { title: 'leaf', key: '0-0-2-0', icon: h(CarryOutOutlined) },
          {
            title: 'leaf',
            key: '0-0-2-1',
            icon: h(CarryOutOutlined),
            switcherIcon: h(FormOutlined),
          },
        ],
      },
    ],
  },
  {
    title: 'parent 2',
    key: '0-1',
    icon: h(CarryOutOutlined),
    children: [
      {
        title: 'parent 2-0',
        key: '0-1-0',
        icon: h(CarryOutOutlined),
        children: [
          { title: 'leaf', key: '0-1-0-0', icon: h(CarryOutOutlined) },
          { title: 'leaf', key: '0-1-0-1', icon: h(CarryOutOutlined) },
        ],
      },
    ],
  },
]

const showLine = ref(true)
const showIcon = ref(false)
const showLeafIcon = ref<boolean | ReturnType<typeof h>>(true)

const onSelect: TreeEmits['select'] = (selectedKeys, info) => {
  console.log('selected', selectedKeys, info)
}

function handleLeafIconChange(value: 'true' | 'false' | 'custom') {
  if (value === 'custom') {
    showLeafIcon.value = h(CheckOutlined)
    return
  }

  if (value === 'true') {
    showLeafIcon.value = true
    return
  }

  showLeafIcon.value = false
}

const expandedKeys = ref(['0-0-0'])
const leafSelectVal = ref('true')
</script>

<template>
  <div>
    <div class="mb-16px">
      showLine: <a-switch v-model:checked="showLine" />
      <br>
      <br>
      showIcon: <a-switch v-model:checked="showIcon" />
      <br>
      <br>
      showLeafIcon:
      <a-select
        v-model:value="leafSelectVal"
        :options="[
          { label: 'True', value: 'true' },
          { label: 'False', value: 'false' },
          { label: 'Custom icon', value: 'custom' },
        ]"
        @change="handleLeafIconChange"
      />
    </div>
    <a-tree
      v-model:expanded-keys="expandedKeys"
      :show-line="showLine ? { showLeafIcon } : false"
      :show-icon="showIcon"
      :tree-data="treeData"
      @select="onSelect"
    >
      <template #titleRender="{ key }">
        <template v-if="key === '0-0-0-1'">
          <div>multiple line title</div>
          <div>multiple line title</div>
        </template>
      </template>
    </a-tree>
  </div>
</template>
```
