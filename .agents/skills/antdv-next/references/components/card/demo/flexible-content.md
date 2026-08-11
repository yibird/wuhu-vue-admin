# Customized content

## Description (en-US)

You can use `a-card-meta` to support more flexible content.

## Source

```vue
<template>
  <a-card hoverable variant="borderless" style="width: 240px">
    <template #cover>
      <img
        draggable="false"
        alt="example"
        src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
      >
    </template>
    <a-card-meta title="Europe Street beat" description="www.instagram.com" />
  </a-card>
</template>
```
