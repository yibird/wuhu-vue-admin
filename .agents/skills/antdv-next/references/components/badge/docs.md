---
title: Badge
description: Small numerical value or status descriptor for UI elements.
---

## When To Use 
Badge normally appears in proximity to notifications or user avatars with eye-catching appeal, typically displaying unread messages count.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Standalone | demo/no-wrapper.md |
| Overflow Count | demo/overflow.md |
| Red badge | demo/dot.md |
| Dynamic | demo/change.md |
| Clickable | demo/link.md |
| Offset | demo/offset.md |
| Size | demo/size.md |
| Status | demo/status.md |
| Colorful Badge | demo/colorful.md |
| Ribbon | demo/ribbon.md |
| Custom semantic dom styling | demo/style-class.md |
| Title | demo/title.md |

## API

### Props 
Common props ref：[Common props](../../docs/vue/common-props.md)

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| count | Number to show in badge | VueNode | - | - | × |
| showZero | Whether to show badge when `count` is zero | boolean | false | - | × |
| overflowCount | Max count to show | number | 99 | - | × |
| dot | Whether to display a red dot instead of `count` | boolean | false | - | × |
| scrollNumberPrefixCls | - | string | - | - | × |
| status | Set Badge as a status dot | PresetStatusColorType | - | - | × |
| color | Customize Badge dot color | LiteralUnion&lt;PresetColorKey&gt; | - | - | × |
| text | If `status` is set, `text` sets the display text of the status `dot` | VueNode | - | - | × |
| size | If `count` is set, `size` sets the size of badge | 'default' \| 'small' | - | - | × |
| offset | Set offset of the badge dot | [number \| string, number \| string] | - | - | × |
| title | Text to show when hovering over the badge; set `null` or `false` to remove the native title | string \| null \| false | - | null/false: 1.4.0 | × |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | BadgeClassNamesType | - | - | ✓ |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | BadgeStylesType | - | - | ✓ |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| count | Number to show in badge | () =&gt; any | - |
| text | If `status` is set, `text` sets the display text of the status `dot` | () =&gt; any | - |

## Semantic DOM

### Badge

| _semantic | demo/_semantic.md |

### BadgeRibbon

| _semantic_ribbon | demo/_semantic_ribbon.md |
