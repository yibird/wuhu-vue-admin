# Custom semantic dom styling

## Description (en-US)

Custom semantic dom styling.

## Source

```vue
<script setup lang="ts">
const classes = {
  root: 'empty-demo-root',
  image: 'empty-demo-image',
  description: 'empty-demo-description',
  footer: 'empty-demo-footer',
}

const styles = {
  root: { padding: '24px', background: '#fafafa' },
  image: { height: '60px' },
}
</script>

<template>
  <a-empty
    description="No Data"
    :classes="classes"
    :styles="styles"
  >
    <a-button type="primary">
      Create
    </a-button>
  </a-empty>
</template>

<style scoped>
.empty-demo-root {
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
}

.empty-demo-description {
  color: #1677ff;
}

.empty-demo-footer :deep(.ant-btn) {
  border-radius: 999px;
}
</style>
```
