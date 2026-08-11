# Horizontal Anchor

## Description (en-US)

Horizontally aligned anchors

## Source

```vue
<template>
  <div>
    <div style="padding: 20px">
      <a-anchor
        direction="horizontal"
        :items="[
          {
            key: 'part-1',
            href: '#part-1',
            title: 'Part 1',
          },
          {
            key: 'part-2',
            href: '#part-2',
            title: 'Part 2',
          },
          {
            key: 'part-3',
            href: '#part-3',
            title: 'Part 3',
          },
        ]"
      />
    </div>
    <div>
      <div
        id="part-1"
        style="width: 100vw; height: 100vh; text-align: center; background: rgba(0, 255, 0, 0.02)"
      />
      <div
        id="part-2"
        style="width: 100vw; height: 100vh; text-align: center; background: rgba(0, 0, 255, 0.02)"
      />
      <div
        id="part-3"
        style="width: 100vw; height: 100vh; text-align: center; background: #fffbe9"
      />
    </div>
  </div>
</template>
```
