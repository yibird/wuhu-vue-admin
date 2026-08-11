# image Token

Use these variables through `theme.components.Image`. This document lists definitions only and does not include values.

```vue
<a-config-provider
  :theme="{
    token: {
      // Global token configuration
    },
    components: {
      Image: {
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
| `zIndexPopup` | `number` | z-index of preview popup |
| `previewOperationSize` | `number` | Size of preview operation icon |
| `previewOperationColor` | `string` | Color of preview operation icon |
| `previewOperationHoverColor` | `string` | Color of hovered preview operation icon |
| `previewOperationColorDisabled` | `string` | Disabled color of preview operation icon |
