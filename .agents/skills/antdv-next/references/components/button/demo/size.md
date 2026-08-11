# Size

## Description (en-US)

Antdv Next supports three sizes of buttons: small, default and large.

If a large or small button is desired, set the `size` property to either `large` or `small` respectively. Omit the `size` property for a button with the default size.

## Source

```vue
<script setup lang="ts">
import type { SizeType } from 'antdv-next'
import { DownloadOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

const size = ref<SizeType>('large')
</script>

<template>
  <a-radio-group v-model:value="size">
    <a-radio-button value="large">
      Large
    </a-radio-button>
    <a-radio-button value="default">
      Default
    </a-radio-button>
    <a-radio-button value="small">
      Small
    </a-radio-button>
  </a-radio-group>
  <a-divider title-placement="start" plain>
    Preview
  </a-divider>
  <a-flex gap="small" align="flex-start" vertical>
    <a-flex gap="small" wrap>
      <a-button type="primary" :size="size">
        Primary
      </a-button>
      <a-button :size="size">
        Default
      </a-button>
      <a-button type="dashed" :size="size">
        Dashed
      </a-button>
    </a-flex>
    <a-button type="link" :size="size">
      Link
    </a-button>
    <a-flex gap="small" wrap>
      <a-button type="primary" :size="size">
        <template #icon>
          <DownloadOutlined />
        </template>
      </a-button>
      <a-button type="primary" shape="circle" :size="size">
        <template #icon>
          <DownloadOutlined />
        </template>
      </a-button>
      <a-button type="primary" shape="round" :size="size">
        <template #icon>
          <DownloadOutlined />
        </template>
      </a-button>
      <a-button type="primary" shape="round" :size="size">
        <template #icon>
          <DownloadOutlined />
        </template>
        Download
      </a-button>
      <a-button type="primary" :size="size">
        <template #icon>
          <DownloadOutlined />
        </template>
        Download
      </a-button>
    </a-flex>
  </a-flex>
</template>
```
