# other status

## Description (en-US)

The `status` can be controlled by the value status, four values ​​of `active`, `expired`, `loading`, `scanned` are provided.

## Source

```vue
<script setup lang="ts">
const value = 'https://www.antdv-next.com'
</script>

<template>
  <a-flex gap="middle" wrap>
    <a-qrcode :value="value" status="loading" />
    <a-qrcode :value="value" status="expired" @refresh="() => console.log('refresh')" />
    <a-qrcode :value="value" status="scanned" />
  </a-flex>
</template>
```
