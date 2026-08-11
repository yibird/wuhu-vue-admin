# Grid card

## Description (en-US)

Grid style card content.

## Source

```vue
<script setup lang="ts">
import type { CSSProperties } from 'vue'

const gridStyle: CSSProperties = {
  width: '25%',
  textAlign: 'center',
}
</script>

<template>
  <a-card title="Card Title">
    <a-card-grid :style="gridStyle">
      Content
    </a-card-grid>
    <a-card-grid :hoverable="false" :style="gridStyle">
      Content
    </a-card-grid>
    <a-card-grid :style="gridStyle">
      Content
    </a-card-grid>
    <a-card-grid :style="gridStyle">
      Content
    </a-card-grid>
    <a-card-grid :style="gridStyle">
      Content
    </a-card-grid>
    <a-card-grid :style="gridStyle">
      Content
    </a-card-grid>
    <a-card-grid :style="gridStyle">
      Content
    </a-card-grid>
  </a-card>
</template>
```
