# Arrow

## Description (en-US)

Support show, hide or keep arrow in the center.

## Source

```vue
<script setup lang="ts">
import type { TooltipProps } from 'antdv-next'
import { computed, shallowRef } from 'vue'

const buttonWidth = shallowRef(80)
const arrow = shallowRef<'Show' | 'Hide' | 'Center'>('Show')
const mergedArrow = computed<TooltipProps['arrow']>(() => {
  if (arrow.value === 'Show') {
    return true
  }
  else if (arrow.value === 'Hide') {
    return false
  }
  return { pointAtCenter: true }
})
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
        <a-tooltip placement="topLeft" title="prompt text" :arrow="mergedArrow">
          <a-button>TL</a-button>
        </a-tooltip>
        <a-tooltip placement="top" title="prompt text" :arrow="mergedArrow">
          <a-button>Top</a-button>
        </a-tooltip>
        <a-tooltip placement="topRight" title="prompt text" :arrow="mergedArrow">
          <a-button>TR</a-button>
        </a-tooltip>
      </a-flex>
      <a-flex :style="{ width: `${buttonWidth * 5 + 32}px` }" justify="space-between" align="center">
        <a-flex align="center" vertical>
          <a-tooltip placement="leftTop" title="prompt text" :arrow="mergedArrow">
            <a-button>LT</a-button>
          </a-tooltip>
          <a-tooltip placement="left" title="prompt text" :arrow="mergedArrow">
            <a-button>Left</a-button>
          </a-tooltip>
          <a-tooltip placement="leftBottom" title="prompt text" :arrow="mergedArrow">
            <a-button>LB</a-button>
          </a-tooltip>
        </a-flex>
        <a-flex align="center" vertical>
          <a-tooltip placement="rightTop" title="prompt text" :arrow="mergedArrow">
            <a-button>RT</a-button>
          </a-tooltip>
          <a-tooltip placement="right" title="prompt text" :arrow="mergedArrow">
            <a-button>Right</a-button>
          </a-tooltip>
          <a-tooltip placement="rightBottom" title="prompt text" :arrow="mergedArrow">
            <a-button>RB</a-button>
          </a-tooltip>
        </a-flex>
      </a-flex>
      <a-flex justify="center" align="center" style="white-space: nowrap">
        <a-tooltip placement="bottomLeft" title="prompt text" :arrow="mergedArrow">
          <a-button>BL</a-button>
        </a-tooltip>
        <a-tooltip placement="bottom" title="prompt text" :arrow="mergedArrow">
          <a-button>Bottom</a-button>
        </a-tooltip>
        <a-tooltip placement="bottomRight" title="prompt text" :arrow="mergedArrow">
          <a-button>BR</a-button>
        </a-tooltip>
      </a-flex>
    </a-flex>
  </a-config-provider>
</template>
```
