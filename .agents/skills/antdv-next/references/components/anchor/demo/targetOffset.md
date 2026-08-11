# Set Anchor scroll offset

## Description (en-US)

Anchor target scroll to screen center.

## Source

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'

const topRef = ref<HTMLDivElement>()
const targetOffset = ref<number>()

const style = {
  height: '30vh',
  backgroundColor: 'rgba(0, 0, 0, 0.85)',
  position: 'fixed',
  top: 0,
  insetInlineStart: 0,
  width: '75%',
  color: '#fff',
} as const

onMounted(() => {
  targetOffset.value = topRef.value?.clientHeight
})
</script>

<template>
  <div>
    <a-row>
      <a-col :span="18">
        <div
          id="part-1"
          style="height: 100vh; background: rgba(255, 0, 0, 0.02); margin-top: 30vh"
        >
          Part 1
        </div>
        <div id="part-2" style="height: 100vh; background: rgba(0, 255, 0, 0.02)">
          Part 2
        </div>
        <div id="part-3" style="height: 100vh; background: rgba(0, 0, 255, 0.02)">
          Part 3
        </div>
      </a-col>
      <a-col :span="6">
        <a-anchor
          :target-offset="targetOffset"
          :items="[
            { key: 'part-1', href: '#part-1', title: 'Part 1' },
            { key: 'part-2', href: '#part-2', title: 'Part 2' },
            { key: 'part-3', href: '#part-3', title: 'Part 3' },
          ]"
        />
      </a-col>
    </a-row>
    <div ref="topRef" :style="style">
      <div>Fixed Top Block</div>
    </div>
  </div>
</template>
```
