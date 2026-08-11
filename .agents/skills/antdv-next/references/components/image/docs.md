---
title: Image
description: Preview-able image.
---

## When To Use 
- When you need to display pictures.
- Display when loading a large image or fault tolerant handling when loading fail.

## Demos

| Demo | Path |
| --- | --- |
| Basic Usage | demo/basic.md |
| Fault tolerant | demo/fallback.md |
| Progressive Loading | demo/placeholder.md |
| Multiple image preview | demo/preview-group.md |
| Preview from one image | demo/preview-group-visible.md |
| Custom preview image | demo/previewSrc.md |
| Controlled Preview | demo/controlled-preview.md |
| Custom toolbar render | demo/toolbarRender.md |
| Custom preview render | demo/imageRender.md |
| preview mask | demo/mask.md |
| Custom semantic dom styling | demo/style-class.md |
| nested | demo/nested.md |

## API

### Props

Common props ref：[Common props](../../docs/vue/common-props.md)

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| preview | Preview configuration; set to false to disable | boolean \| PreviewConfig | true | - | ✓ |
| wrapperStyle | Deprecated. | CSSProperties | - | - | × |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | ImageClassNamesType | - | - | ✓ |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | ImageStylesType | - | - | ✓ |
| rootClass | - | string | - | - | × |
| alt | Image description | string | - | _ | × |
| height | Image height | string \| number | - | - | × |
| src | Image URL | string | - | - | × |
| width | Image width | string \| number | - | - | × |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| error | Callback when loading error occurs | NonNullable&lt;VcImageProps['onError']&gt; | - |
| click | - | NonNullable&lt;VcImageProps['onClick']&gt; | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| fallback | Fallback URL when load fails | () =&gt; any | - |
| placeholder | Loading placeholder; if true, uses default placeholder | () =&gt; any | - |

Other Property ref [&lt;img>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#Attributes)

### PreviewType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| actionsRender | Custom toolbar render | (originalNode: VNode, info: ToolbarRenderInfoType) => VNode | - | - |
| closeIcon | Custom close icon | VNode | - | - |
| cover | Custom preview mask | VNode \| [CoverConfig](#coverconfig) | - | - |
| focusTrap | Whether to trap focus within the preview when open | boolean | true | - |
| getContainer | Specify container for preview mounting; still full screen; false mounts at current location | string \| HTMLElement \| (() => HTMLElement) \| false | - | - |
| imageRender | Custom preview content | (originalNode: VNode, info: { transform: [TransformType](#transformtype), image: [ImgInfo](#imginfo) }) => VNode | - | - |
| mask | preview mask effect | boolean \| \{ enabled?: boolean, blur?: boolean \} | true | - |
| maxScale | Maximum zoom scale | number | 50 | - |
| minScale | Minimum zoom scale | number | 1 | - |
| movable | Whether the preview image can be dragged when it is larger than the viewport | boolean | true | - |
| open | Whether to display preview | boolean | - | - |
| rootClassName | Root DOM class name for preview; applies to both image and preview wrapper | string | - | - |
| scaleStep | Each step's zoom multiplier is 1 + scaleStep | number | 0.5 | - |
| src | Custom preview src | string | - | - |
| onOpenChange | Callback when preview open state changes | (visible: boolean) => void | - | - |
| onTransform | Callback for preview transform changes | { transform: [TransformType](#transformtype), action: [TransformAction](#transformaction) } | - | - |

### PreviewGroup

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| fallback | Fallback URL for load error | string | - | - |
| items | Array of preview items | string[] \| { src: string, crossOrigin: string, ... }[] | - | - |
| preview | Preview configuration; disable by setting to false | boolean \| [PreviewGroupType](#previewgrouptype) | true | - |

### PreviewGroupType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| actionsRender | Custom toolbar render | (originalNode: VNode, info: ToolbarRenderInfoType) => VNode | - | - |
| closeIcon | Custom close icon | VNode | - | - |
| countRender | Custom preview count render | (current: number, total: number) => VNode | - | - |
| focusTrap | Whether to trap focus within the preview when open | boolean | true | - |
| current | Index of the current preview image | number | - | - |
| getContainer | Specify container for preview mounting; still full screen; false mounts at current location | string \| HTMLElement \| (() => HTMLElement) \| false | - | - |
| imageRender | Custom preview content | (originalNode: VNode, info: { transform: [TransformType](#transformtype), image: [ImgInfo](#imginfo), current: number }) => VNode | - | - |
| mask | preview mask effect | boolean \| \{ enabled?: boolean, blur?: boolean \} | true | - |
| minScale | Minimum zoom scale | number | 1 | - |
| maxScale | Maximum zoom scale | number | 50 | - |
| movable | Whether the preview image can be dragged when it is larger than the viewport | boolean | true | - |
| open | Whether to display preview | boolean | - | - |
| scaleStep | Each step's zoom multiplier is 1 + scaleStep | number | 0.5 | - |
| onOpenChange | Callback when preview open state changes, includes current preview index | (visible: boolean, info: { current: number }) => void | - | - |
| onChange | Callback when changing preview image | (current: number, prevCurrent: number) => void | - | - |
| onTransform | Callback for preview transform changes | { transform: [TransformType](#transformtype), action: [TransformAction](#transformaction) } | - | - |

## Interface

### TransformType

```typescript
{
  x: number
  y: number
  rotate: number
  scale: number
  flipX: boolean
  flipY: boolean
}
```

### TransformAction

```typescript
type TransformAction
  = | 'flipY'
    | 'flipX'
    | 'rotateLeft'
    | 'rotateRight'
    | 'zoomIn'
    | 'zoomOut'
    | 'close'
    | 'prev'
    | 'next'
    | 'wheel'
    | 'doubleClick'
    | 'move'
    | 'dragRebound'
```

### ToolbarRenderInfoType

```ts
{
  icons: {
    flipYIcon: VNode;
    flipXIcon: VNode;
    rotateLeftIcon: VNode;
    rotateRightIcon: VNode;
    zoomOutIcon: VNode;
    zoomInIcon: VNode;
  };
  actions: {
    onActive?: (index: number) => void;
    onFlipY: () => void;
    onFlipX: () => void;
    onRotateLeft: () => void;
    onRotateRight: () => void;
    onZoomOut: () => void;
    onZoomIn: () => void;
    onReset: () => void;
    onClose: () => void;
  };
  transform: TransformType,
  current: number;
  image: ImgInfo
}
```

### ImgInfo

```ts
{
  url: string
  alt: string
  width: string | number
  height: string | number
}
```

### CoverConfig

```ts
interface CoverConfig {
  coverNode?: VNode // The custom node of preview mask
  placement?: 'top' | 'bottom' | 'center' // Set the position of the preview mask display.
};
```

## Semantic DOM

| _semantic | demo/_semantic.md |
