# Listening for anchor link change

## Description (en-US)

Listening for anchor link change.

## Source

```vue
<script setup lang="ts">
function onChange(link: string) {
  console.log('Anchor:OnChange', link)
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
    @change="onChange"
  />
</template>
```
