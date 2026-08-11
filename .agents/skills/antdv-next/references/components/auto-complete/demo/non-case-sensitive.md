# Non-case-sensitive AutoComplete

## Description (en-US)

A non-case-sensitive AutoComplete

## Source

```vue
<script setup lang="ts">
const options = [
  { value: 'Burns Bay Road' },
  { value: 'Downing Street' },
  { value: 'Wall Street' },
]

const showSearch = {
  filterOption: (inputValue: string, option?: { value?: string }) => {
    return (option?.value ?? '').toUpperCase().includes(inputValue.toUpperCase())
  },
}
</script>

<template>
  <a-auto-complete
    style="width: 200px"
    :options="options"
    placeholder="try to type `b`"
    :show-search="showSearch"
  />
</template>
```
