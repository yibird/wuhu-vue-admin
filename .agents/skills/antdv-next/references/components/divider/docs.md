---
title: Divider
description: A divider line separates different content.
---

## When To Use

- Divide sections of an article.
- Divide inline text and links such as the operation column of table.

## Examples

## Demos

| Demo | Path |
| --- | --- |
| Horizontal | demo/horizontal.md |
| Divider with title | demo/with-text.md |
| Vertical | demo/vertical.md |
| Text without heading style | demo/plain.md |
| Variant | demo/variant.md |
| Set the spacing size of the divider | demo/size.md |
| Style Customization | demo/customize-style.md |
| Custom semantic dom styling | demo/style-calss.md |

## API

### Props

Common props ref：[Common props](../../docs/vue/common-props.md)

| Property | Description | Type | Default | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- |
| dashed | Whether line is dashed | boolean | false | × |
| orientation | Whether line is horizontal or vertical | `horizontal` \| `vertical` | `horizontal` | × |
| plain | Divider text show as plain style | boolean | true | × |
| size | The size of divider. Only valid for horizontal layout | `small` \| `middle` \| `large` | - | × |
| titlePlacement | The position of title inside divider | `start` \| `end` \| `center` | `center` | × |
| variant | Whether line is dashed, dotted or solid | `dashed` \| `dotted` \| `solid` | `solid` | × |
| vertical | Orientation, Simultaneously configure with `orientation` and prioritize `orientation` | boolean | false | × |

## Semantic DOM

| _semantic | demo/_semantic.md |
