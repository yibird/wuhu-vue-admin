# Arrow pointing at the center

## Description (en-US)

Set `arrow` with `pointAtCenter: true`, the arrow will point to the center of the target element.

## Source

```vue
<script setup lang="ts">
import type { MenuItemType } from 'antdv-next'

const items: MenuItemType[] = [
  {
    key: '1',
    label: '1st menu item',
  },
  {
    key: '2',
    label: '2nd menu item',
  },
  {
    key: '3',
    label: '3rd menu item',
  },
]

const href: Record<string, string> = {
  1: 'https://www.antgroup.com',
  2: 'https://www.aliyun.com',
  3: 'https://www.luohanacademy.com',
}
</script>

<template>
  <a-space direction="vertical">
    <a-space wrap>
      <a-dropdown :menu="{ items }" placement="bottomLeft" :arrow="{ pointAtCenter: true }">
        <a-button>bottomLeft</a-button>
        <template #labelRender="item">
          <a
            v-if="item && ['1', '2', '3'].includes(item.key as string)"
            target="_blank"
            rel="noopener noreferrer"
            :href="href[item.key as string]"
          >
            {{ item?.label }}
          </a>
        </template>
      </a-dropdown>
      <a-dropdown :menu="{ items }" placement="bottom" :arrow="{ pointAtCenter: true }">
        <a-button>bottom</a-button>
        <template #labelRender="item">
          <a
            v-if="item && ['1', '2', '3'].includes(item.key as string)"
            target="_blank"
            rel="noopener noreferrer"
            :href="href[item.key as string]"
          >
            {{ item?.label }}
          </a>
        </template>
      </a-dropdown>
      <a-dropdown :menu="{ items }" placement="bottomRight" :arrow="{ pointAtCenter: true }">
        <a-button>bottomRight</a-button>
        <template #labelRender="item">
          <a
            v-if="item && ['1', '2', '3'].includes(item.key as string)"
            target="_blank"
            rel="noopener noreferrer"
            :href="href[item.key as string]"
          >
            {{ item?.label }}
          </a>
        </template>
      </a-dropdown>
    </a-space>
    <a-space wrap>
      <a-dropdown :menu="{ items }" placement="topLeft" :arrow="{ pointAtCenter: true }">
        <a-button>topLeft</a-button>
        <template #labelRender="item">
          <a
            v-if="item && ['1', '2', '3'].includes(item.key as string)"
            target="_blank"
            rel="noopener noreferrer"
            :href="href[item.key as string]"
          >
            {{ item?.label }}
          </a>
        </template>
      </a-dropdown>
      <a-dropdown :menu="{ items }" placement="top" :arrow="{ pointAtCenter: true }">
        <a-button>top</a-button>
        <template #labelRender="item">
          <a
            v-if="item && ['1', '2', '3'].includes(item.key as string)"
            target="_blank"
            rel="noopener noreferrer"
            :href="href[item.key as string]"
          >
            {{ item?.label }}
          </a>
        </template>
      </a-dropdown>
      <a-dropdown :menu="{ items }" placement="topRight" :arrow="{ pointAtCenter: true }">
        <a-button>topRight</a-button>
        <template #labelRender="item">
          <a
            v-if="item && ['1', '2', '3'].includes(item.key as string)"
            target="_blank"
            rel="noopener noreferrer"
            :href="href[item.key as string]"
          >
            {{ item?.label }}
          </a>
        </template>
      </a-dropdown>
    </a-space>
  </a-space>
</template>
```
