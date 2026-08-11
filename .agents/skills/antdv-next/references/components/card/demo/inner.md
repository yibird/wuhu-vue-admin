# Inner card

## Description (en-US)

It can be placed inside the ordinary card to display the information of the multilevel structure.

## Source

```vue
<template>
  <a-card title="Card title">
    <a-card type="inner" title="Inner Card title">
      <template #extra>
        <a href="#">More</a>
      </template>
      Inner Card content
    </a-card>
    <a-card style="margin-top: 16px" type="inner" title="Inner Card title">
      <template #extra>
        <a href="#">More</a>
      </template>
      Inner Card content
    </a-card>
  </a-card>
</template>
```
