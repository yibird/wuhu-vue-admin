# Two-tone icon and colorful icon

## Description (en-US)

You can set the `twoToneColor` prop to a specific primary color for two-tone icons.

## Source

```vue
<script setup lang="ts">
import { CheckCircleTwoTone, HeartTwoTone, SmileTwoTone } from '@antdv-next/icons'
</script>

<template>
  <a-space>
    <SmileTwoTone />
    <HeartTwoTone two-tone-color="#eb2f96" />
    <CheckCircleTwoTone two-tone-color="#52c41a" />
  </a-space>
</template>
```
