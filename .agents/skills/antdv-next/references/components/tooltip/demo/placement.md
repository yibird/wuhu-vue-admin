# Placement

## Description (en-US)

There are 12 placement options available.

## Source

```vue
<script setup lang="ts">
const text = 'prompt text'
const buttonWidth = 80
</script>

<template>
  <a-config-provider :button="{ style: { width: `${buttonWidth}px`, margin: '4px' } }">
    <a-flex vertical justify="center" align="center" class="demo">
      <a-flex justify="center" align="center" style="white-space: nowrap">
        <a-tooltip placement="topLeft" :title="text">
          <a-button>TL</a-button>
        </a-tooltip>
        <a-tooltip placement="top" :title="text">
          <a-button>Top</a-button>
        </a-tooltip>
        <a-tooltip placement="topRight" :title="text">
          <a-button>TR</a-button>
        </a-tooltip>
      </a-flex>
      <a-flex :style="{ width: `${buttonWidth * 5 + 32}px` }" justify="space-between" align="center">
        <a-flex align="center" vertical>
          <a-tooltip placement="leftTop" :title="text">
            <a-button>LT</a-button>
          </a-tooltip>
          <a-tooltip placement="left" :title="text">
            <a-button>Left</a-button>
          </a-tooltip>
          <a-tooltip placement="leftBottom" :title="text">
            <a-button>LB</a-button>
          </a-tooltip>
        </a-flex>
        <a-flex align="center" vertical>
          <a-tooltip placement="rightTop" :title="text">
            <a-button>RT</a-button>
          </a-tooltip>
          <a-tooltip placement="right" :title="text">
            <a-button>Right</a-button>
          </a-tooltip>
          <a-tooltip placement="rightBottom" :title="text">
            <a-button>RB</a-button>
          </a-tooltip>
        </a-flex>
      </a-flex>
      <a-flex justify="center" align="center" style="white-space: nowrap">
        <a-tooltip placement="bottomLeft" :title="text">
          <a-button>BL</a-button>
        </a-tooltip>
        <a-tooltip placement="bottom" :title="text">
          <a-button>Bottom</a-button>
        </a-tooltip>
        <a-tooltip placement="bottomRight" :title="text">
          <a-button>BR</a-button>
        </a-tooltip>
      </a-flex>
    </a-flex>
  </a-config-provider>
</template>
```
