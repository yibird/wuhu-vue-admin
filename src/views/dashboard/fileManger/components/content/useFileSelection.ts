import {
  computed,
  nextTick,
  shallowRef,
  type CSSProperties,
  type Ref,
} from 'vue'
import type { FileSelectionKey, FileViewMode, IFile } from '../types'
import type { ScrollbarInstance } from '@/components'

interface SelectionRect {
  height: number
  left: number
  top: number
  width: number
}

interface SelectionItemRect {
  key: FileSelectionKey
  rect: SelectionRect
}

interface UseFileSelectionOptions {
  items: Ref<IFile[]>
  selectedKeys: Ref<FileSelectionKey[]>
  viewMode: Ref<FileViewMode>
  containerRef: Ref<ScrollbarInstance | null | undefined>
}

const fileItemSelector = '[data-file-manager-item-id]'
const actionTargetSelector =
  'button, input, textarea, select, a, [role="menuitem"], [data-file-manager-action]'

function getFileIdSelector(id: FileSelectionKey) {
  return `[data-file-manager-item-id="${CSS.escape(id)}"]`
}

function normalizeRect(
  startX: number,
  startY: number,
  currentX: number,
  currentY: number
): SelectionRect {
  return {
    height: Math.abs(currentY - startY),
    left: Math.min(startX, currentX),
    top: Math.min(startY, currentY),
    width: Math.abs(currentX - startX),
  }
}

function intersects(a: SelectionRect, b: SelectionRect) {
  return (
    a.left < b.left + b.width &&
    a.left + a.width > b.left &&
    a.top < b.top + b.height &&
    a.top + a.height > b.top
  )
}

