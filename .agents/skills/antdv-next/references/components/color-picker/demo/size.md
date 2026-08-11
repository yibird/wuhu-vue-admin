# Trigger size

## Description (en-US)

Antdv Next supports three trigger sizes: small, default and large.

If a large or small trigger is desired, set the `size` property to either `large` or `small` respectively. Omit the `size` property for a trigger with the default size.

## Source

```vue
<template>
  <a-space>
    <a-space vertical>
      <a-color-picker default-value="#1677ff" size="small" />
      <a-color-picker default-value="#1677ff" />
      <a-color-picker default-value="#1677ff" size="large" />
    </a-space>
    <a-space vertical>
      <a-color-picker default-value="#1677ff" size="small" show-text />
      <a-color-picker default-value="#1677ff" show-text />
      <a-color-picker default-value="#1677ff" size="large" show-text />
    </a-space>
  </a-space>
</template>
```
