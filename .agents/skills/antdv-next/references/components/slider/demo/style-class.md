# Customize Semantic Elements

## Description (en-US)

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref(30)
const valueVertical = ref(30)

const stylesObject = {
  track: { backgroundImage: 'linear-gradient(180deg, #91caff, #1677ff)' },
  handle: { borderColor: '#1677ff', boxShadow: '0 2px 8px #1677ff' },
}

function stylesFn(info: any) {
  if (info.props.orientation === 'vertical') {
    return {
      root: { height: '300px' },
      track: { backgroundImage: 'linear-gradient(180deg, #722cc0, #722ed1)' },
      handle: { borderColor: '#722ed1', boxShadow: '0 2px 8px #722ed1' },
    }
  }
  return {}
}
</script>

<template>
  <a-flex vertical gap="middle">
    <a-slider v-model:value="value" class="custom-slider" :styles="stylesObject" />
    <a-slider
      v-model:value="valueVertical"
      class="custom-slider-vertical"
      orientation="vertical"
      reverse
      :styles="stylesFn"
    />
  </a-flex>
</template>

<style scoped>
.custom-slider {
  width: 300px;
}
.custom-slider-vertical {
  width: 100px;
}
.custom-slider-vertical:hover :deep(.ant-slider-handle):after {
  box-shadow: 0 0 0 2px #722ed1;
}

.custom-slider-vertical :deep(.ant-slider-handle):hover::after,
.custom-slider-vertical :deep(.ant-slider-handle):active::after,
.custom-slider-vertical :deep(.ant-slider-handle):focus::after,
.custom-slider-vertical :deep(.ant-slider-handle)::after {
  box-shadow: 0 0 0 2px #722ed1;
}
</style>
```
