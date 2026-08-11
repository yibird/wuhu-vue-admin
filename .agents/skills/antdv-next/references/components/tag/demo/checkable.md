# Checkable

## Description (en-US)

`CheckableTag` works like Checkbox, click it to toggle checked state. `CheckableTagGroup` provides function that is similar to `CheckboxGroup` or `RadioGroup`.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const tagsData = ['Movies', 'Books', 'Music', 'Sports']
const checked = ref(true)
const singleSelected = ref('Books')
const multipleSelected = ref<string[]>(['Movies', 'Music'])
</script>

<template>
  <a-form :label-col="{ span: 6 }">
    <a-form-item label="Checkable">
      <a-checkable-tag :checked="checked" @change="checked = !checked">
        Yes
      </a-checkable-tag>
    </a-form-item>
    <a-form-item label="Single">
      <a-checkable-tag-group v-model:value="singleSelected" :checked="singleSelected" :options="tagsData" />
    </a-form-item>
    <a-form-item label="Multiple">
      <a-checkable-tag-group v-model:value="multipleSelected" multiple :checked="multipleSelected" :options="tagsData" />
    </a-form-item>
  </a-form>
</template>
```
