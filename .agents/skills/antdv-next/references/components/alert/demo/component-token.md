# Component Token

## Description (en-US)

Custom component token.

## Source

```vue
<script setup lang="ts">
import { SmileOutlined } from '@antdv-next/icons'
import { h } from 'vue'

const icon = () => h(SmileOutlined)
</script>

<template>
  <a-config-provider
    :theme="{
      components: {
        Alert: {
          withDescriptionIconSize: 32,
          withDescriptionPadding: 16,
        },
      },
    }"
  >
    <a-alert
      :icon="icon"
      title="Success Tips"
      description="Detailed description and advice about successful copywriting."
      type="success"
      show-icon
    />
  </a-config-provider>
</template>
```
