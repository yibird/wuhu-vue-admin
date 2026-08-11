# Position

## Description (en-US)

There are 4 position options available.

## Source

```vue
<script setup lang="ts">
import type { CarouselProps } from 'antdv-next'
import { ref } from 'vue'

type DotPlacement = CarouselProps['dotPlacement']

const dotPlacement = ref<DotPlacement>('top')
</script>

<template>
  <a-radio-group v-model:value="dotPlacement" style="margin-bottom: 8px">
    <a-radio-button value="top">
      Top
    </a-radio-button>
    <a-radio-button value="bottom">
      Bottom
    </a-radio-button>
    <a-radio-button value="start">
      Start
    </a-radio-button>
    <a-radio-button value="end">
      End
    </a-radio-button>
  </a-radio-group>
  <a-carousel :dot-placement="dotPlacement">
    <div>
      <h3 class="custom-carousel-item">
        1
      </h3>
    </div>
    <div>
      <h3 class="custom-carousel-item">
        2
      </h3>
    </div>
    <div>
      <h3 class="custom-carousel-item">
        3
      </h3>
    </div>
    <div>
      <h3 class="custom-carousel-item">
        4
      </h3>
    </div>
  </a-carousel>
</template>
```
