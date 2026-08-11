# Smooth Transition

## Description (en-US)

Configure Tooltip unique display through [ConfigProvider global configuration](#config-provider-tooltip-unique) to achieve smooth transition effects with only one Tooltip displayed at a time.

## Source

```vue
<script lang="ts" setup>
import SharedButton from './components/shared-button.vue'
</script>

<template>
  <a-config-provider
    :tooltip="{
      unique: true,
    }"
  >
    <a-flex vertical gap="small">
      <a-flex gap="small" justify="center">
        <SharedButton />
        <SharedButton />
      </a-flex>
      <a-flex gap="small" justify="center">
        <SharedButton placement="bottom" />
        <SharedButton placement="bottom" />
      </a-flex>
    </a-flex>
  </a-config-provider>
</template>
```
