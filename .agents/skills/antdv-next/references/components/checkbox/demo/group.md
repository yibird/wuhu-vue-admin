# Checkbox Group

## Description (en-US)

Generate a group of checkboxes from an array.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const plainOptions = ['Apple', 'Pear', 'Orange']

const options: any[] = [
  { label: 'Apple', value: 'Apple', className: 'label-1' },
  { label: 'Pear', value: 'Pear', className: 'label-2' },
  { label: 'Orange', value: 'Orange', className: 'label-3' },
]

const optionsWithDisabled: any[] = [
  { label: 'Apple', value: 'Apple', className: 'label-1' },
  { label: 'Pear', value: 'Pear', className: 'label-2' },
  { label: 'Orange', value: 'Orange', className: 'label-3', disabled: false },
]

const val = shallowRef()
</script>

<template>
  <a-checkbox-group v-model:value="val" :default-value="['Apple']" :options="plainOptions" />
  <br>
  <br>
  <a-checkbox-group v-model:value="val" :default-value="['Apple']" :options="options" />
  <br>
  <br>
  <a-checkbox-group v-model:value="val" disabled :default-value="['Apple']" :options="optionsWithDisabled" />
</template>
```
