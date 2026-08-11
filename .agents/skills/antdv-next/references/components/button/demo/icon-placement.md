# Icon Placement

## Description (en-US)

You can set the position of a button's icon by setting the `iconPlacement` to `start` or `end` respectively.

## Source

```vue
<script setup lang="ts">
import { SearchOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

const position = ref<'start' | 'end'>('end')
</script>

<template>
  <a-space>
    <a-radio-group v-model:value="position">
      <a-radio-button value="start">
        start
      </a-radio-button>
      <a-radio-button value="end">
        end
      </a-radio-button>
    </a-radio-group>
  </a-space>
  <a-divider title-placement="start" plain>
    Preview
  </a-divider>
  <a-flex gap="small" vertical>
    <a-flex wrap gap="small">
      <a-tooltip title="search">
        <a-button type="primary" shape="circle">
          <template #icon>
            <SearchOutlined />
          </template>
        </a-button>
      </a-tooltip>
      <a-button type="primary" shape="circle">
        A
      </a-button>
      <a-button type="primary" :icon-placement="position">
        <template #icon>
          <SearchOutlined />
        </template>
        Search
      </a-button>
      <a-tooltip title="search">
        <a-button shape="circle">
          <template #icon>
            <SearchOutlined />
          </template>
        </a-button>
      </a-tooltip>
      <a-button :icon-placement="position">
        <template #icon>
          <SearchOutlined />
        </template>
        Search
      </a-button>
    </a-flex>
    <a-flex wrap gap="small">
      <a-tooltip title="search">
        <a-button shape="circle">
          <template #icon>
            <SearchOutlined />
          </template>
        </a-button>
      </a-tooltip>
      <a-button type="text" :icon-placement="position">
        <template #icon>
          <SearchOutlined />
        </template>
        Search
      </a-button>
      <a-tooltip title="search">
        <a-button type="dashed" shape="circle">
          <template #icon>
            <SearchOutlined />
          </template>
        </a-button>
      </a-tooltip>
      <a-button type="dashed" :icon-placement="position">
        <template #icon>
          <SearchOutlined />
        </template>
        Search
      </a-button>
      <a-button
        href="https://www.google.com"
        target="_blank"
        :icon-placement="position"
      >
        <template #icon>
          <SearchOutlined />
        </template>
      </a-button>
      <a-button type="primary" loading :icon-placement="position">
        Loading
      </a-button>
    </a-flex>
  </a-flex>
</template>
```
