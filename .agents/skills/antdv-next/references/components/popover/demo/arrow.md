# Arrow

## Description (en-US)

Hide arrow by `arrow`.

## Source

```vue
<script setup lang="ts">
import type { PopoverProps } from 'antdv-next'
import { computed, h, shallowRef } from 'vue'

const buttonWidth = shallowRef(80)
const arrow = shallowRef<'Show' | 'Hide' | 'Center'>('Show')
const mergedArrow = computed<PopoverProps['arrow']>(() => {
  if (arrow.value === 'Hide') {
    return false
  }
  if (arrow.value === 'Show') {
    return true
  }
  return { pointAtCenter: true }
})

const title = 'Title'
const content = h('div', [
  h('p', 'Content'),
  h('p', 'Content'),
])
</script>

<template>
  <a-config-provider :button="{ style: { width: `${buttonWidth}px`, margin: '4px' } }">
    <a-segmented
      v-model:value="arrow"
      :options="['Show', 'Hide', 'Center']"
      style="margin-bottom: 24px"
    />
    <a-flex vertical justify="center" align="center" class="demo">
      <a-flex justify="center" align="center" style="white-space: nowrap">
        <a-popover placement="topLeft" :title="title" :content="content" :arrow="mergedArrow">
          <a-button>TL</a-button>
        </a-popover>
        <a-popover placement="top" :title="title" :content="content" :arrow="mergedArrow">
          <a-button>Top</a-button>
        </a-popover>
        <a-popover placement="topRight" :title="title" :content="content" :arrow="mergedArrow">
          <a-button>TR</a-button>
        </a-popover>
      </a-flex>
      <a-flex :style="{ width: `${buttonWidth * 5 + 32}px` }" justify="space-between" align="center">
        <a-flex align="center" vertical>
          <a-popover placement="leftTop" :title="title" :content="content" :arrow="mergedArrow">
            <a-button>LT</a-button>
          </a-popover>
          <a-popover placement="left" :title="title" :content="content" :arrow="mergedArrow">
            <a-button>Left</a-button>
          </a-popover>
          <a-popover placement="leftBottom" :title="title" :content="content" :arrow="mergedArrow">
            <a-button>LB</a-button>
          </a-popover>
        </a-flex>
        <a-flex align="center" vertical>
          <a-popover placement="rightTop" :title="title" :content="content" :arrow="mergedArrow">
            <a-button>RT</a-button>
          </a-popover>
          <a-popover placement="right" :title="title" :content="content" :arrow="mergedArrow">
            <a-button>Right</a-button>
          </a-popover>
          <a-popover placement="rightBottom" :title="title" :content="content" :arrow="mergedArrow">
            <a-button>RB</a-button>
          </a-popover>
        </a-flex>
      </a-flex>
      <a-flex justify="center" align="center" style="white-space: nowrap">
        <a-popover placement="bottomLeft" :title="title" :content="content" :arrow="mergedArrow">
          <a-button>BL</a-button>
        </a-popover>
        <a-popover placement="bottom" :title="title" :content="content" :arrow="mergedArrow">
          <a-button>Bottom</a-button>
        </a-popover>
        <a-popover placement="bottomRight" :title="title" :content="content" :arrow="mergedArrow">
          <a-button>BR</a-button>
        </a-popover>
      </a-flex>
    </a-flex>
  </a-config-provider>
</template>
```
