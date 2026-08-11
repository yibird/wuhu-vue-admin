---
title: Rate
description: Used for rating operation on something.
---

## When To Use 
- Show evaluation.
- A quick rating operation on something.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Half star | demo/half.md |
| Show copywriting | demo/text.md |
| Read only | demo/disabled.md |
| Clear star | demo/clear.md |
| Other Character | demo/character.md |
| Customize character | demo/character-function.md |
| Sizes | demo/size.md |
| Component Token | demo/component-token.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

### Props

| Property | Description | type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| allowClear | Whether to allow clear when click again | boolean | true |  | × |
| allowHalf | Whether to allow semi selection | boolean | false |  | × |
| character | The custom character of rate | VueNode \| (RateProps) => VueNode | &lt;StarFilled /> | function(): 4.4.0 | × |
| count | Star count | number | 5 |  | × |
| disabled | If read only, unable to interact | boolean | false |  | × |
| keyboard | Support keyboard operation | boolean | true | 5.18.0 | × |
| size | Star size | 'small' \| 'middle' \| 'large' | 'middle' |  | × |
| tooltips | Customize tooltip by each character | [TooltipProps](../tooltip/docs.md#api)[\] \| string\[] | - |  | × |
| value | The current value, support `v-model:value` | number | - |  | × |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | Callback when select value | (value: number) =&gt; void | - |
| hoverChange | Callback when hover item | (value: number) =&gt; void | - |
| focus | Callback when component get focus | () =&gt; void | - |
| blur | Callback when component lose focus | () =&gt; void | - |
| keydown | Callback when keydown on component | (e: KeyboardEvent) =&gt; void | - |
| mouseleave | Callback when mouse leaves the component | (e: FocusEvent) =&gt; void | - |

### Methods

| Name    | Description  |
| ------- | ------------ |
| blur()  | Remove focus |
| focus() | Get focus    |
