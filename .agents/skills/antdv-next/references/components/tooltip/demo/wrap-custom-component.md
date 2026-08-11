# Wrap custom component

## Description (en-US)

Use with a custom component.

## Source

```vue
<script setup lang="ts">
import { defineComponent, h } from 'vue'

const ComponentWithEvents = defineComponent({
  name: 'ComponentWithEvents',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () => h('span', { ...attrs }, 'This text is inside a component with the necessary events exposed.')
  },
})
</script>

<template>
  <a-tooltip title="prompt text">
    <ComponentWithEvents />
  </a-tooltip>
</template>
```
