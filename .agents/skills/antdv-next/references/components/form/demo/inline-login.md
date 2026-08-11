# Inline Login Form

## Description (en-US)

Inline login form.

## Source

```vue
<script setup lang="ts">
import { LockOutlined, UserOutlined } from '@antdv-next/icons'
import { reactive } from 'vue'

const model = reactive({
  username: '',
  password: '',
})

function handleFinish(values: any) {
  console.log('Finish:', values)
}
</script>

<template>
  <a-form name="horizontal_login" layout="inline" :model="model" @finish="handleFinish">
    <a-form-item name="username" :rules="[{ required: true, message: 'Please input your username!' }]">
      <a-input v-model:value="model.username" placeholder="Username">
        <template #prefix>
          <UserOutlined />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item name="password" :rules="[{ required: true, message: 'Please input your password!' }]">
      <a-input v-model:value="model.password" type="password" placeholder="Password">
        <template #prefix>
          <LockOutlined />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit">
        Log in
      </a-button>
    </a-form-item>
  </a-form>
</template>
```
