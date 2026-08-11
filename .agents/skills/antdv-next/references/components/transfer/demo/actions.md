# Custom Actions

## Description (en-US)

You can customize operations with the `actions` prop. This example demonstrates how to customize actions, including handling disabled and loading states.

When `actions` is an array of strings, it will use the default Button component and set the strings as button text.

When `actions` is an array of Vue nodes, it will use these elements directly as action buttons, allowing you to use custom button components, such as buttons with loading state in this example.

Note:

1. When using custom buttons, the Transfer component will automatically handle the button's disabled state and click events.
2. You can add a `disabled` property to your custom button to control its disabled state.
3. You can add an `onClick` event handler to your custom button, which will be merged with the Transfer component's internal handler.

## Source

```vue
<script setup lang="ts">
import type { TransferEmits } from 'antdv-next'
import { DoubleLeftOutlined, DoubleRightOutlined } from '@antdv-next/icons'
import { Button, message } from 'antdv-next'
import { computed, h, ref } from 'vue'

interface RecordType {
  key: string
  title: string
  description: string
}

const mockData = Array.from({ length: 20 }).map<RecordType>((_, i) => ({
  key: i.toString(),
  title: `Content ${i + 1}`,
  description: `Description ${i + 1}`,
}))

const initialTargetKeys = mockData.filter(item => Number(item.key) > 10).map(item => item.key)

const targetKeys = ref<string[]>(initialTargetKeys)
const selectedKeys = ref<string[]>([])
const loadingRight = ref(false)
const loadingLeft = ref(false)

const handleChange: TransferEmits['change'] = (newTargetKeys, direction, moveKeys) => {
  targetKeys.value = newTargetKeys as string[]

  if (direction === 'right') {
    loadingRight.value = true
    setTimeout(() => {
      loadingRight.value = false
      message.success(`Successfully added ${moveKeys.length} items to the right`)
    }, 1000)
  }
  else {
    loadingLeft.value = true
    setTimeout(() => {
      loadingLeft.value = false
      message.success(`Successfully added ${moveKeys.length} items to the left`)
    }, 1000)
  }
}

const handleSelectChange: TransferEmits['selectChange'] = (sourceSelectedKeys, targetSelectedKeys) => {
  selectedKeys.value = [...sourceSelectedKeys, ...targetSelectedKeys] as string[]
}

const rightButtonDisabled = computed(() =>
  selectedKeys.value.length === 0 || selectedKeys.value.every(key => targetKeys.value.includes(key)),
)

const leftButtonDisabled = computed(() =>
  selectedKeys.value.length === 0 || selectedKeys.value.every(key => !targetKeys.value.includes(key)),
)

function handleRightButtonClick(event: MouseEvent) {
  console.log('Right button clicked', event)
}

function handleLeftButtonClick(event: MouseEvent) {
  console.log('Left button clicked', event)
}

const actions = computed(() => [
  h(
    Button,
    {
      type: 'primary',
      icon: h(DoubleRightOutlined),
      loading: loadingRight.value,
      disabled: rightButtonDisabled.value,
      onClick: handleRightButtonClick,
    },
    { default: () => 'Move To Right' },
  ),
  h(
    Button,
    {
      type: 'primary',
      icon: h(DoubleLeftOutlined),
      loading: loadingLeft.value,
      disabled: leftButtonDisabled.value,
      onClick: handleLeftButtonClick,
    },
    { default: () => 'Move To Left' },
  ),
])
</script>

<template>
  <a-transfer
    v-model:target-keys="targetKeys"
    v-model:selected-keys="selectedKeys"
    :data-source="mockData"
    :actions="actions"
    :render="(item: RecordType) => item.title"
    @change="handleChange"
    @select-change="handleSelectChange"
  />
</template>
```
