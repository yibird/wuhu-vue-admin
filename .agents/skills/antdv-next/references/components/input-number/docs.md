---
title: InputNumber
description: Enter a number within certain range with the mouse or keyboard.
---

## When To Use 
When a numeric value needs to be provided.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Sizes | demo/size.md |
| Disabled | demo/disabled.md |
| High precision decimals | demo/digit.md |
| Formatter | demo/formatter.md |
| Keyboard | demo/keyboard.md |
| Wheel | demo/change-on-wheel.md |
| Variants | demo/variant.md |
| Spinner | demo/spinner.md |
| Out of range | demo/out-of-range.md |
| Prefix / Suffix | demo/presuffix.md |
| Status | demo/status.md |
| Focus | demo/focus.md |
| Custom semantic dom styling | demo/style-class.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

### Props 
| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| size | The height of input box | SizeType | - | - | × |
| status | Set validation status | InputStatus | - | - | × |
| disabled | If the input is disabled | boolean | false | - | × |
| addonBefore | The label text displayed before (on the left side of) the input field, please use Space.Compact instead | VueNode | - | - | × |
| addonAfter | The label text displayed after (on the right side of) the input field, please use Space.Compact instead | VueNode | - | - | × |
| prefix | The prefix icon for the Input | VueNode | - | - | × |
| suffix | The suffix icon for the Input | VueNode | - | - | × |
| bordered | Deprecated. | boolean | - | - | × |
| variant | Variants of Input | Variant | `outlined` | - | ✓ |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | InputNumberClassNamesType | - | - | ✓ |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | InputNumberStylesType | - | - | ✓ |
| controls | Whether to show `+-` controls, or set custom arrow icons | boolean \| &#123; upIcon?: VueNode, downIcon?: VueNode &#125; | - | - | × |
| type | - | 'number' \| 'text' | - | - | × |
| max | The max value | number | [Number.MAX_SAFE_INTEGER](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER) | - | × |
| min | The min value | number | [Number.MIN_SAFE_INTEGER](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_SAFE_INTEGER) | - | × |
| step | The number to which the current value is increased or decreased. It can be an integer or decimal | 'number' \| 'string' | 1 | - | × |

### Events 
| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | The callback triggered when the value is changed | (value: any) =&gt; void | - |
| update:value | - | (value: any) =&gt; void | - |
| input | - | (text: string) =&gt; void | - |
| pressEnter | The callback function that is triggered when Enter key is pressed | (e: KeyboardEvent) =&gt; void | - |
| step | `@step`The callback function that is triggered when click up or down buttons / Keyboard / Wheel | (value: any, info: InputNumberStepContext) =&gt; void | - |
| mousedown | - | (e: MouseEvent) =&gt; void | - |
| click | - | (e: MouseEvent) =&gt; void | - |
| mouseup | - | (e: MouseEvent) =&gt; void | - |
| mouseleave | - | (e: MouseEvent) =&gt; void | - |
| mousemove | - | (e: MouseEvent) =&gt; void | - |
| mouseenter | - | (e: MouseEvent) =&gt; void | - |
| mouseout | - | (e: MouseEvent) =&gt; void | - |
| focus | - | (e: FocusEvent) =&gt; void | - |
| blur | - | (e: FocusEvent) =&gt; void | - |
| keydown | - | (e: KeyboardEvent) =&gt; void | - |
| keyup | - | (e: KeyboardEvent) =&gt; void | - |
| compositionstart | - | (e: CompositionEvent) =&gt; void | - |
| compositionend | - | (e: CompositionEvent) =&gt; void | - |
| beforeinput | - | (e: InputEvent) =&gt; void | - |

### Slots 
| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| prefix | The prefix icon for the Input | () =&gt; any | - |
| suffix | The suffix icon for the Input | () =&gt; any | - |
| addonBefore | The label text displayed before (on the left side of) the input field, please use Space.Compact instead | () =&gt; any | - |
| addonAfter | The label text displayed after (on the right side of) the input field, please use Space.Compact instead | () =&gt; any | - |

## Semantic DOM 
| _semantic | demo/_semantic.md |
