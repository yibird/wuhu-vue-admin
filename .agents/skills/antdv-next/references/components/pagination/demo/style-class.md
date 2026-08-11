# Custom semantic dom styling

## Description (en-US)

## Source

```vue
<script setup lang="ts">
import type { PaginationProps } from 'antdv-next'
import { useCssModule } from 'vue'

const moduleStyles = useCssModule()

const classes: PaginationProps['classes'] = {
  root: moduleStyles.root,
}

const stylesObject: PaginationProps['styles'] = {
  item: {
    borderRadius: '999px',
  },
}

const stylesFn: PaginationProps['styles'] = ({ props }) => {
  if (props.size === 'small') {
    return {
      item: {
        backgroundColor: 'rgba(200, 200, 200, 0.3)',
        marginInlineEnd: '4px',
      },
    }
  }
  return {}
}
</script>

<template>
  <a-flex vertical gap="middle">
    <a-pagination :total="500" :classes="classes" :styles="stylesObject" />
    <a-pagination :total="500" size="small" :classes="classes" :styles="stylesFn" />
  </a-flex>
</template>

<style module>
.root {
  border: 2px dashed #ccc;
  padding: 8px;
}
</style>
```
