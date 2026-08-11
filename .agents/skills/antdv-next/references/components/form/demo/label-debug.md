# Label ellipsis debug

## Description (en-US)

Label ellipsis debug.

## Source

```vue
<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive({
  username: '',
  password: '',
})
</script>

<template>
  <a-form
    name="label-ellipsis"
    :model="model"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    style="max-width: 600px"
  >
    <a-form-item name="username">
      <template #label>
        <a-typography-text ellipsis>
          longtextlongtextlongtextlongtextlongtextlongtextlongtext
        </a-typography-text>
      </template>
      <a-input v-model:value="model.username" />
    </a-form-item>

    <a-form-item name="password">
      <template #label>
        <a-typography-text ellipsis>
          longtext longtext longtext longtext longtext longtext longtext
        </a-typography-text>
      </template>
      <a-input-password v-model:value="model.password" />
    </a-form-item>
  </a-form>
</template>
```
