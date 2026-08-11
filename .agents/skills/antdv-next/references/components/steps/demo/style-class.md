# Custom semantic dom styling

## Description (en-US)

## Source

```vue
<script setup lang="ts">
import type { StepsProps } from 'antdv-next'
import { theme } from 'antdv-next'

const { token } = theme.useToken()

const classes: StepsProps['classes'] = {
  root: 'steps-demo-root',
}

const stylesObject: StepsProps['styles'] = {
  itemIcon: {
    borderRadius: '30%',
  },
  itemContent: {
    fontStyle: 'italic',
  },
}

const stylesFn: StepsProps['styles'] = (info) => {
  if (info?.props?.type === 'navigation') {
    return {
      root: {
        borderColor: '#1890ff',
      },
    }
  }
  return {}
}

const items: StepsProps['items'] = [
  { title: 'Finished', content: 'This is a content.' },
  { title: 'In Progress', content: 'This is a content.' },
  { title: 'Waiting', content: 'This is a content.' },
]
</script>

<template>
  <a-flex vertical gap="middle">
    <a-steps :items="items" :current="1" :classes="classes" :styles="stylesObject" />
    <a-steps
      :items="items"
      :current="1"
      type="navigation"
      :classes="classes"
      :styles="stylesFn"
    />
  </a-flex>
</template>

<style>
.steps-demo-root {
  border-width: 2px;
  border-style: dashed;
  border-color: v-bind('token.colorBorder');
  border-radius: v-bind('`${token.borderRadius}px`');
  padding: v-bind('`${token.padding}px`');
}
</style>
```
