# Extra Footer

## Description (en-US)

Render extra footer in panel for customized requirements.

## Source

```vue
<template>
  <a-space vertical :size="12">
    <a-date-picker>
      <template #renderExtraFooter>
        extra footer
      </template>
    </a-date-picker>
    <a-date-picker show-time>
      <template #renderExtraFooter>
        extra footer
      </template>
    </a-date-picker>
    <a-range-picker>
      <template #renderExtraFooter>
        extra footer
      </template>
    </a-range-picker>
    <a-range-picker show-time>
      <template #renderExtraFooter>
        extra footer
      </template>
    </a-range-picker>
    <a-date-picker picker="month">
      <template #renderExtraFooter>
        extra footer
      </template>
    </a-date-picker>
  </a-space>
</template>
```
