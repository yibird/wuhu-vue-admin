# Status

## Description (en-US)

Add status to TreeSelect with `status`, which could be `error` or `warning`.

## Source

```vue
<template>
  <a-space direction="vertical" style="width: 100%">
    <a-tree-select status="error" style="width: 100%" placeholder="Error" />
    <a-tree-select status="warning" style="width: 100%" multiple placeholder="Warning multiple" />
  </a-space>
</template>
```
