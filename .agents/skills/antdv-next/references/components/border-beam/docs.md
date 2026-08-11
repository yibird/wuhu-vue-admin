---
title: BorderBeam
description: Decorative component that renders a moving beam along a container border.
---

## When To Use

- Use when a container needs stronger visual emphasis without introducing business state semantics.
- Suitable for login panels, recommendation cards, AI modules, and key CTA blocks.
- As a decorative effect, it should not replace focus rings, validation borders, or status feedback.

## Examples

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Gradients | demo/customized-color.md |
| Non-uniform radius | demo/non-uniform-radius.md |
| Line width | demo/component-token.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

### Props

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| color | Beam color configuration. Supports a single color string or gradient stops. `percent` uses the `0 ~ 100` input range and BorderBeam reserves tail space for the transparent fade | `string \| { color: string, percent: number }[]` | - | - | × |
| outset | Outset distance of the beam layer from the container edge. Set to `0` for clipped containers | `number \| string` | - | - | × |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| default | Decorated content. Must be a single DOM element or a Vue component that forwards its ref to a DOM element | () => any | - |

## FAQ

### How does BorderBeam behave when reduced motion is enabled? 
`BorderBeam` treats the beam as a decorative effect. When `prefers-reduced-motion: reduce` is active, the beam effect is hidden.

### What does `percent` mean in `color`? 
`percent` represents the authored stop position and accepts values from `0` to `100`. BorderBeam maps those stops into the visible beam segment and reserves the trailing area for transparent fade-out so the moving tail stays visible.

### Why is `BorderBeam` not working? 
`BorderBeam` needs to resolve the actual DOM node from the default slot and insert the beam layer into that node. Make sure the slot content is a native DOM element, or a Vue component that correctly forwards its `ref` to a DOM element. Otherwise BorderBeam cannot locate the real container and the beam cannot be rendered.

The beam layer is positioned with `position: absolute`, so the resolved DOM node also needs to provide a positioning context. In most cases, set `position: relative` on the wrapped element. BorderBeam does not inspect or patch the child positioning style for you.

For performance reasons, whether the slot can host the beam and its positioning information are resolved during initialization, and are not continuously updated when the child structure or positioning styles change later.

### How do I keep the beam radius aligned with my container? 
`BorderBeam` reads the computed `border-radius` from the actual container during initialization. This works best for a single-container child such as `Card`; for more complex child trees, set the radius on the actual container root for a more deterministic result.

For performance reasons, the radius is not continuously measured after the initial calculation. Later radius changes caused by size, ancestor styles, or internal child state are not guaranteed to resync automatically. The running beam may still apply internal motion smoothing.

For example:

```vue
<script setup lang="ts">
const radius = 24
</script>

<template>
  <a-border-beam>
    <a-card :style="{ borderRadius: `${radius}px` }" />
  </a-border-beam>
</template>
```
