# Form variants

## Description (en-US)

Switch variants for inputs inside form.

## Source

```vue
<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive({
  variant: 'outlined',
  username: '',
  password: '',
})

const variantOptions = [
  { label: 'outlined', value: 'outlined' },
  { label: 'filled', value: 'filled' },
  { label: 'borderless', value: 'borderless' },
  { label: 'underlined', value: 'underlined' },
]
</script>

<template>
  <a-form
    :model="model"
    layout="vertical"
    :variant="model.variant as any"
    style="max-width: 600px"
  >
    <a-form-item label="Variant" name="variant">
      <a-radio-group v-model:value="model.variant">
        <a-radio-button v-for="item in variantOptions" :key="item.value" :value="item.value">
          {{ item.label }}
        </a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="Username" name="username" :rules="[{ required: true }]">
      <a-input v-model:value="model.username" placeholder="username" />
    </a-form-item>
    <a-form-item label="Password" name="password" :rules="[{ required: true }]">
      <a-input-password v-model:value="model.password" placeholder="password" />
    </a-form-item>
  </a-form>
</template>
```
