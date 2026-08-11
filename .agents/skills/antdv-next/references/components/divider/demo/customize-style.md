# Style Customization

## Description (en-US)

Customize the style of the divider.

## Source

```vue
<template>
  <a-divider :style="{ borderWidth: '2px', borderColor: '#7cb305' }" />
  <a-divider :style="{ borderColor: '#7cb305' }" dashed />
  <a-divider :style="{ borderColor: '#7cb305' }" dashed>
    Text
  </a-divider>
  <a-divider type="vertical" :style="{ height: '60px', borderColor: '#7cb305' }" />
  <a-divider type="vertical" :style="{ height: '60px', borderColor: '#7cb305' }" dashed />

  <div :style="{ display: 'flex', flexDirection: 'column', height: '50px', boxShadow: '0 0 1px red' }">
    <a-divider :style="{ background: 'rgba(0,255,0,0.05)' }" title-placement="left">
      Text
    </a-divider>
  </div>
</template>
```
