---
title: Mentions
description: Used to mention someone or something in an input.
---

## When To Use 
When you need to mention someone or something.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Size | demo/size.md |
| Variants | demo/variant.md |
| Asynchronous loading | demo/async.md |
| With Form | demo/form.md |
| Customize Trigger Token | demo/prefix.md |
| disabled or readOnly | demo/readonly.md |
| Placement | demo/placement.md |
| With clear icon | demo/allow-clear.md |
| autoSize | demo/auto-size.md |
| Status | demo/status.md |
| Custom semantic dom styling | demo/style-class.md |
| autoSize debug | demo/autosize-textarea-debug.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

### Props

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| loading | - | boolean | - | - | × |
| status | Set validation status | InputStatus | - | - | × |
| options | Option Configuration | MentionsOptionProps[] | \[] | - | × |
| popupClassName | - | string | - | - | × |
| variant | Variants of Input | Variant | `outlined` | - | ✓ |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | MentionsClassNamesType | - | - | ✓ |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | MentionsStylesType | - | - | ✓ |
| size | - | SizeType | - | - | × |
| labelRender | - | (ctx: &#123; option: MentionsOptionProps, index: number &#125;) =&gt; any | - | - | × |
| allowClear | If allow to remove mentions content with clear icon | boolean \| &#123;     clearIcon?: VueNode   &#125; | false | - | ✓ |
| disabled | - | boolean | - | - | × |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| focus | Trigger when mentions get focus | (event: FocusEvent) =&gt; void | - |
| blur | Trigger when mentions lose focus | (event: FocusEvent) =&gt; void | - |
| change | Trigger when value changed | (value: string) =&gt; void | - |
| select | Trigger when user select the option | (option: MentionsOptionProps, prefix: string) =&gt; void | - |
| popupScroll | Trigger when mentions scroll | (event: Event) =&gt; void | - |
| search | Trigger when prefix hit | (text: string, prefix: string) =&gt; void | - |
| update:value | - | (value: string) =&gt; void | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| suffix | - | () =&gt; any | - |
| labelRender | - | (ctx: &#123; option: MentionsOptionProps, index: number &#125;) =&gt; any | - |

## Semantic DOM 
| _semantic | demo/_semantic.md |
