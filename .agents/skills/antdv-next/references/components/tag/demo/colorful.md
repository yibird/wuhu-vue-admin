# Colorful Tag

## Description (en-US)

We preset a series of colorful tag styles for use in different situations. You can also set it to a hex color string for custom color.

## Source

```vue
<script setup lang="ts">
const variants = ['filled', 'solid', 'outlined'] as const
const presets = [
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
]
const customs = ['#f50', '#2db7f5', '#87d068', '#108ee9']
</script>

<template>
  <div v-for="variant in variants" :key="variant">
    <a-divider title-placement="start">
      Presets {{ variant }}
    </a-divider>
    <a-flex gap="small" align="center" wrap>
      <template v-for="color in presets" :key="color">
        <a-tag :variant="variant" :color="color">
          {{ color }}
        </a-tag>
      </template>
    </a-flex>
  </div>
  <div v-for="variant in variants" :key="variant">
    <a-divider title-placement="start">
      Custom {{ variant }}
    </a-divider>
    <a-flex gap="small" align="center" wrap>
      <template v-for="color in customs" :key="color">
        <a-tag :variant="variant" :color="color">
          {{ color }}
        </a-tag>
      </template>
    </a-flex>
  </div>
</template>
```
