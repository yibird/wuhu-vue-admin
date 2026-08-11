# Custom semantic dom styling

## Description (en-US)

## Source

```vue
<script setup lang="ts">
import type { DividerProps } from 'antdv-next'

const classesObject: DividerProps['classes'] = {
  root: 'demo-divider-root',
  content: 'demo-divider-content',
  rail: 'demo-divider-rail',
}

const classesFn: DividerProps['classes'] = (info) => {
  if (info?.props?.titlePlacement === 'start') {
    return {
      root: 'demo-divider-root--start',
    }
  }
  return {
    root: 'demo-divider-root--default',
  }
}

const stylesObject: DividerProps['styles'] = {
  root: { borderWidth: '2px', borderStyle: 'dashed' },
  content: { fontStyle: 'italic' },
  rail: { opacity: 0.85 },
}

const stylesFn: DividerProps['styles'] = (info) => {
  if (info?.props?.size === 'small') {
    return {
      root: { opacity: 0.6, cursor: 'default' },
    }
  }
  return {
    root: { backgroundColor: '#fafafa', borderColor: '#d9d9d9' },
  }
}
</script>

<template>
  <div>
    <a-divider :classes="classesObject">
      classes Object
    </a-divider>
    <a-divider title-placement="start" :classes="classesFn">
      classes Function
    </a-divider>
    <a-divider :styles="stylesObject">
      styles Object
    </a-divider>
    <a-divider size="small" :styles="stylesFn">
      styles Function
    </a-divider>
  </div>
</template>
```
