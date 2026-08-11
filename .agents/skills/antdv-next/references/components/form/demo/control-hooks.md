# Form methods

## Description (en-US)

Interact with form fields through form instance methods.

## Source

```vue
<script setup lang="ts">
import type { FormInstance } from 'antdv-next'
import { reactive, shallowRef } from 'vue'

const formRef = shallowRef<FormInstance>()
const model = reactive({
  note: '',
  gender: undefined as string | undefined,
  customizeGender: '',
})

const genderOptions = [
  { label: 'male', value: 'male' },
  { label: 'female', value: 'female' },
  { label: 'other', value: 'other' },
]

function handleGenderChange(value: string) {
  switch (value) {
    case 'male':
      model.note = 'Hi, man!'
      break
    case 'female':
      model.note = 'Hi, lady!'
      break
    case 'other':
      model.note = 'Hi there!'
      break
    default:
      break
  }
}

function handleFinish(values: any) {
  console.log(values)
}

function handleReset() {
  formRef.value?.resetFields?.()
}

function handleFill() {
  formRef.value?.setFieldsValue?.({ note: 'Hello world!', gender: 'male' })
}
</script>

<template>
  <a-form
    ref="formRef"
    name="control-hooks"
    :model="model"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    style="max-width: 600px"
    @finish="handleFinish"
  >
    <a-form-item name="note" label="Note" :rules="[{ required: true }]">
      <a-input v-model:value="model.note" />
    </a-form-item>
    <a-form-item name="gender" label="Gender" :rules="[{ required: true }]">
      <a-select
        v-model:value="model.gender"
        allow-clear
        placeholder="Select a option and change input text above"
        :options="genderOptions"
        @change="handleGenderChange"
      />
    </a-form-item>
    <a-form-item v-if="model.gender === 'other'" name="customizeGender" label="Customize Gender" :rules="[{ required: true }]">
      <a-input v-model:value="model.customizeGender" />
    </a-form-item>
    <a-form-item :label="null">
      <a-space>
        <a-button type="primary" html-type="submit">
          Submit
        </a-button>
        <a-button html-type="button" @click="handleReset">
          Reset
        </a-button>
        <a-button type="link" html-type="button" @click="handleFill">
          Fill form
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>
```
