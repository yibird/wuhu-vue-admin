# Status

## Description (en-US)

Add status to AutoComplete with `status`, which could be `error` or `warning`.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const options = ref<{ value: string }[]>([])
const anotherOptions = ref<{ value: string }[]>([])

const mockVal = (str: string, repeat = 1) => ({ value: str.repeat(repeat) })

function getPanelValue(searchText: string) {
  return searchText
    ? [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)]
    : []
}

function handleSearch(text: string) {
  options.value = getPanelValue(text)
}

function handleAnotherSearch(text: string) {
  anotherOptions.value = getPanelValue(text)
}
</script>

<template>
  <a-space direction="vertical" style="width: 100%">
    <a-auto-complete
      :options="options"
      :show-search="{ onSearch: handleSearch }"
      status="error"
      style="width: 200px"
    />
    <a-auto-complete
      :options="anotherOptions"
      :show-search="{ onSearch: handleAnotherSearch }"
      status="warning"
      style="width: 200px"
    />
  </a-space>
</template>
```
