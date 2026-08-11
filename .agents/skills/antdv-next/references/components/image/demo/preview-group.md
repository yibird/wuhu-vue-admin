# Multiple image preview

## Description (en-US)

Click the left and right switch buttons to preview multiple images.

## Source

```vue
<template>
  <a-image-preview-group>
    <a-image
      alt="svg image"
      :width="200"
      src="https://www.antdv-next.com/antdv-next.svg"
    />
    <a-image
      :width="200"
      alt="svg image"
      src="https://cn.vuejs.org/logo.svg"
    />
  </a-image-preview-group>
</template>
```
