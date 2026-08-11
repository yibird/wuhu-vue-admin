# Dependencies

## Description (en-US)

Validate fields based on other field values.

## Source

```vue
<script setup lang="ts">
import type { FormInstance } from 'antdv-next'
import { reactive, shallowRef, watch } from 'vue'

const formRef = shallowRef<FormInstance>()
const model = reactive({
  password: '',
  password2: '',
})

watch(
  () => model.password,
  () => {
    if (model.password2) {
      formRef.value?.validateFields?.(['password2'])
    }
  },
)

const confirmRules = [
  { required: true },
  {
    validator: async (_rule: any, value: string) => {
      if (!value || value === model.password) {
        return Promise.resolve()
      }
      return Promise.reject(new Error('The new password that you entered do not match!'))
    },
  },
]
</script>

<template>
  <a-form
    ref="formRef"
    name="dependencies"
    :model="model"
    auto-complete="off"
    style="max-width: 600px"
    layout="vertical"
  >
    <a-alert title="Try modify `Password2` and then modify `Password`" type="info" show-icon />

    <a-form-item label="Password" name="password" :rules="[{ required: true }]">
      <a-input v-model:value="model.password" />
    </a-form-item>

    <a-form-item label="Confirm Password" name="password2" :rules="confirmRules">
      <a-input v-model:value="model.password2" />
    </a-form-item>

    <a-typography>
      <p>
        Only update when <code>password2</code> changed:
      </p>
      <pre>{{ JSON.stringify(model, null, 2) }}</pre>
    </a-typography>
  </a-form>
</template>
```
