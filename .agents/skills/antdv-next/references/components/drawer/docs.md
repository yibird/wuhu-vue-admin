---
title: Drawer
description: A panel that slides out from the edge of the screen.
---

## When To Use

A Drawer is a panel that is typically overlaid on top of a page and slides in from the side. It contains a set of information or actions. Since the user can interact with the Drawer without leaving the current page, tasks can be achieved more efficiently within the same context.

- Use a Form to create or edit a set of information.
- Processing subtasks. When subtasks are too heavy for a Popover and we still want to keep the subtasks in the context of the main task, Drawer comes very handy.
- When the same Form is needed in multiple places.

> Notes for developers
>
> The `loading` prop renders Skeleton in Drawer.

## Examples

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic-right.md |
| Custom Placement | demo/placement.md |
| Resizable | demo/resizable.md |
| Loading | demo/loading.md |
| Extra Actions | demo/extra.md |
| Render in current dom | demo/render-in-current.md |
| Submit form in drawer | demo/form-in-drawer.md |
| Preview drawer | demo/user-profile.md |
| Multi-level drawer | demo/multi-level-drawer.md |
| Preset size | demo/size.md |
| mask | demo/mask.md |
| Closable placement | demo/closable-placement.md |
| Custom semantic dom styling | demo/style-class.md |

## API

### Props

Common props ref：[Common props](../../docs/vue/common-props.md)

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| afterOpenChange | Callback after the animation ends when switching drawers | (open: boolean) => void | - | - | × |
| classes | Customize class for each semantic structure inside the Drawer component. Supports object or function. | DrawerClassNamesType | - | - | ✓ |
| closable | Whether to show a close button. The position can be configured with `placement` | boolean \| \{ closeIcon?: VueNode, disabled?: boolean, placement?: 'start' \| 'end' \} | true | - | ✓ |
| closeIcon | Custom close icon | VueNode | - | - | ✓ |
| ~~destroyOnClose~~ | Whether to unmount child components on closing drawer or not | boolean | false | - | × |
| destroyOnHidden | Whether to unmount child components on closing drawer or not | boolean | false | - | × |
| extra | Extra actions area at corner | VueNode | - | - | × |
| footer | The footer for Drawer | VueNode | - | - | × |
| forceRender | Pre-render Drawer component forcibly | boolean | false | - | × |
| getContainer | Mounted node and display window for Drawer | string \| HTMLElement \| (() => HTMLElement) \| false | document.body | - | × |
| keyboard | Whether support press esc to close | boolean | true | - | × |
| loading | Show the Skeleton | boolean | false | - | × |
| mask | Mask effect | MaskType | true | - | ✓ |
| maskClosable | Clicking on the mask (area outside the Drawer) to close the Drawer or not | boolean | true | - | × |
| placement | The placement of the Drawer | `top` \| `right` \| `bottom` \| `left` | `right` | - | × |
| push | Nested drawers push behavior | boolean \| \{ distance: string \| number \} | \{ distance: 180 \} | - | × |
| resizable | Enable resizable by dragging | boolean \| [ResizableConfig](#resizableconfig) | - | - | × |
| rootClass | Root container class | string | - | - | × |
| rootStyle | Style of wrapper element which contains mask | CSSProperties | - | - | × |
| size | Preset size of drawer, default `378px` and large `736px`, or a custom number | 'default' \| 'large' \| number | 'default' | - | × |
| styles | Customize inline style for each semantic structure inside the Drawer component. Supports object or function. | DrawerStylesType | - | - | ✓ |
| title | The title for Drawer | VueNode | - | - | × |
| open | Whether the Drawer dialog is visible or not, support `v-model:open` | boolean | false | - | × |
| zIndex | The `z-index` of the Drawer | number | 1000 | - | × |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| afterOpenChange | Callback after the animation ends when switching drawers | (open: boolean) => void | - |
| close | Callback when drawer is closed | (e: MouseEvent \| KeyboardEvent) => void | - |
| keydown | Keyboard keydown event | (e: KeyboardEvent) => void | - |
| keyup | Keyboard keyup event | (e: KeyboardEvent) => void | - |
| mouseenter | Mouse enter event | (e: MouseEvent) => void | - |
| mouseleave | Mouse leave event | (e: MouseEvent) => void | - |
| mouseover | Mouse over event | (e: MouseEvent) => void | - |
| click | Click event | (e: MouseEvent) => void | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| title | Title | () => any | - |
| footer | Footer | () => any | - |
| extra | Extra actions | () => any | - |
| closeIcon | Custom close icon | () => any | - |
| default | Drawer content | () => any | - |

## Types

### ResizableConfig

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| onResizeStart | Callback when resize starts | () => void | - | - |
| onResize | Callback during resizing | (size: number) => void | - | - |
| onResizeEnd | Callback when resize ends | () => void | - | - |

## Semantic DOM 
| _semantic | demo/_semantic.md |
