# Radio.Group group - optional

## Description (en-US)

Render radios by configuring `options`. Radio type can also be set through the `optionType` parameter.

## Source

```vue
<script setup lang="ts">
import type { CheckboxOptionType } from 'antdv-next'
import { shallowRef } from 'vue'

const plainOptions = ['Apple', 'Pear', 'Orange']
const options: CheckboxOptionType[] = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange', title: 'Orange' },
]
const optionsWithDisabled: CheckboxOptionType[] = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange', disabled: true },
]

const value1 = shallowRef('Apple')
const value2 = shallowRef('Apple')
const value3 = shallowRef('Apple')
const value4 = shallowRef('Apple')
</script>

<template>
  <a-flex vertical gap="middle">
    <a-radio-group v-model:value="value1" :options="plainOptions" />
    <a-radio-group v-model:value="value2" :options="optionsWithDisabled" />
    <br>
    <a-radio-group v-model:value="value3" :options="options" option-type="button" />
    <a-radio-group v-model:value="value4" :options="optionsWithDisabled" option-type="button" button-style="solid" />
  </a-flex>
</template>
```
