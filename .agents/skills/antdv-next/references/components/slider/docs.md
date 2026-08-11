---
title: Slider
description: A Slider component for displaying current value and intervals in range.
---

## When To Use 
Used to input a value within a specified range.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Slider with InputNumber | demo/input-number.md |
| Slider with icon | demo/icon-slider.md |
| Customize tooltip | demo/tip-formatter.md |
| Event | demo/event.md |
| Graduated slider | demo/mark.md |
| Vertical | demo/vertical.md |
| Control ToolTip | demo/show-tooltip.md |
| Reverse | demo/reverse.md |
| Draggable Track | demo/draggableTrack.md |
| Multiple Handles | demo/multiple.md |
| Dynamic edit nodes | demo/editable.md |
| Disable specific handles | demo/disabled-handle.md |
| Customize Semantic Elements | demo/style-class.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

### Props 
| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| defaultValue | The default value of the slider. When `range` is false, use number, otherwise, use [number, number] | number \| [number, number] | 0 \| [0, 0] | - | × |
| disabled | If true, the slider will not be interactive. Pass `boolean[]` to disable specific handles individually in Range mode | boolean \| boolean[] | false | boolean[]: 1.4.0 | × |
| dots | Whether the thumb can only be dragged to tick marks | boolean | false | - | × |
| included | Takes effect when `marks` is not null. True means containment and false means coordinative | boolean | true | - | × |
| keyboard | Support using keyboard to move handlers | boolean | true | 5.2.0+ | × |
| marks | Tick marks of Slider. The type of key must be `number`, and must be in closed interval [min, max]. Each mark can declare its own style | object | &#123; number: VueNode &#125; \| &#123; number: &#123; style: CSSProperties, label: VueNode &#125; &#125; | - | × |
| max | The maximum value the slider can slide to | number | 100 | - | × |
| min | The minimum value the slider can slide to | number | 0 | - | × |
| orientation | Orientation direction | `horizontal` \| `vertical` | `horizontal` | - | × |
| range | Enable dual thumb mode for range selection | boolean \| [RangeConfig](#rangeconfig) | false | - | × |
| reverse | Reverse the component | boolean | false | - | × |
| step | The granularity the slider can step through values. Must be greater than 0, and be divisible by (max - min). When `step` is `null` and `marks` exist, valid points will only be marks, `min` and `max` | number \| null | 1 | - | × |
| tooltip | The tooltip related props | [TooltipConfig](#tooltipconfig) | - | 4.23.0 | × |
| value | The value of slider. When `range` is false, use number, otherwise, use [number, number], support `v-model:value` | number \| [number, number] | - | - | × |
| vertical | If true, the slider will be vertical. Simultaneously existing with `orientation`, `orientation` takes priority | boolean | false | - | × |

### RangeConfig

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| draggableTrack | Whether range track can be dragged | boolean | false | - |
| editable | Dynamic edit nodes. Cannot be used with `draggableTrack` | boolean | false | 5.20.0 |
| minCount | The minimum count of nodes | number | 0 | 5.20.0 |
| maxCount | The maximum count of nodes | number | - | 5.20.0 |

### TooltipConfig

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autoAdjustOverflow | Whether to automatically adjust the popup position | boolean | true | 5.8.0 |
| formatter | Slider will pass its value to `formatter`, display its value in Tooltip, and hide the Tooltip when the returned value is null | (value: number) =&gt; VueNode \| null | IDENTITY | 4.23.0 |
| getPopupContainer | The DOM container of the Tooltip. The default behavior is to create a div element in the body | (triggerNode: HTMLElement) =&gt; HTMLElement | () =&gt; document.body | 4.23.0 |
| open | If true, Tooltip will always be visible; if false, it will never be visible, even when dragging or hovering | boolean | - | 4.23.0 |
| placement | Set Tooltip display position. Ref [Tooltip](../tooltip/docs.md/) | string | - | 4.23.0 |

### Events 
| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | Callback function that is fired when the user changes the slider's value | (value: number \| [number, number]) =&gt; void | - |
| changeComplete | Fire when `mouseup` or `keyup` is fired | (value: number \| [number, number]) =&gt; void | - |

### Slots 
| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| mark | Custom mark content | (mark: &#123; point: number; label?: any &#125;) =&gt; VueNode | - |

### Methods 
| Name | Description | Version |
| --- | --- | --- |
| blur() | Remove focus | - |
| focus() | Get focus | - |

## Semantic DOM

| _semantic | demo/_semantic.md |
