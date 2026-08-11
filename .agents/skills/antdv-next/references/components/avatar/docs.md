---
title: Avatar
description: Used to represent users or things, supporting the display of images, icons, or characters.
---

## When To Use 
## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Type | demo/type.md |
| Autoset Font Size | demo/dynamic.md |
| With Badge | demo/badge.md |
| Avatar.Group | demo/group.md |
| Responsive Size | demo/responsive.md |

## API

### Avatar

#### Props 
Common props ref：[Common props](../../docs/vue/common-props.md)

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| shape | The shape of avatar | `circle` \| `square` | `circle` | - | × |
| size | The size of the avatar | number \| `large` \| `medium` \| `small` \| `{ xs: number, sm: number, ... }` | `medium` | - | × |
| gap | Letter type unit distance between left and right sides | number | 4 | -     | × |
| src | The address of the image for an image avatar or image element | VueNode | - | -     | × |
| srcSet | A list of sources to use for different screen resolutions | string | - | -     | × |
| draggable | Whether the picture is allowed to be dragged | boolean \| `'true'` \| `'false'` | true | - | × |
| icon | Custom icon type for an icon avatar | VueNode | - | -     | × |
| alt | This attribute defines the alternative text describing the image | string | - | -     | × |
| crossOrigin | CORS settings attributes | '' \| 'anonymous' \| 'use-credentials' | - | -     | × |
| onError | Handler when img load error, return false to prevent default fallback behavior | () =&gt; boolean | - | -     | × |

#### Events 
| Event | Description | Type | Version |
| --- | --- | --- | --- |
| click | - | (e: MouseEvent) =&gt; void | - |

### Slots 
| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| icon | Custom icon type for an icon avatar | () =&gt; any | - |
| src | The address of the image for an image avatar or image element | () =&gt; any | - |

### AvatarGroup

#### Props 
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| prefixCls | - | string | - | - |
| max | - | &#123;     count?: number     style?: CSSProperties     popover?: PopoverProps   &#125; | - | - |
| size | The size of the avatar | AvatarSize | `default` | - |
| shape | The shape of avatar | 'circle' \| 'square' | `circle` | - |
