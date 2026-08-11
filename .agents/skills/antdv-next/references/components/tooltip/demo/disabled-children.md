# Disabled children

## Description (en-US)

Disabled wrapper.

## Source

```vue
<script setup lang="ts">
const selectOptions = [
  { value: 'option', label: 'Option' },
]
</script>

<template>
  <a-space>
    <a-tooltip title="Thanks for using antd. Have a nice day !">
      <a-button disabled>
        Disabled
      </a-button>
    </a-tooltip>
    <a-tooltip title="Thanks for using antd. Have a nice day !">
      <a-input disabled placeholder="disabled" />
    </a-tooltip>
    <a-tooltip title="Thanks for using antd. Have a nice day !">
      <a-input-number disabled :value="1" />
    </a-tooltip>
    <a-tooltip title="Thanks for using antd. Have a nice day !">
      <a-checkbox disabled />
    </a-tooltip>
    <a-tooltip title="Thanks for using antd. Have a nice day !">
      <a-select disabled :options="selectOptions" :value="selectOptions[0].value" />
    </a-tooltip>
  </a-space>
</template>
```
