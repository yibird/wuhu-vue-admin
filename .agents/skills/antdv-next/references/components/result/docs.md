---
title: Result
description: Used to feedback the processing results of a series of operations.
---

## When To Use

Use when important operations need to inform the user to process the results and the feedback is more complicated.

## Examples

## Demos

| Demo | Path |
| --- | --- |
| Success | demo/success.md |
| Info | demo/info.md |
| Warning | demo/warning.md |
| 403 | demo/403.md |
| 404 | demo/404.md |
| 500 | demo/500.md |
| Error | demo/error.md |
| Custom icon | demo/customIcon.md |
| Custom semantic dom styling | demo/style-class.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

### Props

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| extra | Operating area | VueNode | - |  | × |
| icon | Custom back icon | VueNode | - |  | × |
| status | Result status, decide icons and colors | `success` \| `error` \| `info` \| `warning` \| `404` \| `403` \| `500` | `info` |  | × |
| subTitle | The subTitle | VueNode | - |  | × |
| title | The title | VueNode | - |  | × |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| icon | Custom back icon | - | - |
| title | The title | - | - |
| subTitle | The subTitle | - | - |
| extra | Operating area | - | - |

## Semantic DOM

| _semantic | demo/_semantic.md |
