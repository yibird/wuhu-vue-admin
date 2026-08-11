# Custom semantic dom styling

## Description (en-US)

## Source

```vue
<script setup lang="ts">
import type { MentionsProps } from 'antdv-next'

const options: MentionsProps['options'] = [
  { value: 'afc163', label: 'afc163' },
  { value: 'zombieJ', label: 'zombieJ' },
  { value: 'meet-student', label: 'meet-student' },
  { value: 'thinkasany', label: 'thinkasany' },
]

const classes: MentionsProps['classes'] = {
  root: 'mentions-demo-root',
}

const stylesObject: MentionsProps['styles'] = {
  textarea: {
    fontSize: '14px',
    resize: 'vertical',
    fontWeight: 200,
  },
}

const stylesFn: MentionsProps['styles'] = ({ props }) => {
  if (props.variant === 'filled') {
    return {
      root: {
        border: '1px solid #722ed1',
      },
      popup: {
        border: '1px solid #722ed1',
      },
    }
  }
  return {}
}
</script>

<template>
  <a-flex vertical gap="middle">
    <a-mentions
      :options="options"
      :classes="classes"
      :styles="stylesObject"
      placeholder="Object"
      :rows="2"
    />
    <a-mentions
      :options="options"
      :classes="classes"
      :styles="stylesFn"
      variant="filled"
      placeholder="Function"
    />
  </a-flex>
</template>

<style scoped>
:deep(.mentions-demo-root) {
  border: 1px solid #1677ff;
  border-radius: 8px;
  width: 300px;
}
</style>
```
