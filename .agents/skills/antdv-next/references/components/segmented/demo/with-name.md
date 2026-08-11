# With name

## Description (en-US)

Passing the name property to all input[type="radio"] that are in the same Segmented. It is usually used to let the browser see your Segmented as a real "group" and keep the default behavior. For example, using left/right keyboard arrow to change your selection that in the same Segmented.

## Source

```vue
<script lang="ts" setup>
import { ref } from 'vue'

const value = ref('Weekly')
</script>

<template>
  <a-segmented v-model:value="value" :options="['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']" name="group" />
</template>
```
