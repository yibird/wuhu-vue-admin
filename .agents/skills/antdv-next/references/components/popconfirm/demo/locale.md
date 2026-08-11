# Locale text

## Description (en-US)

Set `okText` and `cancelText` props to customize the button's labels.

## Source

```vue
<template>
  <a-popconfirm
    title="Delete the task"
    description="Are you sure to delete this task?"
    ok-text="Yes"
    cancel-text="No"
  >
    <a-button danger>
      Delete
    </a-button>
  </a-popconfirm>
</template>
```
