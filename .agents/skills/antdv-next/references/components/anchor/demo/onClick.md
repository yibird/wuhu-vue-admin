# Customize the onClick event

## Description (en-US)

Clicking on an anchor does not record history.

## Source

```vue
<script setup lang="ts">
function handleClick(e: MouseEvent, link: {
  title: any
  href: string
}) {
  e.preventDefault()
  console.log(link)
}
</script>

<template>
  <a-anchor
    :affix="false"
    :items="[
      {
        key: '1',
        href: '#anchor-demo-basic',
        title: 'Basic demo',
      },
      {
        key: '2',
        href: '#anchor-demo-static',
        title: 'Static demo',
      },
      {
        key: '3',
        href: '#api',
        title: 'API',
        children: [
          {
            key: '4',
            href: '#anchor-props',
            title: 'Anchor Props',
          },
          {
            key: '5',
            href: '#link-props',
            title: 'Link Props',
          },
        ],
      },
    ]"
    @click="handleClick"
  />
</template>
```
