# Slider with icon

## Description (en-US)

You can add an icon beside the slider to make it meaningful.

## Source

```vue
<script setup lang="ts">
import { FrownOutlined, SmileOutlined } from '@antdv-next/icons'
import { computed, ref } from 'vue'

const props = defineProps<{
  min?: number
  max?: number
}>()

const min = computed(() => props.min ?? 0)
const max = computed(() => props.max ?? 20)
const value = ref(0)

const mid = computed(() => Number(((max.value - min.value) / 2).toFixed(5)))
const preColorCls = computed(() => (value.value >= mid.value ? '' : 'icon-wrapper-active'))
const nextColorCls = computed(() => (value.value >= mid.value ? 'icon-wrapper-active' : ''))
</script>

<template>
  <div class="icon-wrapper">
    <FrownOutlined :class="preColorCls" />
    <a-slider v-model:value="value" :min="min" :max="max" />
    <SmileOutlined :class="nextColorCls" />
  </div>
</template>

<style scoped>
.icon-wrapper {
  position: relative;
  padding: 0 30px;
}

.icon-wrapper .anticon {
  position: absolute;
  top: -2px;
  width: 16px;
  height: 16px;
  color: rgba(0, 0, 0, 0.25);
  font-size: 16px;
  line-height: 1;
}

.icon-wrapper .icon-wrapper-active {
  color: rgba(0, 0, 0, 0.45);
}

.icon-wrapper .anticon:first-child {
  inset-inline-start: 0;
}

.icon-wrapper .anticon:last-child {
  inset-inline-end: 0;
}
</style>
```
