# Custom render

## Description (en-US)

For instance, add an external link after the selected value.

## Source

```vue
<script setup lang="ts">
interface Option {
  value: string
  label: string
  children?: Option[]
  code?: number
}

const options: Option[] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
            code: 752100,
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
            code: 453400,
          },
        ],
      },
    ],
  },
]

function handleAreaClick(e: MouseEvent, label: string, option: Option) {
  e.stopPropagation()
  console.log('clicked', label, option)
}

function getSelectedOption(selectedOptions: Option[] | undefined, index: number) {
  return selectedOptions?.[index]
}

function handleLastClick(
  e: MouseEvent,
  label: string,
  selectedOptions: Option[] | undefined,
  index: number,
) {
  const option = selectedOptions?.[index]
  if (!option) {
    return
  }
  handleAreaClick(e, label, option)
}

function getLabelKey(label: string, selectedOptions: Option[] | undefined, index: number) {
  return getSelectedOption(selectedOptions, index)?.value ?? label
}
</script>

<template>
  <a-cascader
    :options="options"
    :default-value="['zhejiang', 'hangzhou', 'xihu']"
    style="width: 100%"
  >
    <template #displayRender="{ labels, selectedOptions }">
      <span v-for="(label, index) in labels" :key="getLabelKey(String(label), selectedOptions as any, index)">
        <template v-if="index === labels.length - 1">
          {{ label }}
          <template v-if="getSelectedOption(selectedOptions as any, index)?.code !== undefined">
            (
            <a
              @click="(e) => handleLastClick(e, String(label), selectedOptions as any, index)"
            >
              {{ getSelectedOption(selectedOptions as any, index)?.code }}
            </a>
            )
          </template>
        </template>
        <template v-else>
          {{ label }} /
        </template>
      </span>
    </template>
    <template #optionRender="option">
      <span>{{ option.label }} ({{ option.value }})</span>
    </template>
  </a-cascader>
</template>
```
