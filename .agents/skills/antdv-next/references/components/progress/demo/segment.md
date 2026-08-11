# Progress bar with success segment

## Description (en-US)

Show several parts of progress with different status.

## Source

```vue
<template>
  <a-flex gap="small" vertical>
    <a-tooltip title="3 done / 3 in progress / 4 to do">
      <a-progress :percent="60" :success="{ percent: 30 }" />
    </a-tooltip>
    <a-flex gap="small" wrap>
      <a-tooltip title="3 done / 3 in progress / 4 to do">
        <a-progress type="circle" :percent="60" :success="{ percent: 30 }" />
      </a-tooltip>
      <a-tooltip title="3 done / 3 in progress / 4 to do">
        <a-progress type="dashboard" :percent="60" :success="{ percent: 30 }" />
      </a-tooltip>
    </a-flex>
  </a-flex>
</template>
```
