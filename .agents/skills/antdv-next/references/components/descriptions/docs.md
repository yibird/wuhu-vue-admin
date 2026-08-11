---
title: Descriptions
description: Display multiple read-only fields in a group.
---

## When To Use

Commonly displayed on the details page.

## Examples

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| border | demo/border.md |
| Custom size | demo/size.md |
| responsive | demo/responsive.md |
| Vertical | demo/vertical.md |
| Vertical border | demo/vertical-border.md |
| SFC Mode | demo/sfc.md |
| Custom semantic dom styling | demo/style-class.md |
| row | demo/block.md |

## API

### Props

Common props ref：[Common props](../../docs/vue/common-props.md)

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| bordered | Whether to display the border | boolean | false | - | × |
| size | Set the size of the list. Can be set to `middle`,`small`, or not filled | 'middle' \| 'small' \| 'default' | - | - | × |
| title | The title of the description list, placed at the top | VueNode | - | - | × |
| extra | The action area of the description list, placed at the top-right | VueNode | - | - | × |
| labelRender | - | RenderDescriptionsItem | - | - | × |
| contentRender | - | RenderDescriptionsItem | - | - | × |
| column | The number of `DescriptionItems` in a row, could be a number or a responsive object like `{ xs: 8, sm: 16, md: 24}` | number \| Partial&lt;Record&lt;Breakpoint, number&gt;&gt; | `{xxxl: 4,xxl: 3,xl: 3,lg: 3,md: 3,sm: 2,xs: 1}` | - | × |
| layout | Define description layout | 'horizontal' \| 'vertical' | `horizontal` | - | × |
| colon | Change default props `colon` value of Descriptions.Item. Indicates whether the colon after the label is displayed | boolean | true | - | × |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | DescriptionsStylesType | - | - | ✓ |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | DescriptionsClassNamesType | - | - | ✓ |
| items | Describe the contents of the list item | DescriptionsItemType[] | - | 5.8.0 | × |
| id | - | string | - | - | × |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| title | The title of the description list, placed at the top | () =&gt; any | - |
| extra | The action area of the description list, placed at the top-right | () =&gt; any | - |
| labelRender | - | RenderDescriptionsItem | - |
| contentRender | - | RenderDescriptionsItem | - |

## Semantic DOM

| _semantic | demo/_semantic.md |
