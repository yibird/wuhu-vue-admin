# Col 24 debug

## Description (en-US)

Test col 24 usage.

## Source

```vue
<script setup lang="ts">
import { reactive } from 'vue'

const modelA = reactive({
  username: '',
  password: '',
  select: ['bamboo'],
})

const modelB = reactive({
  username: '',
  password: '',
})

const modelC = reactive({
  select: ['bamboo'],
  col12: '',
})

const selectOptions = [
  { label: 'Bamboo', value: 'bamboo' },
  { label: 'Little', value: 'little' },
  { label: 'Light', value: 'light' },
]

function handleFinish(values: any) {
  console.log('Success:', values)
}

function handleFinishFailed(errorInfo: any) {
  console.log('Failed:', errorInfo)
}
</script>

<template>
  <a-form
    name="col-24-debug"
    :model="modelA"
    :label-col="{ span: 24 }"
    :wrapper-col="{ span: 24 }"
    style="max-width: 600px"
    @finish="handleFinish"
    @finish-failed="handleFinishFailed"
  >
    <a-form-item
      label="Username"
      name="username"
      :rules="[{ required: true, message: 'Please input your username!' }]"
    >
      <a-input v-model:value="modelA.username" />
    </a-form-item>

    <a-form-item
      label="Password"
      name="password"
      :rules="[{ required: true, message: 'Please input your password!' }]"
    >
      <a-input-password v-model:value="modelA.password" />
    </a-form-item>

    <a-form-item label="Select" name="select" style="box-shadow: 0 0 3px red">
      <a-select v-model:value="modelA.select" mode="multiple" style="width: 70%" :options="selectOptions" />
    </a-form-item>

    <a-form-item>
      <a-button type="primary" html-type="submit">
        Submit
      </a-button>
    </a-form-item>
  </a-form>

  <a-form
    name="responsive"
    :model="modelB"
    :label-col="{ sm: 24, xl: 24 }"
    :wrapper-col="{ sm: 24, xl: 24 }"
    @finish="handleFinish"
    @finish-failed="handleFinishFailed"
  >
    <a-form-item
      label="Username"
      name="username"
      :rules="[{ required: true, message: 'Please input your username!' }]"
    >
      <a-input v-model:value="modelB.username" />
    </a-form-item>

    <a-form-item
      label="Password"
      name="password"
      :rules="[{ required: true, message: 'Please input your password!' }]"
    >
      <a-input-password v-model:value="modelB.password" />
    </a-form-item>

    <a-form-item>
      <a-button type="primary" html-type="submit">
        Submit
      </a-button>
    </a-form-item>
  </a-form>

  <a-divider />

  <a-form layout="vertical" :model="modelC">
    <a-form-item label="Select" name="select" style="box-shadow: 0 0 3px red">
      <a-select v-model:value="modelC.select" mode="multiple" style="width: 70%" :options="selectOptions" />
    </a-form-item>

    <a-form-item label="col12" name="col12" :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }">
      <a-input v-model:value="modelC.col12" />
    </a-form-item>
  </a-form>
</template>
```
