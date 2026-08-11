# Disabled

## Description (en-US)

To mark a button as disabled, add the `disabled` property to the `Button`.

## Source

```vue
<template>
  <a-flex gap="small" align="flex-start" vertical>
    <a-flex gap="small">
      <a-button type="primary">
        Primary
      </a-button>
      <a-button type="primary" disabled>
        Primary(disabled)
      </a-button>
    </a-flex>
    <a-flex gap="small">
      <a-button>Default</a-button>
      <a-button disabled>
        Default(disabled)
      </a-button>
    </a-flex>
    <a-flex gap="small">
      <a-button type="dashed">
        Dashed
      </a-button>
      <a-button type="dashed" disabled>
        Dashed(disabled)
      </a-button>
    </a-flex>
    <a-flex gap="small">
      <a-button type="text">
        Text
      </a-button>
      <a-button type="text" disabled>
        Text(disabled)
      </a-button>
    </a-flex>
    <a-flex gap="small">
      <a-button type="link">
        Link
      </a-button>
      <a-button type="link" disabled>
        Link(disabled)
      </a-button>
    </a-flex>
    <a-flex gap="small">
      <a-button type="primary" href="https://antdv-next.com/index-cn">
        Href Primary
      </a-button>
      <a-button type="primary" href="https://antdv-next.com/index-cn" disabled>
        Href Primary(disabled)
      </a-button>
    </a-flex>
    <a-flex gap="small">
      <a-button danger>
        Danger Default
      </a-button>
      <a-button danger disabled>
        Danger Default(disabled)
      </a-button>
    </a-flex>
    <a-flex gap="small">
      <a-button danger type="text">
        Danger Text
      </a-button>
      <a-button danger type="text" disabled>
        Danger Text(disabled)
      </a-button>
    </a-flex>
    <a-flex gap="small">
      <a-button type="link" danger>
        Danger Link
      </a-button>
      <a-button type="link" danger disabled>
        Danger Link(disabled)
      </a-button>
    </a-flex>
    <a-flex gap="small" class="site-button-ghost-wrapper">
      <a-button ghost>
        Ghost
      </a-button>
      <a-button ghost disabled>
        Ghost(disabled)
      </a-button>
    </a-flex>
  </a-flex>
</template>
```
