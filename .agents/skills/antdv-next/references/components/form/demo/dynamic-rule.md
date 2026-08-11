# Dynamic Rules

## Description (en-US)

Toggle validation rules dynamically.

## Source

```vue
<script setup lang="ts">
import type { FormInstance } from 'antdv-next'
import { reactive, ref, shallowRef, watch } from 'vue'

const formRef = shallowRef<FormInstance>()
const checkNick = ref(false)
const model = reactive({
  username: '',
  nickname: '',
})

watch(checkNick, () => {
  formRef.value?.validateFields?.(['nickname'])
})

async function handleCheck() {
  try {
    const values = await formRef.value?.validateFields?.()
    console.log('Success:', values)
  }
  catch (errorInfo) {
    console.log('Failed:', errorInfo)
  }
}
</script>

<template>
  <a-form ref="formRef" name="dynamic_rule" :model="model" style="max-width: 600px">
    <a-form-item
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 8 }"
      name="username"
      label="Name"
      :rules="[{ required: true, message: 'Please input your name' }]"
    >
      <a-input v-model:value="model.username" placeholder="Please input your name" />
    </a-form-item>
    <a-form-item
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 8 }"
      name="nickname"
      label="Nickname"
      :rules="[{ required: checkNick, message: 'Please input your nickname' }]"
    >
      <a-input v-model:value="model.nickname" placeholder="Please input your nickname" />
    </a-form-item>
    <a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 8, offset: 4 }">
      <a-checkbox v-model:checked="checkNick">
        Nickname is required
      </a-checkbox>
    </a-form-item>
    <a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 8, offset: 4 }">
      <a-button type="primary" @click="handleCheck">
        Check
      </a-button>
    </a-form-item>
  </a-form>
</template>
```
