# More responsive

## Description (en-US)

`span` `pull` `push` `offset` `order` can be embedded into `xs` `sm` `md` `lg` `xl` `xxl` properties to use, where `xs={6}` equals to `xs={{ span: 6 }}`.

## Source

```vue
<template>
  <a-row>
    <a-col :xs="{ span: 5, offset: 1 }" :lg="{ span: 6, offset: 2 }">
      Col
    </a-col>
    <a-col :xs="{ span: 11, offset: 1 }" :lg="{ span: 6, offset: 2 }">
      Col
    </a-col>
    <a-col :xs="{ span: 5, offset: 1 }" :lg="{ span: 6, offset: 2 }">
      Col
    </a-col>
  </a-row>
</template>
```
