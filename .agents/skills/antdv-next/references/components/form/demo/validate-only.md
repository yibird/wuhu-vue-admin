# Validate Only

## Description (en-US)

Validate only without triggering UI status updates.

## Source

```vue
<script setup lang="ts">
import type { FormInstance } from 'antdv-next'
import { message } from 'antdv-next'
import { reactive, shallowRef } from 'vue'

const formRef = shallowRef<FormInstance>()
const model = reactive({
  username: '',
  password: '',
})

async function handleValidateOnly() {
  try {
    await formRef.value?.validateFields?.(['username', 'password'], { validateOnly: true })
    message.success('Validate only success')
  }
  catch {
    message.error('Validate only failed')
  }
}
</script>

<template>
  <a-form ref="formRef" layout="vertical" :model="model" style="max-width: 600px">
    <a-form-item name="username" label="Username" :rules="[{ required: true }]">
      <a-input v-model:value="model.username" placeholder="username" />
    </a-form-item>
    <a-form-item name="password" label="Password" :rules="[{ required: true }]">
      <a-input-password v-model:value="model.password" placeholder="password" />
    </a-form-item>
    <a-form-item :label="null">
      <a-space>
        <a-button type="primary" html-type="submit">
          Submit
        </a-button>
        <a-button html-type="button" @click="handleValidateOnly">
          Validate Only
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>
```
