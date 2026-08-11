---
title: Steps
description: A navigation bar that guides users through the steps of a task.
---

## When To Use 
When a given task is complicated or has a certain sequence in the series of subtasks, we can decompose it into several steps to make things easier.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Error Status | demo/error.md |
| Vertical | demo/vertical.md |
| Clickable | demo/clickable.md |
| Panel Steps | demo/panel.md |
| With icon | demo/icon.md |
| Title Placement and Progress | demo/title-placement.md |
| Dot Style | demo/progress-dot.md |
| Navigation Steps | demo/nav.md |
| Inline Steps | demo/inline.md |
| Inline Style Combination | demo/inline-variant.md |
| Custom semantic dom styling | demo/style-class.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

The whole of the step bar.

### Props

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| classes | Customize class for each semantic structure inside the component. Supports object or function | StepsClassNamesType | - | - | ✓ |
| current | To set the current step, counting from 0. You can overwrite this state by using `status` of `Step`, support `v-model:current` | number | 0 | - | × |
| iconRender | Custom render icon, please use `items.icon` first | (oriNode, info: &#123; index, active, item &#125;) =&gt; VueNode | - | - | × |
| initial | Set the initial step, counting from 0 | number | 0 | - | × |
| items | StepItem content | [StepItem](#stepitem)[] | [] | 4.24.0 | × |
| maxCount | Maximum number of step items to display (`>= 3`). Hidden step ranges are collapsed into disabled ellipsis steps | number | - | 1.4.0 | × |
| orientation | To specify the orientation of the step bar, `horizontal` or `vertical` | `horizontal` \| `vertical` | `horizontal` | - | × |
| percent | Progress circle percentage of current step in `process` status (only works on basic Steps) | number | - | 4.5.0 | × |
| progressDot | Steps with progress dot style, customize the progress dot by setting it to a function. `titlePlacement` will be `vertical` | boolean \| (iconDot, &#123; index, status, title, content &#125;) =&gt; VueNode | false | - | × |
| responsive | Change to vertical direction when screen width smaller than `532px` | boolean | true | - | × |
| size | To specify the size of the step bar, `default` and `small` are currently supported | `default` \| `small` | `default` | - | × |
| status | To specify the status of current step, can be set to one of the following values: `wait` `process` `finish` `error` | `wait` \| `process` \| `finish` \| `error` | `process` | - | × |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | StepsStylesType | - | - | ✓ |
| titlePlacement | Place title and content with `horizontal` or `vertical` direction | `horizontal` \| `vertical` | `horizontal` | - | × |
| type | Type of steps, can be set to one of the following values: `default` `dot` `inline` `navigation` `panel` | `default` \| `dot` \| `inline` \| `navigation` \| `panel` | `default` | - | × |
| variant | Config style variant | `filled` \| `outlined` | `filled` | - | × |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | Trigger when Step is changed | (current: number) =&gt; void | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| iconRender | Custom render icon, please use `items.icon` first | (info: &#123; oriNode, index, active, item &#125;) =&gt; VueNode | - |
| progressDot | Custom progress dot | (iconDot, &#123; index, status, title, content &#125;) =&gt; VueNode | - |

## Types

### StepItem

A single step in the step bar.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| content | Description of the step, optional property | VueNode | - | - |
| disabled | Disable click | boolean | false | - |
| icon | Icon of the step, optional property | VueNode | - | - |
| status | To specify the status. It will be automatically set by `current` of `Steps` if not configured. Optional values are: `wait` `process` `finish` `error` | `wait` \| `process` \| `finish` \| `error` | `wait` | - |
| subTitle | Subtitle of the step | VueNode | - | - |
| title | Title of the step | VueNode | - | - |

## Semantic DOM

| _semantic | demo/_semantic.md |
