# Flex Stretch

## Description (en-US)

Col provides `flex` to support filling the rest space.

## Source

```vue
<template>
  <a-divider title-placement="left">
    Percentage columns
  </a-divider>
  <a-row>
    <a-col :flex="2" class="flex-col">
      2 / 5
    </a-col>
    <a-col :flex="3" class="flex-col">
      3 / 5
    </a-col>
  </a-row>

  <a-divider title-placement="left">
    Fill rest
  </a-divider>
  <a-row>
    <a-col flex="100px" class="flex-col">
      100px
    </a-col>
    <a-col flex="auto" class="flex-col">
      Fill Rest
    </a-col>
  </a-row>

  <a-divider title-placement="left">
    Raw flex style
  </a-divider>
  <a-row>
    <a-col flex="1 1 200px" class="flex-col">
      1 1 200px
    </a-col>
    <a-col flex="0 1 300px" class="flex-col">
      0 1 300px
    </a-col>
  </a-row>

  <a-row :wrap="false">
    <a-col flex="none" class="flex-col">
      <div class="flex-none">
        none
      </div>
    </a-col>
    <a-col flex="auto" class="flex-col">
      auto with no-wrap
    </a-col>
  </a-row>
</template>

<style scoped>
.flex-col {
  padding: 8px 0;
  color: #fff;
  text-align: center;
  background: #0092ff;
}
.flex-none {
  padding: 0 16px;
}
</style>
```
