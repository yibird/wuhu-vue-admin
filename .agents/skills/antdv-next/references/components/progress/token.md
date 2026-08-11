# progress Token

Use these variables through `theme.components.Progress`. This document lists definitions only and does not include values.

```vue
<a-config-provider
  :theme="{
    token: {
      // Global token configuration
    },
    components: {
      Progress: {
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
| `defaultColor` | `string` | Default color of progress bar |
| `remainingColor` | `string` | Color of remaining part of progress bar |
| `circleTextColor` | `string` | Text color of circular progress bar |
| `lineBorderRadius` | `number` | Border radius of line progress bar |
| `circleTextFontSize` | `string` | Text size of circular progress bar |
| `circleIconFontSize` | `string` | Icon size of circular progress bar |
