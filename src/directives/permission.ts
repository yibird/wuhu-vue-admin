import { usePermission } from '@/composables'

import type { Directive, DirectiveBinding } from 'vue'

type PermissionValue = string | string[]

interface PermissionElement extends HTMLElement {
  _permissionParent?: ParentNode | null
  _permissionComment?: Comment
}

function checkPermission(value: PermissionValue): boolean {
  const { hasPermission } = usePermission()
  return hasPermission(value)
}

export const permission: Directive<PermissionElement, PermissionValue> = {
  mounted(el: PermissionElement, binding: DirectiveBinding<PermissionValue>) {
    if (!checkPermission(binding.value)) {
      const comment = document.createComment('v-permission')
      el._permissionComment = comment
      el._permissionParent = el.parentNode
      el.parentNode?.replaceChild(comment, el)
    }
  },
  updated(el: PermissionElement, binding: DirectiveBinding<PermissionValue>) {
    const hasPerm = checkPermission(binding.value)
    const comment = el._permissionComment

    if (hasPerm && comment) {
      // 恢复元素
      comment.parentNode?.replaceChild(el, comment)
      el._permissionComment = undefined
    } else if (!hasPerm && !comment) {
      // 移除元素，用注释占位
      const newComment = document.createComment('v-permission')
      el._permissionComment = newComment
      el._permissionParent = el.parentNode
      el.parentNode?.replaceChild(newComment, el)
    }
  },
  unmounted(el: PermissionElement) {
    // 清理占位注释
    if (el._permissionComment) {
      el._permissionComment.parentNode?.removeChild(el._permissionComment)
    }
  },
}
