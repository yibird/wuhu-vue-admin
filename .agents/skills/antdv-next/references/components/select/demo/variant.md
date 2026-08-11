# Variants

## Description (en-US)

Variants of Select, there are four variants: `outlined` `filled` `borderless` and `underlined`.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const options = [
  { value: 'jack', label: 'Jack' },
  { value: 'lucy', label: 'Lucy' },
  { value: 'Yiminghe', label: 'yiminghe' },
]

const value1 = shallowRef<string>()
const value2 = shallowRef(['lucy'])
const value3 = shallowRef<string>()
const value4 = shallowRef(['lucy'])
const value5 = shallowRef<string>()
const value6 = shallowRef(['lucy'])
const value7 = shallowRef<string>()
const value8 = shallowRef(['lucy'])
</script>

<template>
  <a-flex :gap="12" vertical>
    <a-flex :gap="8">
      <a-select
        v-model:value="value1"
        placeholder="Outlined"
        style="flex: 1"
        :options="options"
      />
      <a-select
        v-model:value="value2"
        mode="multiple"
        placeholder="Outlined"
        style="flex: 1"
        :options="options"
      />
    </a-flex>
    <a-flex :gap="8">
      <a-select
        v-model:value="value3"
        placeholder="Filled"
        variant="filled"
        style="flex: 1"
        :options="options"
      />
      <a-select
        v-model:value="value4"
        mode="multiple"
        placeholder="Filled"
        variant="filled"
        style="flex: 1"
        :options="options"
      />
    </a-flex>
    <a-flex :gap="8">
      <a-select
        v-model:value="value5"
        placeholder="Borderless"
        variant="borderless"
        style="flex: 1"
        :options="options"
      />
      <a-select
        v-model:value="value6"
        mode="multiple"
        placeholder="Borderless"
        variant="borderless"
        style="flex: 1"
        :options="options"
      />
    </a-flex>
    <a-flex :gap="8">
      <a-select
        v-model:value="value7"
        placeholder="Underlined"
        variant="underlined"
        style="flex: 1"
        :options="options"
      />
      <a-select
        v-model:value="value8"
        mode="multiple"
        placeholder="Underlined"
        variant="underlined"
        style="flex: 1"
        :options="options"
      />
    </a-flex>
  </a-flex>
</template>
```
