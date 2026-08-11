# Grid sort

## Description (en-US)

By using `push` and `pull`, you can easily change column order.

## Source

```vue
<template>
  <a-row>
    <a-col :span="18" :push="6">
      col-18 col-push-6
    </a-col>
    <a-col :span="6" :pull="18">
      col-6 col-pull-18
    </a-col>
  </a-row>
</template>
```
