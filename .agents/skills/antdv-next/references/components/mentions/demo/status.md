# Status

## Description (en-US)

Add status to Mentions with `status`, which could be `error` or `warning`.

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
  <a-flex vertical gap="middle">
    <a-mentions
      default-value="@afc163"
      status="error"
      :options="options"
      @change="handleChange"
      @select="handleSelect"
    />
    <a-mentions
      default-value="@afc163"
      status="warning"
      :options="options"
      @change="handleChange"
      @select="handleSelect"
    />
  </a-flex>
</template>
```
