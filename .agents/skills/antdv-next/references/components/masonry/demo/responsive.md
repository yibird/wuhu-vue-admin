# Responsive

## Description (en-US)

Achieve responsive masonry layout for different screen sizes by setting `columns` and `gutter` properties to responsive configuration objects.

## Source

```vue
<script setup lang="ts">
const heights = [120, 55, 85, 160, 95, 140, 75, 110, 65, 130, 90, 145, 55, 100, 80]

const items = heights.map((height, index) => ({
  key: `item-${index}`,
  data: height,
  index,
}))
</script>

<template>
  <a-masonry
    :columns="{ xs: 1, sm: 2, md: 3, lg: 4 }"
    :gutter="{ xs: 8, sm: 12, md: 16 }"
    :items="items"
  >
    <template #itemRender="item">
      <a-card size="small" :style="{ height: `${item.data}px` }">
        {{ item.index + 1 }}
      </a-card>
    </template>
  </a-masonry>
</template>
```
