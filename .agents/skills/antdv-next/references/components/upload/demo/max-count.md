# Max Count

## Description (en-US)

Limit files with `maxCount`. Will replace current one when `maxCount` is `1`.

## Source

```vue
<script setup lang="ts">
import { UploadOutlined } from '@antdv-next/icons'
</script>

<template>
  <a-space direction="vertical" style="width: 100%" size="large">
    <a-upload
      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
      list-type="picture"
      :max-count="1"
    >
      <a-button>
        <template #icon>
          <UploadOutlined />
        </template>
        Upload (Max: 1)
      </a-button>
    </a-upload>
    <a-upload
      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
      list-type="picture"
      :max-count="3"
      multiple
    >
      <a-button>
        <template #icon>
          <UploadOutlined />
        </template>
        Upload (Max: 3)
      </a-button>
    </a-upload>
  </a-space>
</template>
```
