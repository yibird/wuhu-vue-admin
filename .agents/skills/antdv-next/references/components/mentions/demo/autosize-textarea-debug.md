# autoSize debug

## Description (en-US)

autoSize debug

## Source

```vue
<script setup lang="ts">
import type { MentionsEmits, MentionsProps } from 'antdv-next'

const options: MentionsProps['options'] = [
  {
    value: 'afc163',
    label: 'afc163',
  },
  {
    value: 'zombieJ',
    label: 'zombieJ',
  },
  {
    value: 'yesmeck',
    label: 'yesmeck',
  },
]

const handleChange: MentionsEmits['change'] = (value) => {
  console.log('Change:', value)
}

const handleSelect: MentionsEmits['select'] = (option) => {
  console.log('select', option)
}
</script>

<template>
  <a-flex vertical gap="large">
    <a-mentions
      placeholder="can resize"
      :options="options"
      @change="handleChange"
      @select="handleSelect"
    />
    <a-mentions
      placeholder="disable resize"
      :options="options"
      :style="{ resize: 'none' }"
      @change="handleChange"
      @select="handleSelect"
    />
  </a-flex>
</template>
```
