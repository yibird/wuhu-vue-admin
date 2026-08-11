# Unit

## Description (en-US)

Add unit through `prefix` and `suffix`.

## Source

```vue
<script lang="ts" setup>
import { LikeOutlined } from '@antdv-next/icons'
</script>

<template>
  <a-row :gutter="16">
    <a-col :span="12">
      <a-statistic title="Feedback" :value="1128">
        <template #prefix>
          <LikeOutlined />
        </template>
      </a-statistic>
    </a-col>
    <a-col :span="12">
      <a-statistic title="Unmerged" :value="93" suffix="/ 100" />
    </a-col>
  </a-row>
</template>
```
