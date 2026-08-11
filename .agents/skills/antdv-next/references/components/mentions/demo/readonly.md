# disabled or readOnly

## Description (en-US)

Configure `disabled` and `readOnly`.

## Source

```vue
<script setup lang="ts">
import type { MentionsProps } from 'antdv-next'

const options: MentionsProps['options'] = ['afc163', 'zombiej', 'yesmeck'].map(value => ({
  value,
  key: value,
  label: value,
}))
</script>

<template>
  <a-flex vertical gap="middle">
    <a-mentions
      style="width: 100%"
      placeholder="this is disabled Mentions"
      disabled
      :options="options"
    />
    <a-mentions
      style="width: 100%"
      placeholder="this is readOnly Mentions"
      readonly
      :options="options"
    />
  </a-flex>
</template>
```
