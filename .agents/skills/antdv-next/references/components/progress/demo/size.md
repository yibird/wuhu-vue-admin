# Progress size

## Description (en-US)

The size of progress.

## Source

```vue
<template>
  <a-flex vertical gap="middle">
    <a-flex vertical gap="small" style="width: 300px">
      <a-progress :percent="50" />
      <a-progress :percent="50" size="small" />
      <a-progress :percent="50" :size="[300, 20]" />
    </a-flex>
    <a-flex align="center" wrap :gap="30">
      <a-progress type="circle" :percent="50" />
      <a-progress type="circle" :percent="50" size="small" />
      <a-progress type="circle" :percent="50" :size="20" />
    </a-flex>
    <a-flex align="center" wrap :gap="30">
      <a-progress type="dashboard" :percent="50" />
      <a-progress type="dashboard" :percent="50" size="small" />
      <a-progress type="dashboard" :percent="50" :size="20" />
    </a-flex>
    <a-flex align="center" wrap :gap="30">
      <a-progress :steps="3" :percent="50" />
      <a-progress :steps="3" :percent="50" size="small" />
      <a-progress :steps="3" :percent="50" :size="20" />
      <a-progress :steps="3" :percent="50" :size="[20, 30]" />
    </a-flex>
  </a-flex>
</template>
```
