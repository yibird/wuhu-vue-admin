# Loop Banner

## Description (en-US)

Use CSS animation to create a loop banner.

## Source

```vue
<template>
  <a-alert banner>
    <template #title>
      <div class="alert-marquee">
        <div class="alert-marquee__content">
          I can be a Vue component, multiple components, or just some text.
        </div>
      </div>
    </template>
  </a-alert>
</template>

<style scoped>
.alert-marquee {
  overflow: hidden;
  white-space: nowrap;
}

.alert-marquee__content {
  display: inline-block;
  min-width: 100%;
  animation: alert-marquee 12s linear infinite;
}

.alert-marquee:hover .alert-marquee__content {
  animation-play-state: paused;
}

@keyframes alert-marquee {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
```
