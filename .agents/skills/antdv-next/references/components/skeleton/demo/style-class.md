# Custom semantic dom styling

## Description (en-US)

## Source

```vue
<script setup lang="ts">
const classes = {
  root: 'skeleton-root',
  header: 'skeleton-header',
}

const styles = {
  avatar: {
    border: '1px solid #aaa',
  },
  title: {
    border: '1px solid #aaa',
  },
}

function stylesFn(info: { props: { active?: boolean } }) {
  if (info.props?.active) {
    return {
      root: {
        border: '1px solid rgba(229, 243, 254, 0.3)',
      },
      title: {
        backgroundColor: 'rgba(229, 243, 254, 0.5)',
        height: '20px',
        borderRadius: '20px',
      },
    }
  }
  return {}
}
</script>

<template>
  <a-flex gap="middle">
    <a-skeleton
      :classes="classes"
      :styles="styles"
      avatar
      :paragraph="false"
    />
    <a-skeleton
      :classes="{ ...classes, paragraph: 'skeleton-paragraph' }"
      :styles="stylesFn"
      active
    />
  </a-flex>
</template>

<style scoped>
.skeleton-root {
  border-radius: 10px;
  padding: 12px;
}

.skeleton-header {
  margin-bottom: 12px;
}

.skeleton-paragraph > li {
  background-color: rgba(229, 243, 254, 0.5);
}
</style>
```
