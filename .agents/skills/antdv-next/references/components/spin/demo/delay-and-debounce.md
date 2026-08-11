# Delay

## Description (en-US)

Specifies a delay for loading state. If `spinning` ends during delay, loading status won't appear.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)
</script>

<template>
  <a-flex gap="middle" vertical>
    <a-spin :spinning="loading" :delay="500">
      <a-alert
        message="Alert message title"
        description="Further details about the context of this alert."
        type="info"
      />
    </a-spin>
    <a-flex align="center" gap="small">
      <span>Loading state:</span>
      <a-switch v-model:checked="loading" />
    </a-flex>
  </a-flex>
</template>
```
