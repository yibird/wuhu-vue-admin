import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ROOT_ID } from '../core/schema'
import { getLayout, mergeStyle } from '../core/runtime/style'
import type { DesignerApi } from './useDesigner'

export interface DesignerShortcutsOptions {
  designer: DesignerApi
  /** 禁用画布快捷键（例如弹窗打开时） */
  disabled?: () => boolean
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return !!target.closest(
    'input, textarea, select, [contenteditable="true"], .cm-editor'
  )
}

/**
 * 设计器快捷键：
 * Ctrl+Z 撤销 / Ctrl+Shift+Z 重做 / Ctrl+C 复制 / Ctrl+V 粘贴 /
 * Ctrl+D 复制节点 / Delete 删除 / Ctrl+A 选择 / Esc 取消 /
 * 方向键移动（Shift 加速）/ Space 平移画布。
 */
export function useDesignerShortcuts(options: DesignerShortcutsOptions) {
  const { designer } = options
  const spacePressed = ref(false)

  function moveSelected(
    direction: 'left' | 'right' | 'up' | 'down',
    fast: boolean
  ) {
    const ids = [...designer.selectedIds.value]
    if (!ids.length) return
    const index = designer.activeIndex.value
    for (const id of ids) {
      const node = index.get(id)
      if (!node || node.locked) continue
      const parentId = index.getParentId(id)
      const parent = parentId === ROOT_ID ? undefined : index.get(parentId)
      const layout = parent
        ? getLayout(mergeStyle(parent.style, designer.runtime.device.value))
        : 'block'

      if (layout === 'free') {
        const step = fast ? 10 : 1
        const left =
          Number(node.style?.left ?? 0) +
          (direction === 'left' ? -step : direction === 'right' ? step : 0)
        const top =
          Number(node.style?.top ?? 0) +
          (direction === 'up' ? -step : direction === 'down' ? step : 0)
        designer.updateNode(
          id,
          { style: { left, top } },
          { label: '移动组件', mergeKey: `nudge:${id}` }
        )
        continue
      }

      if (fast) {
        if (direction === 'up' || direction === 'left') {
          designer.sendToBack(id)
        } else {
          designer.bringToFront(id)
        }
        continue
      }
      if (direction === 'up' || direction === 'left') {
        designer.reorderNode(id, 'up')
      } else {
        designer.reorderNode(id, 'down')
      }
    }
  }

  function onKeydown(event: KeyboardEvent) {
    if (options.disabled?.() || event.isComposing) return
    const isCtrl = event.ctrlKey || event.metaKey

    if (event.code === 'Space' && !isEditableTarget(event.target)) {
      if (!spacePressed.value) spacePressed.value = true
      event.preventDefault()
      return
    }

    if (isEditableTarget(event.target)) return

    switch (event.key) {
      case 'z':
      case 'Z':
        if (!isCtrl) return
        event.preventDefault()
        if (event.shiftKey) designer.history.redo()
        else designer.history.undo()
        return
      case 'c':
      case 'C':
        if (!isCtrl) return
        event.preventDefault()
        designer.copySelection()
        return
      case 'v':
      case 'V':
        if (!isCtrl) return
        event.preventDefault()
        designer.pasteClipboard()
        return
      case 'd':
      case 'D':
        if (!isCtrl) return
        event.preventDefault()
        designer.duplicateSelected()
        return
      case 'a':
      case 'A':
        if (!isCtrl) return
        event.preventDefault()
        designer.selectMany(
          designer.activeIndex.value.getChildren(ROOT_ID).map((node) => node.id)
        )
        return
      case 'Delete':
      case 'Backspace':
        event.preventDefault()
        designer.removeSelected()
        return
      case 'Escape':
        designer.clearSelection()
        designer.hoveredId.value = undefined
        return
      case 'ArrowUp':
        event.preventDefault()
        moveSelected('up', event.shiftKey)
        return
      case 'ArrowDown':
        event.preventDefault()
        moveSelected('down', event.shiftKey)
        return
      case 'ArrowLeft':
        event.preventDefault()
        moveSelected('left', event.shiftKey)
        return
      case 'ArrowRight':
        event.preventDefault()
        moveSelected('right', event.shiftKey)
        return
      default:
        break
    }
  }

  function onKeyup(event: KeyboardEvent) {
    if (event.code === 'Space') spacePressed.value = false
  }

  function onBlur() {
    spacePressed.value = false
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeydown)
    window.addEventListener('keyup', onKeyup)
    window.addEventListener('blur', onBlur)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown)
    window.removeEventListener('keyup', onKeyup)
    window.removeEventListener('blur', onBlur)
  })

  return { spacePressed }
}
