# Custom Input Component

## Description (en-US)

Customize Input Component

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const options = ref<{ value: string }[]>([])

function handleSearch(value: string) {
  options.value = value
    ? [{ value }, { value: value + value }, { value: value + value + value }]
    : []
}

function handleKeyPress(ev: KeyboardEvent) {
  console.log('handleKeyPress', ev.key)
}

function handleSelect(value: string) {
  console.log('onSelect', value)
}
</script>

<template>
  <a-auto-complete
    :options="options"
    style="width: 220px"
    :show-search="{ onSearch: handleSearch }"
    @select="handleSelect"
  >
    <a-textarea
      placeholder="input here"
      class="custom"
      style="height: 50px"
      @keypress="handleKeyPress"
    />
  </a-auto-complete>
</template>
```
