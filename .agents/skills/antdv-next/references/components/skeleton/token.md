# skeleton Token

Use these variables through `theme.components.Skeleton`. This document lists definitions only and does not include values.

```vue
<a-config-provider
  :theme="{
    token: {
      // Global token configuration
    },
    components: {
      Skeleton: {
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
| `gradientFromColor` | `string` | Start color of gradient |
| `gradientToColor` | `string` | End color of gradient |
| `titleHeight` | `string \| number` | Height of title skeleton |
| `blockRadius` | `number` | Border radius of skeleton |
| `paragraphMarginTop` | `number` | Margin top of paragraph skeleton |
| `paragraphLiHeight` | `number` | Line height of paragraph skeleton |
