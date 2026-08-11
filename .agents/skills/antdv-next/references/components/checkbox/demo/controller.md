# Controlled Checkbox

## Description (en-US)

Communicated with other components.

## Source

```vue
<script setup lang="ts">
import { computed, shallowRef } from 'vue'

const checked = shallowRef(true)
const disabled = shallowRef(false)

function toggleChecked() {
  checked.value = !checked.value
}

function toggleDisable() {
  disabled.value = !disabled.value
}

function onChange(e: any) {
  console.log('checked = ', e.target.checked)
  checked.value = e.target.checked
}

const label = computed(() => `${checked.value ? 'Checked' : 'Unchecked'}-${disabled.value ? 'Disabled' : 'Enabled'}`)
</script>

<template>
  <p style="margin-bottom: 20px">
    <a-checkbox
      :checked="checked"
      :disabled="disabled"
      @change="onChange"
    >
      {{ label }}
    </a-checkbox>
  </p>
  <p>
    <a-button type="primary" size="small" @click="toggleChecked">
      {{ !checked ? 'Check' : 'Uncheck' }}
    </a-button>
    <a-button style="margin: 0 10px" type="primary" size="small" @click="toggleDisable">
      {{ !disabled ? 'Disable' : 'Enable' }}
    </a-button>
  </p>
</template>
```
