# button Token

Use these variables through `theme.components.Button`. This document lists definitions only and does not include values.

```vue
<a-config-provider
  :theme="{
    token: {
      // Global token configuration
    },
    components: {
      Button: {
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
| `fontWeight` | `CSSProperties` | Font weight of text |
| `iconGap` | `CSSProperties` | Gap between icon and text |
| `defaultShadow` | `string` | Shadow of default button |
| `primaryShadow` | `string` | Shadow of primary button |
| `dangerShadow` | `string` | Shadow of danger button |
| `primaryColor` | `string` | Text color of primary button |
| `defaultColor` | `string` | Text color of default button |
| `defaultBg` | `string` | Background color of default button |
| `defaultBorderColor` | `string` | Border color of default button |
| `dangerColor` | `string` | Text color of danger button |
| `defaultHoverBg` | `string` | Background color of default button when hover |
| `defaultHoverColor` | `string` | Text color of default button when hover |
| `defaultHoverBorderColor` | `string` | Border color of default button |
| `defaultActiveBg` | `string` | Background color of default button when active |
| `defaultActiveColor` | `string` | Text color of default button when active |
| `defaultActiveBorderColor` | `string` | Border color of default button when active |
| `defaultGhostColor` | `string` | Text color of default ghost button |
| `ghostBg` | `string` | Background color of ghost button |
| `defaultGhostBorderColor` | `string` | Border color of default ghost button |
| `solidTextColor` | `string` | Default text color for solid buttons. |
| `textTextColor` | `string` | Default text color for text buttons |
| `textTextHoverColor` | `string` | Default text color for text buttons on hover |
| `textTextActiveColor` | `string` | Default text color for text buttons on active |
| `paddingInline` | `CSSProperties` | Horizontal padding of button |
| `paddingInlineLG` | `CSSProperties` | Horizontal padding of large button |
| `paddingInlineSM` | `CSSProperties` | Horizontal padding of small button |
| `onlyIconSize` | `string \| number` | Icon size of button which only contains icon |
| `onlyIconSizeLG` | `string \| number` | Icon size of large button which only contains icon |
| `onlyIconSizeSM` | `string \| number` | Icon size of small button which only contains icon |
| `linkHoverBg` | `string` | Background color of link button when hover |
| `textHoverBg` | `string` | Background color of text button when hover |
| `contentFontSize` | `number` | Font size of button content |
| `contentFontSizeLG` | `number` | Font size of large button content |
| `contentFontSizeSM` | `number` | Font size of small button content |
| `defaultBgDisabled` | `string` | - |
| `dashedBgDisabled` | `string` | - |
