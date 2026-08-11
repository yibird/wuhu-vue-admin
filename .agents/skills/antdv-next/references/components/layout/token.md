# layout Token

Use these variables through `theme.components.Layout`. This document lists definitions only and does not include values.

```vue
<a-config-provider
  :theme="{
    token: {
      // Global token configuration
    },
    components: {
      Layout: {
        // Token name: value
      },
    },
  }"
>
  ...
</a-config-provider>
```

## Token List

| Token | Type | Description |
| --- | --- | --- |
| `bodyBg` | `string` | Background Color of body |
| `headerBg` | `string` | Background Color of header |
| `headerHeight` | `string \| number` | Height of header |
| `headerPadding` | `CSSProperties` | Padding of header |
| `headerColor` | `string` | Text color of header |
| `footerPadding` | `CSSProperties` | Padding of footer |
| `footerBg` | `string` | Background Color of footer |
| `siderBg` | `string` | Background Color of sider |
| `triggerHeight` | `string \| number` | Height of sider trigger |
| `triggerBg` | `string` | Background Color of sider trigger |
| `triggerColor` | `string` | Color of sider trigger |
| `zeroTriggerWidth` | `number` | Width of sider trigger when collapse is 0 |
| `zeroTriggerHeight` | `number` | Height of sider trigger when collapse is 0 |
| `lightSiderBg` | `string` | Background Color of light theme sider |
| `lightTriggerBg` | `string` | Background Color of light theme sider trigger |
| `lightTriggerColor` | `string` | Color of light theme sider trigger |
