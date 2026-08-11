# Login Form

## Description (en-US)

Login form example.

## Source

```vue
<script setup lang="ts">
import { LockOutlined, UserOutlined } from '@antdv-next/icons'
import { reactive } from 'vue'

const model = reactive({
  username: '',
  password: '',
  remember: true,
})

function handleFinish(values: any) {
  console.log('Received values of form: ', values)
}
</script>

<template>
  <a-form name="login" :model="model" style="max-width: 360px" @finish="handleFinish">
    <a-form-item
      name="username"
      :rules="[{ required: true, message: 'Please input your Username!' }]"
    >
      <a-input v-model:value="model.username" placeholder="Username">
        <template #prefix>
          <UserOutlined />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item
      name="password"
      :rules="[{ required: true, message: 'Please input your Password!' }]"
    >
      <a-input v-model:value="model.password" type="password" placeholder="Password">
        <template #prefix>
          <LockOutlined />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-flex justify="space-between" align="center">
        <a-form-item name="remember" no-style>
          <a-checkbox v-model:checked="model.remember">
            Remember me
          </a-checkbox>
        </a-form-item>
        <a href="">
          Forgot password
        </a>
      </a-flex>
    </a-form-item>

    <a-form-item>
      <a-button block type="primary" html-type="submit">
        Log in
      </a-button>
      or <a href="">Register now!</a>
    </a-form-item>
  </a-form>
</template>
```
