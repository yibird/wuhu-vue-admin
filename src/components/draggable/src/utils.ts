import { Comment, Fragment, Text, isVNode } from 'vue'
import type { VNode, VNodeArrayChildren } from 'vue'

export function flattenDraggableVNodes(children: VNodeArrayChildren): VNode[] {
  const result: VNode[] = []

  for (const child of children) {
    if (Array.isArray(child)) {
      result.push(...flattenDraggableVNodes(child))
      continue
    }

    if (!isVNode(child) || child.type === Comment || child.type === Text) {
      continue
    }

    if (child.type === Fragment && Array.isArray(child.children)) {
      result.push(
        ...flattenDraggableVNodes(child.children as VNodeArrayChildren)
      )
      continue
    }

    result.push(child)
  }

  return result
}
