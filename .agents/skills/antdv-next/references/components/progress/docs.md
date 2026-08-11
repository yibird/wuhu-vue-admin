---
title: Progress
description: Display the current progress of the operation.
---

## When To Use 
If it will take a long time to complete an operation, you can use `Progress` to show the current progress and status.

- When an operation will interrupt the current interface, or it needs to run in the background for more than 2 seconds.
- When you need to display the completion percentage of an operation.

## Demos

| Demo | Path |
| --- | --- |
| Progress bar | demo/line.md |
| Circular progress bar | demo/circle.md |
| Mini size progress bar | demo/line-mini.md |
| Responsive circular progress bar | demo/circle-micro.md |
| Mini size circular progress bar | demo/circle-mini.md |
| Dynamic | demo/dynamic.md |
| Custom text format | demo/format.md |
| Dashboard | demo/dashboard.md |
| Progress bar with success segment | demo/segment.md |
| Stroke Linecap | demo/linecap.md |
| Custom line gradient | demo/gradient-line.md |
| Progress bar with steps | demo/steps.md |
| Circular progress bar with steps | demo/circle-steps.md |
| Progress size | demo/size.md |
| Change progress value position | demo/info-position.md |
| Custom semantic dom styling | demo/style-class.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

### Props

Properties shared by all types.

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | ProgressClassNamesType | - | - | ✓ |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | ProgressStylesType | - | - | ✓ |
| rootClass | Root container class | string | - | - | × |
| type | To set the type, options: `line` `circle` `dashboard` | ProgressType | `line` | - | × |
| percent | To set the completion percentage | number | 0 | - | × |
| format | The template function of the content | (percent?: number, successPercent?: number) =&gt; any | (percent) =&gt; percent + `%` | - | × |
| status | To set the status of the Progress, options: `success` `exception` `normal` `active`(line only) | (typeof ProgressStatuses)[number] | - | - | × |
| showInfo | Whether to display the progress value and the status icon | boolean | true | - | × |
| strokeWidth | - | number | - | - | × |
| strokeLinecap | To set the style of the progress linecap | 'butt' \| 'square' \| 'round' | `round` | - | × |
| strokeColor | The color of progress bar | string \| string[] \| ProgressGradient | - | - | × |
| railColor | The color of unfilled part | string | - | - | × |
| success | Configs of successfully progress bar | SuccessProps | - | - | × |
| trailColor | The color of unfilled part. Please use `railColor` instead | string | - | - | × |
| width | Deprecated. Use `size` instead | number | - | - | × |
| size | Progress size | number \| [number \| string, number] \| ProgressSize \| &#123; width?: number, height?: number &#125; | `default` | - | × |

### `type="line"` 
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| steps | The total step count | number | - | - |
| rounding | The function to round the value | (step: number) =&gt; number | Math.round | - |
| strokeColor | The color of progress bar, render `linear-gradient` when passing an object, could accept `string[]` when has `steps`. | string \| string[] \| ProgressGradient | - | - |
| percentPosition | Progress value position, passed in object, `align` indicates the horizontal position of the value, `type` indicates whether the value is inside or outside the progress bar | PercentPositionType | &#123; align: 'end', type: 'outer' &#125; | - |

### `type="circle"` 
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| steps | The total step count. When passing an object, `count` refers to the number of steps, and `gap` refers to the distance between them. When passing a number, the default value for `gap` is 2. | number \| &#123; count: number, gap: number &#125; | - | - |
| strokeColor | The color of circular progress, render gradient when passing an object | string \| ProgressGradient | - | - |
| strokeWidth | To set the width of the circular progress, unit: percentage of the canvas width | number | 6 | - |

### `type="dashboard"` 
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| steps | The total step count. When passing an object, `count` refers to the number of steps, and `gap` refers to the distance between them. When passing a number, the default value for `gap` is 2. | number \| &#123; count: number, gap: number &#125; | - | - |
| gapDegree | The gap degree of half circle, 0 ~ 295 | number | 75 | - |
| gapPlacement | The gap placement, options: `top` `bottom` `start` `end` | GapPlacement | `bottom` | - |
| gapPosition | Deprecated. Please use `gapPlacement` instead | GapPosition | `bottom` | - |
| strokeWidth | To set the width of the dashboard progress, unit: percentage of the canvas width | number | 6 | - |

## Semantic DOM 
| _semantic | demo/_semantic.md |
