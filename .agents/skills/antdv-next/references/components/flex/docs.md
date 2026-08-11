---
title: Empty
description: Empty state placeholder.
---

## When To Use

- Good for setting spacing between elements.
- Suitable for setting various horizontal and vertical alignments.

### Difference with Space component

- Space is used to set the spacing between inline elements. It will add a wrapper element for each child element for inline alignment. Suitable for equidistant arrangement of multiple child elements in rows and columns.
- Flex is used to set the layout of block-level elements. It does not add a wrapper element. Suitable for layout of child elements in vertical or horizontal direction, and provides more flexibility and control.

## Examples

## Demos

| Demo | Path |
| --- | --- |
| basic | demo/basic.md |
| align | demo/align.md |
| gap | demo/gap.md |
| wrap | demo/wrap.md |
| combination | demo/combination.md |

## API

### Props

Common props ref：[Common props](../../docs/vue/common-props.md)

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| vertical | Is direction of the flex vertical, use `flex-direction: column` | boolean | `false` | - | ✓ |
| wrap | Set whether the element is displayed in a single line or in multiple lines | boolean \| CSSProperties['flexWrap'] | nowrap | boolean: 5.17.0 | × |
| justify | Sets the alignment of elements in the direction of the main axis | CSSProperties['justifyContent'] | normal | - | × |
| align | Sets the alignment of elements in the direction of the cross axis | CSSProperties['alignItems'] | normal | - | × |
| flex | flex CSS shorthand properties | CSSProperties['flex'] | normal | - | × |
| gap | Sets the gap between grids | CSSProperties['gap'] \| SizeType | - | - | × |
| component | custom element type | any | `div` | - | × |
