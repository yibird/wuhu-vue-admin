# Handle Form Data Manually

## Description (en-US)

Handle validation manually without form binding.

## Source

```vue
<script setup lang="ts">
import { reactive } from 'vue'

const tips = 'A prime is a natural number greater than 1 that has no positive divisors other than 1 and itself.'

type LocalValidateStatus = 'success' | 'warning' | 'error' | 'validating' | ''

const state = reactive<{ value: number, validateStatus?: LocalValidateStatus, errorMsg?: string | null }>({
  value: 11,
})

function validatePrimeNumber(number: number) {
  if (number === 11) {
    state.validateStatus = 'success'
    state.errorMsg = null
    return
  }
  state.validateStatus = 'error'
  state.errorMsg = 'The prime between 8 and 12 is 11!'
}

function handleChange(value: number | null) {
  state.value = value ?? 0
  validatePrimeNumber(state.value)
}

validatePrimeNumber(state.value)
</script>

<template>
  <a-form style="max-width: 600px">
    <a-form-item
      :label-col="{ span: 7 }"
      :wrapper-col="{ span: 12 }"
      label="Prime between 8 & 12"
      :validate-status="state.validateStatus"
      :help="state.errorMsg || tips"
    >
      <a-input-number :min="8" :max="12" :value="state.value" @change="handleChange" />
    </a-form-item>
  </a-form>
</template>
```
