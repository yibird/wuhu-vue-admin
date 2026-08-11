# Callback

## Description (en-US)

Callback with affixed state.

## Source

```vue
<template>
  <a-affix :offset-top="120" @change="(affixed) => console.log(affixed)">
    <a-button>
      120px to affix top
    </a-button>
  </a-affix>
</template>
```
