# Column offset

## Description (en-US)

`offset` can set the column to the right side. For example, `offset={4}` shifts the element to the right by four columns.

## Source

```vue
<template>
  <a-row>
    <a-col :span="8">
      col-8
    </a-col>
    <a-col :span="8" :offset="8">
      col-8
    </a-col>
  </a-row>
  <a-row>
    <a-col :span="6" :offset="6">
      col-6 col-offset-6
    </a-col>
    <a-col :span="6" :offset="6">
      col-6 col-offset-6
    </a-col>
  </a-row>
  <a-row>
    <a-col :span="12" :offset="6">
      col-12 col-offset-6
    </a-col>
  </a-row>
</template>
```
