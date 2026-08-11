# Typesetting

## Description (en-US)

Basic layout.

Child elements are aligned in the parent by `start`, `center`, `end`, `space-between`, `space-around`, and `space-evenly`.

## Source

```vue
<template>
  <a-divider title-placement="left">
    sub-element align left
  </a-divider>
  <a-row justify="start">
    <a-col :span="4">
      col-4
    </a-col>
    <a-col :span="4">
      col-4
    </a-col>
    <a-col :span="4">
      col-4
    </a-col>
    <a-col :span="4">
      col-4
    </a-col>
  </a-row>

  <a-divider title-placement="left">
    sub-element align center
  </a-divider>
  <a-row justify="center">
    <a-col :span="4">
      col-4
    </a-col>
    <a-col :span="4">
      col-4
    </a-col>
    <a-col :span="4">
      col-4
    </a-col>
    <a-col :span="4">
      col-4
    </a-col>
  </a-row>

  <a-divider title-placement="left">
    sub-element align right
  </a-divider>
  <a-row justify="end">
    <a-col :span="4">
      col-4
    </a-col>
    <a-col :span="4">
      col-4
    </a-col>
    <a-col :span="4">
      col-4
    </a-col>
    <a-col :span="4">
      col-4
    </a-col>
  </a-row>

  <a-divider title-placement="left">
    sub-element monospaced arrangement
  </a-divider>
  <a-row justify="space-between">
    <a-col :span="4">
      col-4
    </a-col>
    <a-col :span="4">
      col-4
    </a-col>
    <a-col :span="4">
      col-4
    </a-col>
    <a-col :span="4">
      col-4
    </a-col>
  </a-row>

  <a-divider title-placement="left">
    sub-element align full
  </a-divider>
  <a-row justify="space-around">
    <a-col :span="4">
      col-4
    </a-col>
    <a-col :span="4">
      col-4
    </a-col>
    <a-col :span="4">
      col-4
    </a-col>
    <a-col :span="4">
      col-4
    </a-col>
  </a-row>

  <a-divider title-placement="left">
    sub-element align evenly
  </a-divider>
  <a-row justify="space-evenly">
    <a-col :span="4">
      col-4
    </a-col>
    <a-col :span="4">
      col-4
    </a-col>
    <a-col :span="4">
      col-4
    </a-col>
    <a-col :span="4">
      col-4
    </a-col>
  </a-row>
</template>
```
