---
title: Breadcrumb
description: Display the current location within a hierarchy. And allow going back to states higher up in the hierarchy.
---

## When To Use 
- When the system has more than two layers in a hierarchy.
- When you need to inform the user of where they are.
- When the user may need to navigate back to a higher level.

## Demos

| Demo | Path |
| --- | --- |
| Basic Usage | demo/basic.md |
| With an Icon | demo/withIcon.md |
| With Params | demo/withParams.md |
| Configuring the Separator | demo/separator.md |
| Bread crumbs with drop down menu | demo/overlay.md |
| Configuring the Separator Independently | demo/separator-component.md |
| SFC Mode | demo/sfc.md |
| Custom semantic dom styling | demo/style-class.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

### Props

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| dropdownIcon | Custom dropdown icon | VueNode | `<DownOutlined />` | - | ✓ |
| itemRender | Custom item renderer, work with vue-router | (route, params, routes, paths) =&gt; VueNode | - | - | × |
| params | Routing parameters | object | - | - | × |
| items | The routing stack information of router | [ItemType\[\]](#itemtype) | - | - | × |
| separator | Custom separator | VueNode | `/` | - | ✓ |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| clickItem | Triggered when clicking a breadcrumb item | (item: ItemType, event: MouseEvent) =&gt; void | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| itemRender | Custom item renderer, work with vue-router | (route: ItemType, params: AnyObject, routes: ItemType[], paths: string[]) =&gt; any | - |
| titleRender | Custom title renderer | (params: \{ item: ItemType, index: number \}) =&gt; any | - |
| separator | Custom separator | () =&gt; any | - |
| menuLabelRender | Custom menu label renderer | (params: \{ item: ItemType, index: number, menu: MenuItem \}) =&gt; any | - |
| menuExtraRender | Custom menu extra content renderer | (params: \{ item: ItemType, index: number, menu: MenuItem \}) =&gt; any | - |

## Types 
### ItemType 
> type ItemType = Omit&lt;RouteItemType, 'title' | 'path'&gt; | SeparatorType

### RouteItemType 
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| dropdownProps | The dropdown props | [Dropdown](../dropdown/docs.md) | - | - |
| href | Target of hyperlink. Can not work with path | string | - | - |
| path | Connected path. Each path will connect with prev one. Can not work with href | string | - | - |
| menu | The menu props | [MenuProps](../menu/docs.md#api) | - | - |
| onClick | Set the handler to handle click event | (e: MouseEvent) =&gt; void | - | - |
| title | item name | VueNode | - | - |

### SeparatorType 
```ts
const item = {
  type: 'separator', // Must have
  separator: '/',
}
```

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| type | Mark as separator | `separator` | - | - |
| separator | Custom separator | VueNode | `/` | - |

## Use with vue-router 
The link of Breadcrumb item targets `#` by default, you can use `itemRender` slot to make a vue-router Link.

```vue
<script setup lang="ts">
import type { BreadcrumbProps } from 'antdv-next'
import { RouterLink } from 'vue-router'

const items: BreadcrumbProps['items'] = [
  {
    path: '/index',
    title: 'home',
  },
  {
    path: '/first',
    title: 'first',
  },
  {
    path: '/second',
    title: 'second',
  },
]
</script>

<template>
  <a-breadcrumb :items="items">
    <template #itemRender="{ route, paths }">
      <RouterLink v-if="paths.length > 0" :to="`/${paths.join('/')}`">
        {{ route.title }}
      </RouterLink>
      <span v-else>{{ route.title }}</span>
    </template>
  </a-breadcrumb>
</template>
```

## Semantic DOM

| _semantic | demo/_semantic.md |
