# Simple mode

## Description (en-US)

Simple mode.

## Source

```vue
<template>
  <a-space direction="vertical" size="middle" style="width: 100%">
    <a-pagination simple :default-current="2" :total="50" />
    <a-pagination :simple="{ readOnly: true }" :default-current="2" :total="50" />
    <a-pagination simple :default-current="2" :total="50" disabled />
  </a-space>
</template>
```
