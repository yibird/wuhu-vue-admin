# Customized Validation

## Description (en-US)

Custom validation status display.

## Source

```vue
<script setup lang="ts">
import { SmileOutlined } from '@antdv-next/icons'
</script>

<template>
  <a-form
    :label-col="{ xs: { span: 24 }, sm: { span: 6 } }"
    :wrapper-col="{ xs: { span: 24 }, sm: { span: 14 } }"
    style="max-width: 600px"
  >
    <a-form-item
      label="Fail"
      validate-status="error"
      help="Should be combination of numbers & alphabets"
    >
      <a-input placeholder="unavailable choice" />
    </a-form-item>

    <a-form-item label="Warning" validate-status="warning">
      <a-input placeholder="Warning">
        <template #prefix>
          <SmileOutlined />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item
      label="Validating"
      has-feedback
      validate-status="validating"
      help="The information is being validated..."
    >
      <a-input placeholder="I'm the content is being validated" />
    </a-form-item>

    <a-form-item label="Success" has-feedback validate-status="success">
      <a-input placeholder="I'm the content" />
    </a-form-item>

    <a-form-item label="Error" has-feedback validate-status="error">
      <a-date-picker style="width: 100%" />
    </a-form-item>

    <a-form-item label="Warning" has-feedback validate-status="warning">
      <a-select
        placeholder="I'm Select"
        :options="[
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' },
        ]"
      />
    </a-form-item>

    <a-form-item label="Success" has-feedback validate-status="success">
      <a-input-number style="width: 100%" />
    </a-form-item>

    <a-form-item label="Fail" validate-status="error" has-feedback>
      <a-textarea allow-clear show-count />
    </a-form-item>
  </a-form>
</template>
```
