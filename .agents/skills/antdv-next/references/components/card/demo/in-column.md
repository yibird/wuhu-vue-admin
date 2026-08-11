# Card in column

## Description (en-US)

Cards usually cooperate with grid column layout in overview page.

## Source

```vue
<template>
  <div class="w-full h-400px" style="background-color: rgb(240, 242, 245)">
    <a-row :gutter="16">
      <a-col :span="8">
        <a-card title="Card title" variant="borderless">
          Card content
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="Card title" variant="borderless">
          Card content
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="Card title" variant="borderless">
          Card content
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
```
