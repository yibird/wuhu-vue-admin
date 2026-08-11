# Fresh

## Description (en-US)

When `fresh` is enabled, the masonry will continuously monitor size changes of child items and automatically re-layout. Click on cards to change their height.

## Source

```vue
<script setup lang="ts">
import { Card } from 'antdv-next'
import { defineComponent, h, ref } from 'vue'

const RandomHeightCard = defineComponent({
  props: {
    index: {
      type: Number,
      required: true,
    },
    defaultHeight: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const height = ref(props.defaultHeight)

    const handleClick = () => {
      height.value = Math.floor(Math.random() * 100) + 50
    }

    return () =>
      h(
        Card,
        {
          size: 'small',
          style: { height: `${height.value}px`, transition: 'height 0.3s' },
          onClick: handleClick,
        },
        () => `${props.index + 1} - Click`,
      )
  },
})

const heights = [150, 50, 90, 70, 110, 150, 130, 80, 50, 90, 100, 150, 60, 50, 80].map(
  (height, index) => {
    const item: {
      key: string
      data: number
      column?: number
    } = {
      key: `item-${index}`,
      data: height,
    }

    if (index === 4) {
      item.column = 0
    }

    return item
  },
)
</script>

<template>
  <a-masonry
    fresh
    :columns="4"
    :gutter="16"
    :items="heights"
  >
    <template #itemRender="{ data, index }">
      <RandomHeightCard :index="index" :default-height="data" />
    </template>
  </a-masonry>
</template>
```
