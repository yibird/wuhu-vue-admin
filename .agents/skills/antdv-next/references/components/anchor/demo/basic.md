# Basic

## Description (en-US)

The simplest usage.

## Source

```vue
<template>
  <a-row>
    <a-col :span="16">
      <div id="part-1" style="height: 100vh;background: rgba(255,0,0,0.02)" />
      <div id="part-2" style="height: 100vh;background: rgba(0,255,0,0.02)" />
      <div id="part-3" style="height: 100vh;background: rgba(0,0,255,0.02)" />
    </a-col>
    <a-col :span="8">
      <a-anchor
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
    </a-col>
  </a-row>
</template>
```