export function useFileSelection({
  items,
  selectedKeys,
  viewMode,
  containerRef,
}: UseFileSelectionOptions) {
  const focusedKey = shallowRef<FileSelectionKey>()
  const selectionAnchorKey = shallowRef<FileSelectionKey>()
  const dragSelection = shallowRef<
    | {
        baseKeys: FileSelectionKey[]
        contentLeft: number
        contentTop: number
        itemRects: SelectionItemRect[]
        pointerId: number
        rect: SelectionRect
        startX: number
        startY: number
        viewportRect: SelectionRect
        viewportStartX: number
        viewportStartY: number
      }
    | undefined
  >()

  const selectableItems = computed(() => items.value)
  const selectedKeySet = computed(() => new Set(selectedKeys.value))
  const dragSelectionStyle = computed<CSSProperties | undefined>(() => {
    const rect = dragSelection.value?.viewportRect
    if (!rect) return undefined

    return {
      position: 'fixed',
      height: `${rect.height}px`,
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      zIndex: 2000,
    }
  })

  function focusContainer() {
    const element =
      containerRef.value?.getElement() ?? containerRef.value?.getScrollElement()
    if (!element) return
    if (element.tabIndex < 0) element.tabIndex = 0
    element.focus({ preventScroll: true })
  }

  function getContentElement() {
    return containerRef.value?.getContentElement() ?? null
  }

  function getItemIndex(key: FileSelectionKey | undefined) {
    if (!key) return -1
    return selectableItems.value.findIndex((item) => item.id === key)
  }

  function getItemElement(key: FileSelectionKey) {
    return getContentElement()?.querySelector<HTMLElement>(
      getFileIdSelector(key)
    )
  }

  function setSelectedKeys(keys: FileSelectionKey[]) {
    const visibleKeys = new Set(selectableItems.value.map((item) => item.id))
    selectedKeys.value = [...new Set(keys)].filter((key) =>
      visibleKeys.has(key)
    )
  }

  function selectOnly(key: FileSelectionKey) {
    focusedKey.value = key
    selectionAnchorKey.value = key
    setSelectedKeys([key])
  }

  function toggleKey(key: FileSelectionKey) {
    focusedKey.value = key
    selectionAnchorKey.value = key
    const nextKeys = new Set(selectedKeys.value)
    if (nextKeys.has(key)) {
      nextKeys.delete(key)
    } else {
      nextKeys.add(key)
    }
    setSelectedKeys([...nextKeys])
  }

  function selectRange(toKey: FileSelectionKey) {
    const anchorKey = selectionAnchorKey.value ?? focusedKey.value ?? toKey
    const anchorIndex = getItemIndex(anchorKey)
    const targetIndex = getItemIndex(toKey)
    if (anchorIndex < 0 || targetIndex < 0) {
      selectOnly(toKey)
      return
    }

    const start = Math.min(anchorIndex, targetIndex)
    const end = Math.max(anchorIndex, targetIndex)
    focusedKey.value = toKey
    setSelectedKeys(
      selectableItems.value.slice(start, end + 1).map((item) => item.id)
    )
  }

  function handleItemClick(file: IFile, event: MouseEvent | KeyboardEvent) {
    focusContainer()

    if (event.shiftKey) {
      selectRange(file.id)
      return
    }

    if (event.ctrlKey || event.metaKey) {
      toggleKey(file.id)
      return
    }

    selectOnly(file.id)
  }

  function handleCheckboxChange(file: IFile, checked: boolean) {
    focusContainer()
    focusedKey.value = file.id
    selectionAnchorKey.value = file.id
    const nextKeys = new Set(selectedKeys.value)
    if (checked) {
      nextKeys.add(file.id)
    } else {
      nextKeys.delete(file.id)
    }
    setSelectedKeys([...nextKeys])
  }

  function clearSelection() {
    selectedKeys.value = []
    focusedKey.value = undefined
    selectionAnchorKey.value = undefined
  }

  function getContentPoint(event: PointerEvent) {
    const content = getContentElement()
    if (!content) return undefined

    const contentRect = content.getBoundingClientRect()
    return {
      x: event.clientX - contentRect.left,
      y: event.clientY - contentRect.top,
    }
  }

  function collectItemRects(content: HTMLElement): SelectionItemRect[] {
    const contentRect = content.getBoundingClientRect()
    return Array.from(content.querySelectorAll<HTMLElement>(fileItemSelector))
      .map((element) => {
        const itemRect = element.getBoundingClientRect()
        const key = element.dataset.fileManagerItemId
        if (!key) return undefined
        return {
          key,
          rect: {
            height: itemRect.height,
            left: itemRect.left - contentRect.left,
            top: itemRect.top - contentRect.top,
            width: itemRect.width,
          },
        }
      })
      .filter((item): item is SelectionItemRect => !!item)
  }

  function getIntersectingKeys(
    rect: SelectionRect,
    itemRects: SelectionItemRect[]
  ) {
    return itemRects
      .filter((item) => intersects(rect, item.rect))
      .map((item) => item.key)
  }

  function handleSelectionPointerDown(event: PointerEvent) {
    if (event.button !== 0) return
    if (!(event.target instanceof HTMLElement)) return
    if (
      event.target.closest(fileItemSelector) ||
      event.target.closest(actionTargetSelector)
    ) {
      return
    }

    const content = getContentElement()
    const point = getContentPoint(event)
    if (!content || !point) return

    const contentRect = content.getBoundingClientRect()
    focusContainer()
    const baseKeys = event.ctrlKey || event.metaKey ? selectedKeys.value : []
    const rect = normalizeRect(point.x, point.y, point.x, point.y)
    const viewportRect = normalizeRect(
      event.clientX,
      event.clientY,
      event.clientX,
      event.clientY
    )
    dragSelection.value = {
      baseKeys,
      contentLeft: contentRect.left,
      contentTop: contentRect.top,
      itemRects: collectItemRects(content),
      pointerId: event.pointerId,
      rect,
      startX: point.x,
      startY: point.y,
      viewportRect,
      viewportStartX: event.clientX,
      viewportStartY: event.clientY,
    }
    if (!baseKeys.length) setSelectedKeys([])
    try {
      content.setPointerCapture(event.pointerId)
    } catch {
      // Some custom scroll containers may retarget pointer events.
    }
    event.preventDefault()
  }

  function handleSelectionPointerMove(event: PointerEvent) {
    const selection = dragSelection.value
    if (!selection || event.pointerId !== selection.pointerId) return

    const point = {
      x: event.clientX - selection.contentLeft,
      y: event.clientY - selection.contentTop,
    }
    const rect = normalizeRect(
      selection.startX,
      selection.startY,
      point.x,
      point.y
    )
    const viewportRect = normalizeRect(
      selection.viewportStartX,
      selection.viewportStartY,
      event.clientX,
      event.clientY
    )
    const selectedByRect = getIntersectingKeys(rect, selection.itemRects)
    dragSelection.value = {
      ...selection,
      rect,
      viewportRect,
    }
    setSelectedKeys([...selection.baseKeys, ...selectedByRect])
    focusedKey.value = selectedByRect.at(-1) ?? selection.baseKeys.at(-1)
  }

  function finishDragSelection(event?: PointerEvent) {
    const selection = dragSelection.value
    if (!selection) return

    const content = getContentElement()
    if (content?.hasPointerCapture(selection.pointerId)) {
      content.releasePointerCapture(selection.pointerId)
    }
    dragSelection.value = undefined
    if (event) event.preventDefault()
  }

  function getGridColumnCount() {
    if (viewMode.value === 'list') return 1

    const content = getContentElement()
    if (!content) return 1

    const first = content.querySelector<HTMLElement>(fileItemSelector)
    if (!first) return 1

    const firstTop = Math.round(first.getBoundingClientRect().top)
    const count = Array.from(
      content.querySelectorAll<HTMLElement>(fileItemSelector)
    ).filter(
      (element) => Math.round(element.getBoundingClientRect().top) === firstTop
    ).length
    return Math.max(1, count)
  }

  function getNextIndex(event: KeyboardEvent) {
    const currentIndex =
      getItemIndex(focusedKey.value) >= 0
        ? getItemIndex(focusedKey.value)
        : Math.max(0, getItemIndex(selectedKeys.value.at(-1)))
    const fallbackIndex = currentIndex >= 0 ? currentIndex : 0
    const columns = getGridColumnCount()
    const maxIndex = selectableItems.value.length - 1

    switch (event.key) {
      case 'ArrowLeft':
        return Math.max(0, fallbackIndex - 1)
      case 'ArrowRight':
        return Math.min(maxIndex, fallbackIndex + 1)
      case 'ArrowUp':
        return Math.max(0, fallbackIndex - columns)
      case 'ArrowDown':
        return Math.min(maxIndex, fallbackIndex + columns)
      case 'Home':
        return 0
      case 'End':
        return maxIndex
      default:
        return -1
    }
  }

  async function scrollItemIntoView(key: FileSelectionKey) {
    await nextTick()
    getItemElement(key)?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (
      ![
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Home',
        'End',
        'a',
        'A',
      ].includes(event.key)
    ) {
      return
    }

    if (
      (event.key === 'a' || event.key === 'A') &&
      (event.ctrlKey || event.metaKey)
    ) {
      event.preventDefault()
      setSelectedKeys(selectableItems.value.map((item) => item.id))
      focusedKey.value = selectableItems.value.at(-1)?.id
      selectionAnchorKey.value = selectableItems.value.at(0)?.id
      return
    }

    const nextIndex = getNextIndex(event)
    if (nextIndex < 0) return

    const nextItem = selectableItems.value[nextIndex]
    if (!nextItem) return

    event.preventDefault()
    if (event.shiftKey) {
      selectRange(nextItem.id)
    } else {
      selectOnly(nextItem.id)
    }
    void scrollItemIntoView(nextItem.id)
  }

  function syncAfterItemsChange() {
    const visibleKeys = new Set(selectableItems.value.map((item) => item.id))
    selectedKeys.value = selectedKeys.value.filter((key) =>
      visibleKeys.has(key)
    )

    if (focusedKey.value && !visibleKeys.has(focusedKey.value)) {
      focusedKey.value = selectedKeys.value.at(-1)
    }
    if (
      selectionAnchorKey.value &&
      !visibleKeys.has(selectionAnchorKey.value)
    ) {
      selectionAnchorKey.value = focusedKey.value
    }
  }

  return {
    dragSelection,
    dragSelectionStyle,
    focusedKey,
    selectedKeySet,
    clearSelection,
    finishDragSelection,
    handleCheckboxChange,
    handleItemClick,
    handleKeyDown,
    handleSelectionPointerDown,
    handleSelectionPointerMove,
    syncAfterItemsChange,
  }
}
