# Flex Responsive

## Description (en-US)

Support flexible responsive flex ratios, which require CSS Variables support in the browser.

## Source

```vue
<script setup lang="ts">
const columns = Array.from({ length: 10 }, (_, index) => index)
</script>

<template>
  <a-row>
    <a-col
      v-for="index in columns"
      :key="`col-${index}`"
      :xs="{ flex: '100%' }"
      :sm="{ flex: '50%' }"
      :md="{ flex: '40%' }"
      :lg="{ flex: '20%' }"
      :xl="{ flex: '10%' }"
      class="flex-col"
    >
      Col
    </a-col>
  </a-row>
</template>

<style scoped>
.flex-col {
  padding: 8px 0;
  color: #fff;
  text-align: center;
  background: #0092ff;
}
</style>
```
