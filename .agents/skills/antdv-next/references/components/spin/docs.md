---
title: Spin
description: Used for the loading status of a page or a block.
---

## When To Use

When part of the page is waiting for asynchronous data or during a rendering process, an appropriate loading animation can effectively alleviate users' inquietude.

## Examples

## Demos

| Demo | Path |
| --- | --- |
| Basic Usage | demo/basic.md |
| Size | demo/size.md |
| Embedded mode | demo/nested.md |
| Customized description | demo/tip.md |
| Delay | demo/delay-and-debounce.md |
| Custom spinning indicator | demo/custom-indicator.md |
| Progress | demo/percent.md |
| Custom semantic dom styling | demo/style-class.md |
| Fullscreen | demo/fullscreen.md |

## API

### Props

Common props ref：[Common props](../../docs/vue/common-props.md)

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| spinning | Whether Spin is visible | boolean | true | - | × |
| size | The size of Spin, options: `small`, `default` and `large` | SpinSize | `default` | - | × |
| ~~tip~~ | `deprecated, use description`Customize description content when Spin has children | VueNode | - | - | × |
| description | Customize description content | VueNode | - | - | × |
| delay | Specifies a delay in milliseconds for loading state (prevent flush) | number | - | - | × |
| wrapperClassName | The className of wrapper when Spin has children | string | - | - | × |
| indicator | The node of the spinning indicator | VueNode | - | - | ✓ |
| fullscreen | Display a backdrop with the `Spin` component | boolean | false | - | × |
| percent | The progress percentage, when set to `auto`, it will be an indeterminate progress | number \| 'auto' | - | - | × |
| rootClass | Root container class | string | - | - | × |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | SpinClassNamesType | - | - | ✓ |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | SpinStylesType | - | - | ✓ |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| default | Content to wrap with Spin | () =&gt; any | - |
| indicator | The node of the spinning indicator | () =&gt; any | - |
| ~~tip~~ | `deprecated, use description`Customize description content when Spin has children | () =&gt; any | - |
| description | Customize description content | () =&gt; any | - |

### Static Methods

- `Spin.setDefaultIndicator(indicator: VueNode)`

  You can define default spin element globally.

## Semantic DOM

| _semantic | demo/_semantic.md |
