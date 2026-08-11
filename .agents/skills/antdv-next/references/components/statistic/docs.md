---
title: Statistic
description: Display statistic number.
---

## When To Use 
- When want to highlight some data.
- When want to display statistic data with description.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Unit | demo/unit.md |
| In Card | demo/card.md |
| Timer | demo/timer.md |
| Custom semantic dom styling | demo/style-class.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

### Statistic

#### Props 
| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| classes | Customize class for each semantic structure inside the Statistic component. Supports object or function | StatisticClassNamesType | - | - | ✓ |
| decimalSeparator | The decimal separator | string | `.` | - | × |
| formatter | Customize value display logic | (value: number \| string) =&gt; VueNode | - | - | × |
| groupSeparator | Group separator | string | `,` | - | × |
| loading | Loading status of Statistic | boolean | false | - | × |
| precision | The precision of input value | number | - | - | × |
| prefix | The prefix node of value | VueNode | - | - | × |
| styles | Customize inline style for each semantic structure inside the Statistic component. Supports object or function | StatisticStylesType | - | - | ✓ |
| suffix | The suffix node of value | VueNode | - | - | × |
| title | Display title | VueNode | - | - | × |
| value | Display value | string \| number | - | - | × |
| valueStyle | Set value section style | CSSProperties | - | - | × |

#### Slots 
| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| formatter | Customize value display logic | (value: number \| string) =&gt; VueNode | - |
| prefix | The prefix node of value | () =&gt; VueNode | - |
| suffix | The suffix node of value | () =&gt; VueNode | - |
| title | Display title | () =&gt; VueNode | - |

### Statistic.Timer

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classes | Customize class for each semantic structure inside the component. Supports object or function | StatisticClassNamesType | - | - |
| format | Format as [dayjs](https://day.js.org/) | string | `HH:mm:ss` | - |
| prefix | The prefix node of value | VueNode | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | StatisticStylesType | - | - |
| suffix | The suffix node of value | VueNode | - | - |
| title | Display title | VueNode | - | - |
| type | Timer type, countdown or countup | `countdown` \| `countup` | - | - |
| value | Set target time | number | - | - |
| valueStyle | Set value section style | CSSProperties | - | - |

#### Events 
| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | Trigger when time's changing | (value: number) =&gt; void | - |
| finish | Trigger when time's up, only to be called when type is `countdown` | () =&gt; void | - |

#### Slots 
| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| prefix | The prefix node of value | () =&gt; VueNode | - |
| suffix | The suffix node of value | () =&gt; VueNode | - |
| title | Display title | () =&gt; VueNode | - |

## Semantic DOM 
| _semantic | demo/_semantic.md |
