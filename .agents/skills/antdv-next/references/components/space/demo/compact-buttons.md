# Button Compact Mode

## Description (en-US)

Compact button group.

## Source

```vue
<script setup lang="ts">
import {
  CommentOutlined,
  DownloadOutlined,
  EllipsisOutlined,
  HeartOutlined,
  LinkOutlined,
  MailOutlined,
  MobileOutlined,
  ShareAltOutlined,
  StarOutlined,
  WarningOutlined,
} from '@antdv-next/icons'
import { h } from 'vue'
</script>

<template>
  <a-space-compact block>
    <a-tooltip title="Link">
      <a-button>
        <template #icon>
          <LinkOutlined />
        </template>
      </a-button>
    </a-tooltip>
    <a-tooltip title="Comment">
      <a-button>
        <template #icon>
          <CommentOutlined />
        </template>
      </a-button>
    </a-tooltip>
    <a-tooltip title="Star">
      <a-button>
        <template #icon>
          <StarOutlined />
        </template>
      </a-button>
    </a-tooltip>
    <a-tooltip title="Heart">
      <a-button>
        <template #icon>
          <HeartOutlined />
        </template>
      </a-button>
    </a-tooltip>
    <a-tooltip title="Share">
      <a-button>
        <template #icon>
          <ShareAltOutlined />
        </template>
      </a-button>
    </a-tooltip>
    <a-tooltip title="Download">
      <a-button>
        <template #icon>
          <DownloadOutlined />
        </template>
      </a-button>
    </a-tooltip>

    <a-dropdown
      placement="bottomRight" :menu="{
        items: [
          {
            key: '1',
            label: 'Report',
            icon: () => h(WarningOutlined),
          },
          {
            key: '2',
            label: 'Mail',
            icon: () => h(MailOutlined),
          },
          {
            key: '3',
            label: 'Mobile',
            icon: () => h(MobileOutlined),
          },
        ],
        onClick: () => console.log('click dropdown'),
      }
      " :trigger="['click']"
    >
      <a-button>
        <template #icon>
          <EllipsisOutlined />
        </template>
      </a-button>
    </a-dropdown>
  </a-space-compact>

  <br>

  <a-space-compact block>
    <a-button type="primary">
      Button 1
    </a-button>
    <a-button type="primary">
      Button 2
    </a-button>
    <a-button type="primary">
      Button 3
    </a-button>
    <a-button type="primary">
      Button 4
    </a-button>
    <a-tooltip title="Tooltip">
      <a-button type="primary" disabled>
        <DownloadOutlined />
      </a-button>
    </a-tooltip>
    <a-tooltip type="primary" title="Tooltip">
      <a-button>
        <DownloadOutlined />
      </a-button>
    </a-tooltip>
  </a-space-compact>

  <br>

  <a-space-compact block>
    <a-button type="primary">
      Button 1
    </a-button>
    <a-button type="primary">
      Button 2
    </a-button>
    <a-button type="primary">
      Button 3
    </a-button>
    <a-tooltip title="Tooltip">
      <a-button type="primary" disabled>
        <DownloadOutlined />
      </a-button>
    </a-tooltip>
    <a-tooltip type="primary" title="Tooltip">
      <a-button>
        <DownloadOutlined />
      </a-button>
    </a-tooltip>
    <a-button type="primary">
      Button 4
    </a-button>

    <a-dropdown
      placement="bottomRight" :menu="{
        items: [
          {
            key: '1',
            label: '1st item',
          },
          {
            key: '2',
            label: '2nd item',
          },
          {
            key: '3',
            label: '3rd item',
          },
        ],
        onClick: () => console.log('click dropdown'),
      }
      " :trigger="['click']"
    >
      <a-button type="primary">
        <template #icon>
          <EllipsisOutlined />
        </template>
      </a-button>
    </a-dropdown>
  </a-space-compact>
</template>
```
