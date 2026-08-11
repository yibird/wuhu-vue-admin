# notification Token

Use these variables through `theme.components.Notification`. This document lists definitions only and does not include values.

```vue
<a-config-provider
  :theme="{
    token: {
      // Global token configuration
    },
    components: {
      Notification: {
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
| `zIndexPopup` | `number` | z-index of Notification |
| `width` | `string \| number` | Width of Notification |
| `progressBg` | `string` | Background color of Notification progress bar |
| `colorSuccessBg` | `string \| undefined` | Background color of success notification container |
| `colorErrorBg` | `string \| undefined` | Background color of error notification container |
| `colorInfoBg` | `string \| undefined` | Background color of info notification container |
| `colorWarningBg` | `string \| undefined` | Background color of warning notification container |
