# Playground

## Description (en-US)

A simple playground for column count and gutter.

## Source

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'

const gutterValues = [8, 16, 24, 32, 40, 48]
const vGutterValues = [8, 16, 24, 32, 40, 48]
const colCountValues = [2, 3, 4, 6, 8, 12]

const gutterKey = ref(1)
const vGutterKey = ref(1)
const colCountKey = ref(2)

const gutterMarks = gutterValues.reduce<Record<number, number>>((acc, value, index) => {
  acc[index] = value
  return acc
}, {})
const vGutterMarks = vGutterValues.reduce<Record<number, number>>((acc, value, index) => {
  acc[index] = value
  return acc
}, {})
const colCountMarks = colCountValues.reduce<Record<number, number>>((acc, value, index) => {
  acc[index] = value
  return acc
}, {})

const gutterValue = computed(() => gutterValues[gutterKey.value])
const vGutterValue = computed(() => vGutterValues[vGutterKey.value])
const colCount = computed(() => colCountValues[colCountKey.value])
const colSpan = computed(() => 24 / colCount.value!)

const formatGutter = (value?: number) => gutterValues[value ?? 0]
const formatVGutter = (value?: number) => vGutterValues[value ?? 0]
const formatColCount = (value?: number) => colCountValues[value ?? 0]

const colSnippet = computed(() => {
  return Array.from({ length: colCount.value! })
    .map(() => `  <a-col :span="${colSpan.value}"><div>Column</div></a-col>`)
    .join('\n')
})

const rowCode = computed(() => {
  return `<a-row :gutter="[${gutterValue.value}, ${vGutterValue.value}]">\n${colSnippet.value}\n${colSnippet.value}\n</a-row>`
})

const rowCodeSingle = computed(() => {
  return `<a-row :gutter="[${gutterValue.value}, ${vGutterValue.value}]">\n${colSnippet.value}\n</a-row>`
})
</script>

<template>
  <div class="grid-playground">
    <span>Horizontal Gutter (px):</span>
    <div class="slider-wrap">
      <a-slider
        v-model:value="gutterKey"
        :min="0"
        :max="gutterValues.length - 1"
        :marks="gutterMarks"
        :step="null"
        :tooltip="{ formatter: formatGutter }"
      />
    </div>

    <span>Vertical Gutter (px):</span>
    <div class="slider-wrap">
      <a-slider
        v-model:value="vGutterKey"
        :min="0"
        :max="vGutterValues.length - 1"
        :marks="vGutterMarks"
        :step="null"
        :tooltip="{ formatter: formatVGutter }"
      />
    </div>

    <span>Column Count:</span>
    <div class="slider-wrap slider-wrap-bottom">
      <a-slider
        v-model:value="colCountKey"
        :min="0"
        :max="colCountValues.length - 1"
        :marks="colCountMarks"
        :step="null"
        :tooltip="{ formatter: formatColCount }"
      />
    </div>

    <a-row :gutter="[gutterValue, vGutterValue]">
      <template v-for="_index in colCount" :key="`row-a-${_index}`">
        <a-col :span="colSpan">
          <div>Column</div>
        </a-col>
      </template>
      <template v-for="_index in colCount" :key="`row-b-${_index}`">
        <a-col :span="colSpan">
          <div>Column</div>
        </a-col>
      </template>
    </a-row>

    <div class="row-label">
      Another Row:
    </div>
    <a-row :gutter="[gutterValue, vGutterValue]">
      <template v-for="_index in colCount" :key="`row-c-${_index}`">
        <a-col :span="colSpan">
          <div>Column</div>
        </a-col>
      </template>
    </a-row>

    <pre class="demo-code">{{ rowCode }}</pre>
    <pre class="demo-code">{{ rowCodeSingle }}</pre>
  </div>
</template>

<style scoped>
.grid-playground {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.slider-wrap {
  width: 50%;
}
.slider-wrap-bottom {
  margin-bottom: 48px;
}
.row-label {
  margin-top: 8px;
}
.grid-playground div .ant-col {
  padding: 0;
  background: transparent !important;
  border: 0;
}
.grid-playground .ant-col > div {
  height: 120px;
  font-size: 14px;
  line-height: 120px;
  text-align: center;
  background: #0092ff;
  border-radius: 4px;
}
.grid-playground pre {
  padding: 8px 16px;
  font-size: 14px;
  background: #f9f9f9;
  border-radius: 6px;
}
.grid-playground pre.demo-code {
  direction: ltr;
}
</style>
```
