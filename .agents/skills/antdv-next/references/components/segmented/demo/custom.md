# Custom Render

## Description (en-US)

Custom each Segmented Item.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const spring = ref('spring')
</script>

<template>
  <a-segmented
    :options="[
      {
        value: 'user1',
        tooltip: { title: 'hello user1', color: 'gold' },
      },
      {
        value: 'user2',
        tooltip: { title: 'hello user2', color: 'pink' },
      },
      {
        value: 'user3',
        tooltip: { title: 'hello user3', color: 'geekblue' },
      },
    ]"
  >
    <template #labelRender="{ value }">
      <template v-if="value === 'user1'">
        <div style="padding: 4px">
          <a-avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
          <div>User 1</div>
        </div>
      </template>
      <template v-else-if="value === 'user2'">
        <div style="padding: 4px">
          <a-avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
          <div>User 2</div>
        </div>
      </template>
      <template v-else-if="value === 'user3'">
        <div style="padding: 4px">
          <a-avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
          <div>User 3</div>
        </div>
      </template>
    </template>
  </a-segmented>
  <br>
  <br>
  <a-segmented
    v-model:value="spring"
    :options="[
      {
        value: 'spring',
      },
      {
        value: 'summer',
      },
      {
        value: 'autumn',
      },
      {
        value: 'winter',
      },
    ]"
  >
    <template #labelRender="{ value }">
      <template v-if="value === 'spring'">
        <div style="padding: 4px">
          <div>Spring</div>
          <div>Jan-Mar</div>
        </div>
      </template>
      <template v-else-if="value === 'summer'">
        <div style="padding: 4px">
          <div>Summer</div>
          <div>Apr-Jun</div>
        </div>
      </template>
      <template v-else-if="value === 'autumn'">
        <div style="padding: 4px">
          <div>Autumn</div>
          <div>Jul-Sept</div>
        </div>
      </template>
      <template v-else-if="value === 'winter'">
        <div style="padding: 4px">
          <div>Winter</div>
          <div>Oct-Dec</div>
        </div>
      </template>
    </template>
  </a-segmented>
</template>
```
