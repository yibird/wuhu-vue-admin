# Theme

## Description (en-US)

Modify theme by `theme` prop.

## Source

```vue
<script setup lang="ts">
import type { Color } from 'antdv-next'
import { computed, reactive } from 'vue'

interface ThemeData {
  borderRadius: number
  colorPrimary: string
  Button?: {
    colorPrimary: string
    algorithm?: boolean
  }
}

const formState = reactive<ThemeData>({
  borderRadius: 6,
  colorPrimary: '#1677ff',
  Button: {
    colorPrimary: '#00B96B',
    algorithm: false,
  },
})

const themeConfig = computed(() => ({
  token: {
    colorPrimary: formState.colorPrimary,
    borderRadius: formState.borderRadius,
  },
  components: {
    Button: {
      colorPrimary: formState.Button?.colorPrimary,
      algorithm: formState.Button?.algorithm,
    },
  },
}))

function handlePrimaryChange(color: Color) {
  formState.colorPrimary = color.toHexString()
}

function handleButtonColorChange(color: Color) {
  if (!formState.Button) {
    formState.Button = { colorPrimary: color.toHexString() }
    return
  }
  formState.Button.colorPrimary = color.toHexString()
}
</script>

<template>
  <div>
    <a-config-provider :theme="themeConfig">
      <a-space>
        <a-input />
        <a-button type="primary">
          Button
        </a-button>
      </a-space>
    </a-config-provider>
    <a-divider />
    <a-form
      :model="formState"
      name="theme"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
    >
      <a-form-item name="colorPrimary" label="Primary Color">
        <a-color-picker :value="formState.colorPrimary" @change-complete="handlePrimaryChange" />
      </a-form-item>
      <a-form-item name="borderRadius" label="Border Radius">
        <a-input-number v-model:value="formState.borderRadius" />
      </a-form-item>
      <a-form-item label="Button">
        <a-form-item :name="['Button', 'algorithm']" label="algorithm" :label-col="{ span: 6 }">
          <a-switch v-model:checked="formState.Button!.algorithm" />
        </a-form-item>
        <a-form-item :name="['Button', 'colorPrimary']" label="Primary Color" :label-col="{ span: 6 }">
          <a-color-picker :value="formState.Button?.colorPrimary" @change-complete="handleButtonColorChange" />
        </a-form-item>
      </a-form-item>
      <a-form-item name="submit" :wrapper-col="{ offset: 4, span: 20 }">
        <a-button type="primary">
          Submit
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
```
