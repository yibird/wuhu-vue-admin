# Advanced search

## Description (en-US)

Advanced search form with expand/collapse.

## Source

```vue
<script setup lang="ts">
import type { FormInstance } from 'antdv-next'
import { DownOutlined } from '@antdv-next/icons'
import { computed, reactive, ref, shallowRef } from 'vue'

const formRef = shallowRef<FormInstance>()
const expand = ref(false)
const model = reactive<Record<string, string>>({})

const fieldCount = computed(() => (expand.value ? 10 : 6))

const selectOptions = [
  {
    value: '1',
    label: 'longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglong',
  },
  {
    value: '2',
    label: '222',
  },
]

function handleFinish(values: any) {
  console.log('Received values of form:', values)
}

function handleReset() {
  formRef.value?.resetFields?.()
}
</script>

<template>
  <a-form
    ref="formRef"
    name="advanced_search"
    :model="model"
    style="max-width: none; background: #fafafa; border-radius: 8px; padding: 24px"
    @finish="handleFinish"
  >
    <a-row :gutter="24">
      <a-col v-for="i in fieldCount" :key="i" :span="8">
        <a-form-item
          v-if="i % 3 !== 1"
          :name="`field-${i - 1}`"
          :label="`Field ${i - 1}`"
          :rules="[{ required: true, message: 'Input something!' }]"
        >
          <a-input v-model:value="model[`field-${i - 1}`]" placeholder="placeholder" />
        </a-form-item>
        <a-form-item
          v-else
          :name="`field-${i - 1}`"
          :label="`Field ${i - 1}`"
          :rules="[{ required: true, message: 'Select something!' }]"
        >
          <a-select
            v-model:value="model[`field-${i - 1}`]"
            :options="selectOptions"
            placeholder="Select"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <div style="text-align: end">
      <a-space size="small">
        <a-button type="primary" html-type="submit">
          Search
        </a-button>
        <a-button html-type="button" @click="handleReset">
          Clear
        </a-button>
        <a-button type="link" size="small" @click="expand = !expand">
          <DownOutlined :style="{ transform: expand ? 'rotate(180deg)' : undefined }" />
          {{ expand ? 'Collapse' : 'Expand' }}
        </a-button>
      </a-space>
    </div>
  </a-form>

  <div style="line-height: 200px; text-align: center; background: #fafafa; border-radius: 8px; margin-top: 16px">
    Search Result List
  </div>
</template>
```
