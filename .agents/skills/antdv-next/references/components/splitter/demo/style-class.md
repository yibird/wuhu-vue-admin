# Custom semantic dom styling

## Description (en-US)

Customize semantic structure styles and class names. Supports both object and function forms.

## Source

```vue
<script setup lang="ts">
import type { SplitterProps } from 'antdv-next'

const stylesObject: SplitterProps['styles'] = {
  root: { backgroundColor: '#fffbe6' },
  dragger: { backgroundColor: 'rgba(194,223,252,0.4)' },
}

const stylesFn: SplitterProps['styles'] = ({ props }) => {
  if (props.orientation === 'horizontal') {
    return {
      root: {
        borderWidth: '2px',
        borderStyle: 'dashed',
        marginBottom: '10px',
      },
    }
  }
  return {}
}
</script>

<template>
  <a-flex vertical gap="large">
    <a-splitter
      style="height: 200px"
      root-class="shadow-secondary"
      :styles="stylesObject"
    >
      <a-splitter-panel>
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="color: #000">
            First
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
      <a-splitter-panel>
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="color: #000">
            Second
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
    </a-splitter>
    <a-splitter
      style="height: 200px"
      root-class="shadow-secondary"
      :styles="stylesFn"
    >
      <a-splitter-panel>
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5">
            First
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
      <a-splitter-panel>
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5">
            Second
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
    </a-splitter>
  </a-flex>
</template>

<style scoped>
.shadow-secondary {
  box-shadow:
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);
}
</style>
```
