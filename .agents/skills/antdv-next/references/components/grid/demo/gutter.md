# Grid Gutter

## Description (en-US)

You can use the `gutter` property of `Row` as grid spacing. We recommend `(16 + 8n)px` (`n` stands for natural number).

For responsive spacing, set it as an object like `{ xs: 8, sm: 16, md: 24, lg: 32 }`.

For vertical spacing, use an array `[horizontal, vertical]`.

## Source

```vue
<template>
  <a-divider title-placement="left">
    Horizontal
  </a-divider>
  <a-row :gutter="16">
    <a-col :span="6" class="gutter-row">
      <div class="gutter-box">
        col-6
      </div>
    </a-col>
    <a-col :span="6" class="gutter-row">
      <div class="gutter-box">
        col-6
      </div>
    </a-col>
    <a-col :span="6" class="gutter-row">
      <div class="gutter-box">
        col-6
      </div>
    </a-col>
    <a-col :span="6" class="gutter-row">
      <div class="gutter-box">
        col-6
      </div>
    </a-col>
  </a-row>

  <a-divider title-placement="left">
    Responsive
  </a-divider>
  <a-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
    <a-col :span="6" class="gutter-row">
      <div class="gutter-box">
        col-6
      </div>
    </a-col>
    <a-col :span="6" class="gutter-row">
      <div class="gutter-box">
        col-6
      </div>
    </a-col>
    <a-col :span="6" class="gutter-row">
      <div class="gutter-box">
        col-6
      </div>
    </a-col>
    <a-col :span="6" class="gutter-row">
      <div class="gutter-box">
        col-6
      </div>
    </a-col>
  </a-row>

  <a-divider title-placement="left">
    Vertical
  </a-divider>
  <a-row :gutter="[16, 24]">
    <a-col :span="6" class="gutter-row">
      <div class="gutter-box">
        col-6
      </div>
    </a-col>
    <a-col :span="6" class="gutter-row">
      <div class="gutter-box">
        col-6
      </div>
    </a-col>
    <a-col :span="6" class="gutter-row">
      <div class="gutter-box">
        col-6
      </div>
    </a-col>
    <a-col :span="6" class="gutter-row">
      <div class="gutter-box">
        col-6
      </div>
    </a-col>
    <a-col :span="6" class="gutter-row">
      <div class="gutter-box">
        col-6
      </div>
    </a-col>
    <a-col :span="6" class="gutter-row">
      <div class="gutter-box">
        col-6
      </div>
    </a-col>
    <a-col :span="6" class="gutter-row">
      <div class="gutter-box">
        col-6
      </div>
    </a-col>
    <a-col :span="6" class="gutter-row">
      <div class="gutter-box">
        col-6
      </div>
    </a-col>
  </a-row>
</template>

<style scoped>
.gutter-box {
  padding: 8px 0;
  color: #fff;
  text-align: center;
  background: #0092ff;
}
</style>
```
