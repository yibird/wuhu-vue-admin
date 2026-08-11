---
title: Masonry
description: A masonry layout component for displaying content with different heights.
---

## When To Use

- When displaying images or cards with irregular heights.
- When content needs to be evenly distributed in columns.
- When column count needs to be responsive.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Responsive | demo/responsive.md |
| Image | demo/image.md |
| Dynamic | demo/dynamic.md |
| Custom semantic dom styling | demo/style-class.md |
| Fresh | demo/fresh.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

### Props

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| columns | Number of columns, can be a fixed value or a responsive configuration | number \| &#123; xs?: number; sm?: number; md?: number; lg?: number; xl?: number; xxl?: number &#125; | 3 | - | × |
| fresh | Whether to continuously monitor the size changes of child items | boolean | false | - | × |
| gutter | Spacing, can be a fixed value, responsive configuration, or a configuration for horizontal and vertical spacing | [Gap](#gap) \| [[Gap](#gap), [Gap](#gap)] | 0 | - | × |
| items | Masonry items | [MasonryItem](#masonryitem)[] | - | - | × |
| itemRender | Custom item rendering function | (item: MasonryItem) =&gt; VueNode | - | - | × |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| layoutChange | Callback for column sorting changes | (sortInfo: &#123; key: Key; column: number &#125;[]) =&gt; void | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| itemRender | Custom item rendering slot | (itemInfo: MasonryItem & &#123; index: number &#125;) =&gt; VueNode | - |

## Types

### MasonryItem

| Parameter | Description | Type | Default Value |
| --- | --- | --- | --- |
| key | Unique identifier for the item | string \| number | - |
| height | Height of the item | number | - |
| column | Specifies the column to which the item belongs | number | - |
| data | Custom data storage | T | - |
| children | Custom display content, takes precedence over `itemRender` | VueNode | - |

### Gap

`Gap` represents the spacing between items. It can either be a fixed value or a responsive configuration.

```ts
type Gap = undefined | number | Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl', number>>
```

## Semantic DOM

| _semantic | demo/_semantic.md |
