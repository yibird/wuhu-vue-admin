# With Form

## Description (en-US)

Controlled mode, for example, to work with `Form`.

## Source

```vue
<script setup lang="ts">
import type { FormInstance } from 'antdv-next'
import { Mentions } from 'antdv-next'
import { reactive, shallowRef } from 'vue'

const model = reactive({
  coders: '',
  bio: '',
})

const formRef = shallowRef<FormInstance>()

const options = [
  {
    value: 'afc163',
    label: 'afc163',
  },
  {
    value: 'zombieJ',
    label: 'zombieJ',
  },
  {
    value: 'yesmeck',
    label: 'yesmeck',
  },
]

function handleFinish(values: any) {
  console.log('Submit:', values)
}

function handleFinishFailed(errorInfo: any) {
  console.log('Error:', errorInfo)
}

function handleReset() {
  formRef.value?.resetFields?.()
}

async function checkMention(_rule: any, value: string) {
  const mentions = Mentions.getMentions(value || '')
  if (mentions.length < 2) {
    throw new Error('More than one must be selected!')
  }
}
</script>

<template>
  <a-form
    ref="formRef"
    :model="model"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 16 }"
    @finish="handleFinish"
    @finish-failed="handleFinishFailed"
  >
    <a-form-item name="coders" label="Top coders" :rules="[{ validator: checkMention }]">
      <a-mentions v-model:value="model.coders" :rows="1" :options="options" />
    </a-form-item>
    <a-form-item name="bio" label="Bio" :rules="[{ required: true, message: 'Please enter your bio!' }]">
      <a-mentions
        v-model:value="model.bio"
        :rows="3"
        placeholder="You can use @ to ref user here"
        :options="options"
      />
    </a-form-item>
    <a-form-item :label="null">
      <a-space wrap>
        <a-button type="primary" html-type="submit">
          Submit
        </a-button>
        <a-button html-type="button" @click="handleReset">
          Reset
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>
```
