# Basic

## Description (en-US)

Basic usage.

## Source

```vue
<script setup lang="ts">
const heights = [150, 50, 90, 70, 110, 150, 130, 80, 50, 90, 100, 150, 60, 50, 80].map((height, index) => {
  return {
    key: `item-${index}`,
    data: height,
  }
})
</script>

<template>
  <a-masonry :columns="4" :gutter="16" :items="heights">
    <template #itemRender="{ index, data }">
      <template v-if="index === 4">
        <a-card size="small">
          <template #cover>
            <img
              alt="food"
              src="https://images.unsplash.com/photo-1491961865842-98f7befd1a60?w=523&auto=format"
            >
          </template>
          <a-card-meta title="I'm Special" description="Let's have a meal" />
        </a-card>
      </template>
      <template v-else>
        <a-card size="small" :style="{ height: `${data}px` }">
          {{ index + 1 }}
        </a-card>
      </template>
    </template>
  </a-masonry>
</template>
```
