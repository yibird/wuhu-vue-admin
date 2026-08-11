# Customized Options

## Description (en-US)

You could set custom `Option` label

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const options = ref<{ label: string, value: string }[]>([])

function handleSearch(value: string) {
  if (!value || value.includes('@')) {
    options.value = []
    return
  }
  options.value = ['gmail.com', '163.com', 'qq.com'].map(domain => ({
    label: `${value}@${domain}`,
    value: `${value}@${domain}`,
  }))
}
</script>

<template>
  <a-auto-complete
    style="width: 200px"
    placeholder="input here"
    :show-search="{ onSearch: handleSearch }"
    :options="options"
  />
</template>
```
