# Dynamic Form nest Items

## Description (en-US)

Dynamic nested form items.

## Source

```vue
<script setup lang="ts">
import { MinusCircleOutlined, PlusOutlined } from '@antdv-next/icons'
import { reactive } from 'vue'

const model = reactive({
  users: [
    { first: '', last: '' },
  ],
})

function addUser() {
  model.users.push({ first: '', last: '' })
}

function removeUser(index: number) {
  model.users.splice(index, 1)
}

function handleFinish(values: any) {
  console.log('Received values of form:', values)
}
</script>

<template>
  <a-form
    name="dynamic_form_nest_item"
    :model="model"
    style="max-width: 600px"
    auto-complete="off"
    @finish="handleFinish"
  >
    <a-space v-for="(user, index) in model.users" :key="`user-${index}`" align="baseline" style="display: flex; margin-bottom: 8px">
      <a-form-item
        :name="['users', index, 'first']"
        :rules="[{ required: true, message: 'Missing first name' }]"
      >
        <a-input v-model:value="user.first" placeholder="First Name" />
      </a-form-item>
      <a-form-item
        :name="['users', index, 'last']"
        :rules="[{ required: true, message: 'Missing last name' }]"
      >
        <a-input v-model:value="user.last" placeholder="Last Name" />
      </a-form-item>
      <MinusCircleOutlined @click="removeUser(index)" />
    </a-space>

    <a-form-item>
      <a-button type="dashed" block @click="addUser">
        <template #icon>
          <PlusOutlined />
        </template>
        Add field
      </a-button>
    </a-form-item>

    <a-form-item>
      <a-button type="primary" html-type="submit">
        Submit
      </a-button>
    </a-form-item>
  </a-form>
</template>
```
