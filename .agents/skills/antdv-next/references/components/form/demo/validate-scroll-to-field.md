# Slide to error field

## Description (en-US)

When validation fails or manually scroll to the error field.

## Source

```vue
<script setup lang="ts">
import type { FormInstance } from 'antdv-next'
import { reactive, shallowRef } from 'vue'

const formRef = shallowRef<FormInstance>()

const model = reactive({
  username: '',
  occupation: '',
  motto: '',
  bio: '',
})
</script>

<template>
  <a-form
    ref="formRef"
    :model="model"
    :scroll-to-first-error="{ behavior: 'instant', block: 'end', focus: true }"
    style="padding-block: 32px"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 14 }"
  >
    <a-form-item>
      <a-button @click="() => formRef?.scrollToField?.('bio')">
        Scroll to Bio
      </a-button>
    </a-form-item>
    <a-form-item name="username" label="Username" :rules="[{ required: true }]">
      <a-input v-model:value="model.username" />
    </a-form-item>
    <a-form-item label="Occupation" name="occupation">
      <a-select
        v-model:value="model.occupation"
        class="w-full" :options="[
          { label: 'Designer', value: 'designer' },
          { label: 'Developer', value: 'developer' },
          { label: 'Product Manager', value: 'product-manager' },
        ]"
      />
    </a-form-item>
    <a-form-item label="Motto" name="motto">
      <a-textarea v-model:value="model.motto" :rows="4" />
    </a-form-item>
    <a-form-item label="Bio" name="bio" :rules="[{ required: true }]">
      <a-textarea v-model:value="model.bio" :rows="6" />
    </a-form-item>
    <a-form-item>
      <a-flex gap="small">
        <a-button type="primary" html-type="submit">
          Submit
        </a-button>
        <a-button danger @click="() => formRef?.resetFields?.()">
          Reset
        </a-button>
      </a-flex>
    </a-form-item>
  </a-form>
</template>
```
