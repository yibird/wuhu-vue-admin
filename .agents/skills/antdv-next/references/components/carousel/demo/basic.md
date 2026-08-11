# Basic

## Description (en-US)

Basic usage.

## Source

```vue
<script setup lang="ts">
function onChange(currentSlide: number) {
  console.log('current slide is', currentSlide)
}
</script>

<template>
  <a-carousel :after-change="onChange">
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
