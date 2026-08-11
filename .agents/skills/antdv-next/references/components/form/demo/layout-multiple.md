# Form mix layout

## Description (en-US)

Mix horizontal and vertical layouts in one page.

## Source

```vue
<script setup lang="ts">
import { reactive } from 'vue'

const modelHorizontal = reactive({
  horizontal: '',
  vertical: '',
  vertical2: '',
})

const modelVertical = reactive({
  horizontal: '',
  vertical: '',
  vertical2: '',
})
</script>

<template>
  <a-form name="layout-multiple-horizontal" layout="horizontal" :model="modelHorizontal">
    <a-form-item
      label="horizontal"
      name="horizontal"
      :rules="[{ required: true }]"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
    >
      <a-input v-model:value="modelHorizontal.horizontal" />
    </a-form-item>
    <a-form-item layout="vertical" label="vertical" name="vertical" :rules="[{ required: true }]">
      <a-input v-model:value="modelHorizontal.vertical" />
    </a-form-item>
    <a-form-item layout="vertical" label="vertical2" name="vertical2" :rules="[{ required: true }]">
      <a-input v-model:value="modelHorizontal.vertical2" />
    </a-form-item>
  </a-form>

  <a-divider />

  <a-form name="layout-multiple-vertical" layout="vertical" :model="modelVertical">
    <a-form-item label="vertical" name="vertical" :rules="[{ required: true }]">
      <a-input v-model:value="modelVertical.vertical" />
    </a-form-item>
    <a-form-item label="vertical2" name="vertical2" :rules="[{ required: true }]">
      <a-input v-model:value="modelVertical.vertical2" />
    </a-form-item>
    <a-form-item
      layout="horizontal"
      label="horizontal"
      name="horizontal"
      :rules="[{ required: true }]"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
    >
      <a-input v-model:value="modelVertical.horizontal" />
    </a-form-item>
  </a-form>
</template>
```
